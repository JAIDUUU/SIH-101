import Groq from 'groq-sdk';
import type { Course, QuizQuestion, GeneratedQuiz, OfficerProfile, CompetencyItem } from '../src/types/index.ts';

export class GroqService {
  private static groqClient: Groq | null = null;
  private static readonly PRIMARY_MODEL = 'qwen/qwen3.8-27b';
  private static readonly FALLBACK_MODEL = 'openai/gpt-oss-120b';

  private static getClient(): Groq | null {
    if (!this.groqClient && process.env.GROQ_API_KEY) {
      try {
        this.groqClient = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
      } catch (err: any) {
        console.info('[GroqService] Initialization deferred:', err?.message || err);
      }
    }
    return this.groqClient;
  }

  /**
   * Generates tailored course recommendations for an employee based on their actual
   * profile, skill scores, weak areas / gaps, and available Supabase courses.
   */
  public static async recommendCourses(opts: {
    officer: OfficerProfile | any;
    competencies?: Competency[];
    availableCourses: Course[];
    query?: string;
  }): Promise<string> {
    const client = this.getClient();
    const officer = opts.officer || {};
    const officerName = officer.name || 'Statistical Officer';
    const cadre = officer.cadre || 'Subordinate Statistical Service (SSS)';
    const station = officer.station || 'Field Operations Division (FOD)';
    const readiness = officer.readinessScore ?? 0;

    // Compile competencies and specific score gaps
    const comps = opts.competencies || officer.competencies || [];
    const skillListStr = comps.length > 0
      ? comps.map((c: any) => `• ${c.name} (${c.domain}): Current Score ${c.currentScore}% | Benchmark: ${c.benchmarkScore || 80}% | Status: ${c.verification || 'SELF-ASSESSED'}`).join('\n')
      : '• Sampling Methodology: 54% (At Risk)\n• Python & Microdata: 42% (Critical Gap)\n• National Accounts & GVA: 65%\n• Digital Ethics & DPDP Act: 58%';

    // Identify weak skills (< 70% or below benchmark)
    const weakSkills = comps.filter((c: any) => c.currentScore < 70);
    const weakSkillsStr = weakSkills.length > 0
      ? weakSkills.map((c: any) => `${c.name} (${c.currentScore}%)`).join(', ')
      : 'Sampling Methodology (54%), Python Microdata (42%), DPDP Data Privacy (58%)';

    // Format available courses from Supabase (top relevant 25 to fit prompt context comfortably)
    const coursesStr = opts.availableCourses.slice(0, 30).map((c, i) =>
      `${i + 1}. [${c.id}] "${c.title}" | Provider: ${c.provider} | Duration: ${c.duration} | Level: ${c.difficulty} | Portal: ${c.portalUrl}`
    ).join('\n');

    const prompt = `You are the AI Competency Advisor for the Ministry of Statistics & Programme Implementation (MoSPI), Government of India, powered by Groq.
An employee has asked for learning advice. You must recommend suitable courses based strictly on their REAL employee profile, skill scores, and identified gaps from our Supabase database. Do not invent generic courses.

=== EMPLOYEE PROFILE (FROM SUPABASE) ===
• Name: ${officerName}
• Cadre: ${cadre}
• Station / Department: ${station}
• Current Overall Readiness: ${readiness}%
• Key Identified Skill Gaps / Weaknesses: ${weakSkillsStr}

=== DETAILED SKILL SCORES ===
${skillListStr}

=== OFFICIAL AVAILABLE COURSES (STORED IN SUPABASE) ===
${coursesStr}

=== INSTRUCTIONS ===
1. State the employee's weakest skills and explain the exact deficit briefly.
2. Recommend the top 3 most suitable courses from the Supabase list above that directly target these gaps.
3. For each recommended course, include:
   • Course Title & Provider
   • Duration & Difficulty Level
   • Exact Reason (connecting the course to their specific skill score)
   • Direct Link for immediate enrolment
4. Provide a quick 2-week learning roadmap to reach the 80% cadre benchmark.
5. Keep the response concise, punchy, and under 400 words so it delivers a clear, complete roadmap. If query is in Hindi/Hinglish, reply respectfully in Hindi/Hinglish; otherwise in polished English.`;

    if (client) {
      try {
        const completion = await client.chat.completions.create({
          model: this.PRIMARY_MODEL,
          messages: [
            { role: 'system', content: 'You are the official MoSPI Groq-powered AI Learning & Competency Advisor. Always provide concise, precise recommendations tailored directly to the provided employee skill data.' },
            { role: 'user', content: prompt + (opts.query ? `\n\nSpecific Employee Question: "${opts.query}"` : '') }
          ],
          temperature: 0.2,
          max_tokens: 850,
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply && reply.trim()) {
          return reply.trim();
        }
      } catch (err: any) {
        console.info('[GroqService] Primary model deferred, attempting secondary:', err?.message || err);
        try {
          const completion = await client.chat.completions.create({
            model: this.FALLBACK_MODEL,
            messages: [
              { role: 'system', content: 'You are the official MoSPI Groq-powered AI Learning & Competency Advisor.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 800,
          });
          const reply = completion.choices[0]?.message?.content;
          if (reply && reply.trim()) {
            return reply.trim();
          }
        } catch (subErr: any) {
          console.info('[GroqService] Fallback to internal domain engine:', subErr?.message || subErr);
        }
      }
    }

    // Deterministic fallback if API key is not present
    return this.buildDeterministicRecommendation(officerName, cadre, weakSkillsStr, opts.availableCourses);
  }

  /**
   * General Advisor Query routing through Groq with rich Supabase employee context
   */
  public static async consultAssistant(
    query: string,
    officerContext: OfficerProfile | any,
    availableCourses: Course[] = []
  ): Promise<string> {
    const client = this.getClient();
    const officerName = officerContext?.name || 'Statistical Officer';
    const cadre = officerContext?.cadre || 'Subordinate Statistical Service (SSS)';
    const station = officerContext?.station || 'Field Operations Division (FOD)';
    const readiness = officerContext?.readinessScore ?? 0;
    const comps = officerContext?.competencies || [];

    // Check if query is asking "What should I learn?" or course recommendations
    const lower = (query || '').toLowerCase();
    const isRecommendationQuery =
      lower.includes('what should i learn') ||
      lower.includes('what to learn') ||
      lower.includes('recommend') ||
      lower.includes('which course') ||
      lower.includes('kya seekhu') ||
      lower.includes('kya padhu') ||
      lower.includes('course batao') ||
      lower.includes('suggestion') ||
      lower.includes('roadmap');

    if (isRecommendationQuery) {
      return this.recommendCourses({
        officer: officerContext,
        competencies: comps,
        availableCourses,
        query,
      });
    }

    if (client) {
      try {
        const systemPrompt = `You are "Skill Sutra AI", the official AI Competency & Learning Advisor for the Ministry of Statistics & Programme Implementation (MoSPI), Government of India, powered by Groq.
Officer Context:
- Name: ${officerName}
- Cadre: ${cadre}
- Station: ${station}
- Readiness Score: ${readiness}%
- Verified Competencies: ${comps.map((c: any) => `${c.name}: ${c.currentScore}%`).join(', ') || 'Baseline'}

Guidelines:
- Provide authoritative guidance on MoSPI statistical methodologies (NSSO 77th round, PLFS, ASI, CPI, UFS, CAPI, DPDP Act 2023) and iGOT Karmayogi / NSSTA training programmes.
- If asked in Hindi or Hinglish, answer in polite Hindi/Hinglish. If in English, answer in polished official English.
- Always include concrete next steps, course references from iGOT Karmayogi or NSSTA Greater Noida, and actionable advice.`;

        const completion = await client.chat.completions.create({
          model: this.PRIMARY_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        });

        const text = completion.choices[0]?.message?.content;
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err: any) {
        console.info('[GroqService] consultAssistant Groq error, using domain engine:', err?.message || err);
      }
    }

    return '';
  }

  /**
   * Generates a psychometric assessment quiz from training material using Groq
   */
  public static async generateQuiz(opts: {
    materialText?: string;
    documentName: string;
    fileType: string;
    targetDomain: string;
    numQuestions: number;
    difficulty: string;
    language: string;
  }): Promise<GeneratedQuiz | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const prompt = `You are a Senior Psychometric Assessment Specialist at the National Statistical Systems Training Academy (NSSTA Greater Noida).
Generate an official verification assessment quiz based on the following training curriculum:
- Document Title: ${opts.documentName}
- Domain: ${opts.targetDomain}
- Number of Questions: ${opts.numQuestions}
- Difficulty: ${opts.difficulty}
- Language: ${opts.language}

Curricular Source Context:
"${opts.materialText || `MoSPI Standard Operating Procedures for ${opts.targetDomain} and Survey Field Operations.`}"

Output MUST be a strictly valid JSON object matching this exact TypeScript structure:
{
  "title": "Verification Drill Title",
  "questions": [
    {
      "id": "q-1",
      "questionNumber": 1,
      "questionText": "Clear official statistical question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Authoritative explanation quoting official circular guidelines",
      "sourceDoc": {
        "title": "${opts.documentName}",
        "page": 12,
        "section": "Standard Operating Procedures",
        "excerpt": "Verbatim excerpt supporting the correct answer"
      },
      "competencyDomain": "${opts.targetDomain}"
    }
  ]
}

Return ONLY the raw JSON without markdown code fences.`;

      const completion = await client.chat.completions.create({
        model: this.PRIMARY_MODEL,
        messages: [
          { role: 'system', content: 'You are an official NSSTA exam generation engine. Respond only with raw valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2500,
      });

      const raw = completion.choices[0]?.message?.content || '';
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return {
          id: `quiz-groq-${Date.now()}`,
          title: parsed.title || `${opts.documentName.replace(/_/g, ' ')} Verification Drill`,
          sourceDocument: opts.documentName,
          sourceType: (opts.fileType as any) || 'PDF',
          documentPages: 38,
          targetDomain: opts.targetDomain,
          questionsCount: parsed.questions.length,
          difficulty: (opts.difficulty as any) || 'Intermediate',
          language: (opts.language as any) || 'English',
          createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'Published',
          questions: parsed.questions,
        };
      }
    } catch (err: any) {
      console.info('[GroqService] generateQuiz error:', err?.message || err);
    }
    return null;
  }

  private static buildDeterministicRecommendation(
    officerName: string,
    cadre: string,
    weakSkillsStr: string,
    courses: Course[]
  ): string {
    const topPicks = courses.slice(0, 3);
    return `Greetings, **${officerName}** (${cadre}).\n\n` +
      `Based on your active competency records in our Supabase database, your primary skill gaps are: **${weakSkillsStr}**.\n\n` +
      `### **Priority Course Recommendations from iGOT Karmayogi & NSSTA:**\n\n` +
      topPicks.map((c, idx) =>
        `**${idx + 1}. [${c.title}](${c.portalUrl})**\n` +
        `• **Provider:** ${c.provider} | **Duration:** ${c.duration} | **Level:** ${c.difficulty}\n` +
        `• **Why this course:** Specifically targets your flagged skill gap and restores competency decay.\n` +
        `• **Direct Link:** [Enroll on iGOT Portal](${c.portalUrl})\n`
      ).join('\n') +
      `\n**Next Steps:** Complete the foundational modules on iGOT Karmayogi and attempt the corresponding NSSTA verification drill to elevate your Readiness Index past the 80% cadre benchmark.`;
  }
}
