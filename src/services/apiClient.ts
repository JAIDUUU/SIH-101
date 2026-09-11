import { OfficerProfile, Course, GeneratedQuiz, PeerOfficer, NotificationItem, CompetencyItem } from '../types';

export class ApiClient {
  private static baseUrl = '/api';

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errDetail = '';
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) {
          errDetail = errJson.error;
        }
      } catch {}
      throw new Error(errDetail || `API Error ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  // Auth
  public static async login(email: string, role: string, password?: string) {
    return this.request<{ accessToken: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role, password }),
    });
  }

  public static async registerOfficer(data: {
    fullName: string;
    email: string;
    employeeId?: string;
    cadre?: string;
    designation?: string;
    station?: string;
    password?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      accessToken: string;
      user: any;
      officer: OfficerProfile;
    }>('/auth/register-officer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Trainer Management (Requirement 2)
  public static async createTrainer(data: {
    trainerName: string;
    trainerId: string;
    password: string;
    department?: string;
    specialization?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      trainer: any;
    }>('/admin/create-trainer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async getTrainers() {
    return this.request<{
      trainers: Array<{
        id: string;
        name: string;
        email: string;
        department: string;
        specialization: string;
        createdAt: string;
        status: string;
      }>;
      totalCount: number;
    }>('/admin/trainers');
  }

  // Profile
  public static async getProfile() {
    return this.request<{
      officer: OfficerProfile;
      competencies: CompetencyItem[];
      activeCourses: Course[];
      passport: { passportId: string; issuedDate: string; verifiedCredentials: number };
    }>('/profiles/me');
  }

  public static async updateProfile(data: {
    fullName?: string;
    designation?: string;
    cadre?: string;
    department?: string;
    station?: string;
    experienceYears?: number;
    selfAssessedSkills?: Record<string, number>;
  }) {
    return this.request<{ status: string; officer: OfficerProfile }>('/profiles/update', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Competencies & Decay
  public static async getCompetencies() {
    return this.request<CompetencyItem[]>('/competencies');
  }

  public static async getSkillDecay() {
    return this.request<{
      featureLabel: string;
      disclaimer: string;
      projections: any[];
    }>('/skills/decay');
  }

  // Recommendations & Courses
  public static async getRecommendations() {
    return this.request<Course[]>('/recommendations');
  }

  public static async getNextBestSkill() {
    return this.request<any>('/recommendations/next-best-skill');
  }

  public static async aiAssessCompetency(data: {
    competencyName: string;
    competencyDomain?: string;
    selfAssessedScore?: number;
    quizPerformance?: {
      quizTitle?: string;
      scorePercentage?: number;
    };
    evidenceNotes?: string;
    targetBenchmark?: number;
  }) {
    return this.request<{
      competency: string;
      currentAssessedLevel: number;
      confidence: 'LOW' | 'MEDIUM' | 'HIGH';
      evidence: string;
      identifiedGap: number;
      targetBenchmark: number;
      recommendedNextAction: string;
      source: string;
    }>('/competencies/ai-assess', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async getCourses() {
    return this.request<Course[]>('/courses');
  }

  public static async syncOfficialCourses() {
    return this.request<{
      success: boolean;
      syncedAt: string;
      sources: string[];
      count: number;
      courses: Course[];
    }>('/courses/sync-official', {
      method: 'POST',
    });
  }

  public static async updateCourseProgress(courseId: string, progress: number, status: string) {
    return this.request<{ status: string; course: Course }>('/courses/progress', {
      method: 'POST',
      body: JSON.stringify({ courseId, progress, status }),
    });
  }

  // Materials & Quizzes
  public static async uploadMaterial(fileName: string, fileType: string = 'PDF') {
    return this.request<any>('/materials/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileType }),
    });
  }

  public static async generateQuiz(config: {
    documentName: string;
    fileType: 'PDF' | 'PPT' | 'DOCX';
    targetDomain: string;
    numQuestions: number;
    difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
    language: 'English' | 'Hindi' | 'Bilingual';
  }) {
    return this.request<GeneratedQuiz>('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  public static async getCurrentQuiz() {
    return this.request<GeneratedQuiz>('/quizzes/current');
  }

  public static async publishQuiz(quizId: string) {
    return this.request<{ status: string; quiz: GeneratedQuiz }>('/quizzes/publish', {
      method: 'POST',
      body: JSON.stringify({ quizId }),
    });
  }

  public static async regenerateQuestion(params: {
    questionId?: string;
    documentName?: string;
    difficulty?: string;
    language?: string;
  }) {
    return this.request<{ success: boolean; question: any }>('/quizzes/regenerate-question', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Assessments
  public static async submitAssessment(quizId: string, answers: Record<number, number>) {
    return this.request<{
      quizId: string;
      score: number;
      total: number;
      percentage: number;
      passed: boolean;
      weakDomains: string[];
      updatedCompetencies: Array<{ name: string; oldScore: number; newScore: number }>;
      newReadinessScore: number;
      skillEventId: string;
      officer: OfficerProfile;
    }>('/assessments/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers }),
    });
  }

  // Peers
  public static async getPeers() {
    return this.request<PeerOfficer[]>('/peers/match');
  }

  public static async connectPeer(peerId: string) {
    return this.request<{ status: string; peerId: string; message: string }>('/peers/connect', {
      method: 'POST',
      body: JSON.stringify({ peerId }),
    });
  }

  // Analytics
  public static async getAnalytics() {
    return this.request<any>('/analytics/workforce');
  }

  // Notifications
  public static async getNotifications() {
    return this.request<NotificationItem[]>('/notifications');
  }

  // AI Assistant
  public static async consultAssistant(query: string, officerContext?: any) {
    return this.request<{ reply: string }>('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ query, officer: officerContext }),
    });
  }

  // Supabase Integration Status
  public static async getSupabaseStatus() {
    return this.request<{
      connected: boolean;
      projectId: string;
      url: string;
      error?: string;
    }>('/supabase/status');
  }

  // Supabase Sync / Seed
  public static async seedSupabase() {
    return this.request<{
      success: boolean;
      report: Record<string, string>;
      message: string;
    }>('/supabase/seed', { method: 'POST' });
  }

  // Master Data
  public static async getMasterData() {
    return this.request<{
      success: boolean;
      data: any;
    }>('/master-data');
  }

  // AI Skill Gap Engine (Requirement 6)
  public static async getGapAnalysis(benchmark: number = 80) {
    return this.request<any>(`/competencies/gap-analysis?benchmark=${benchmark}`);
  }

  // Workforce Heatmap (Requirement 14)
  public static async getWorkforceHeatmap(filters: {
    organization?: string;
    department?: string;
    state_ut?: string;
    designation?: string;
    competency?: string;
  } = {}) {
    const params = new URLSearchParams();
    if (filters.organization) params.set('organization', filters.organization);
    if (filters.department) params.set('department', filters.department);
    if (filters.state_ut) params.set('state_ut', filters.state_ut);
    if (filters.designation) params.set('designation', filters.designation);
    if (filters.competency) params.set('competency', filters.competency);
    return this.request<any>(`/analytics/workforce-heatmap?${params.toString()}`);
  }

  // Sunbird RC & e-Sankhyiki (Requirements 1 & 4)
  public static async getSunbirdDiscovery() {
    return this.request<any>('/sunbird-rc/discovery');
  }

  public static async getESankhyikiDatasets() {
    return this.request<any>('/e-sankhyiki/datasets');
  }
}

