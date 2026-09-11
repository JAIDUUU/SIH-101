import { getSupabase } from './supabaseClient.ts';
import { db } from './db.ts';
import type { Course, OfficerProfile } from '../src/types/index.ts';

/**
 * Unified Supabase Synchronization Layer
 * Manages dual synchronization with Supabase for:
 * - Employee data (officers, employees)
 * - Skills & Competency Scores (skills, assessment_scores)
 * - Quizzes & Submissions (skill_assessments, quiz_results)
 * - Course list & Catalog (courses)
 * - Learning progress (learning_progress)
 */
export class SupabaseSync {
  /**
   * Fetches the official course catalog directly from Supabase
   */
  public static async getCourses(): Promise<Course[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('match_percentage', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          provider: row.provider,
          duration: row.duration || '2 Hours',
          difficulty: (row.difficulty as any) || 'Intermediate',
          competenciesGained: row.competencies_gained || [row.difficulty || 'Methodology'],
          matchPercentage: row.match_percentage || 90,
          recommendationReason: row.recommendation_reason || 'Official syllabus match.',
          language: row.language || 'English',
          rating: row.rating || 4.8,
          enrolledCount: row.enrolled_count || 1200,
          tags: row.tags || ['iGOT Karmayogi', 'Official Statistics'],
          portalUrl: row.portal_url || 'https://portal.igotkarmayogi.gov.in',
          officialCircularRef: row.official_circular_ref || 'MoSPI-SADHANA-2026',
          cadreEligibility: row.cadre_eligibility || 'All Statistical Cadres',
        }));
      }
    } catch (err: any) {
      console.info('[SupabaseSync] getCourses notice:', err?.message || err);
    }
    // Fallback to active in-memory / static dataset
    return db.courses;
  }

  /**
   * Persists updated employee profile to Supabase
   */
  public static async syncEmployee(officer: OfficerProfile | any): Promise<void> {
    const supabase = getSupabase();
    const officerRow = {
      officer_id: officer.id || 'usr-1',
      full_name: officer.name || 'Statistical Officer',
      email: (officer.email || 'officer@mospi.gov.in').toLowerCase(),
      employee_id: officer.employeeId || 'MoSPI-SSS-2026-981',
      cadre: officer.cadre || 'Subordinate Statistical Service (SSS)',
      designation: officer.designation || 'Statistical Officer',
      station: officer.station || 'Field Operations Division (FOD)',
      readiness_score: officer.readinessScore ?? 68,
      updated_at: new Date().toISOString(),
    };

    // 1. Sync to officers table
    try {
      await supabase.from('officers').upsert([officerRow], { onConflict: 'officer_id' });
    } catch (err) {
      // Ignore
    }

    // 2. Sync to employees table (if present)
    try {
      await supabase.from('employees').upsert([
        {
          employee_id: officerRow.employee_id,
          full_name: officerRow.full_name,
          email: officerRow.email,
          cadre: officerRow.cadre,
          designation: officerRow.designation,
          station: officerRow.station,
          department: officer.department || 'Field Operations Division',
          readiness_score: officerRow.readiness_score,
          updated_at: officerRow.updated_at,
        }
      ], { onConflict: 'employee_id' });
    } catch (err) {
      // Ignore
    }
  }

  /**
   * Records a quiz / assessment submission in Supabase
   */
  public static async recordAssessmentResult(opts: {
    userEmail: string;
    quizId: string;
    quizTitle: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
  }): Promise<void> {
    const supabase = getSupabase();
    const now = new Date().toISOString();

    // 1. Write to skill_assessments
    try {
      await supabase.from('skill_assessments').insert([
        {
          user_email: opts.userEmail.toLowerCase(),
          quiz_title: opts.quizTitle,
          score: opts.score,
          total: opts.total,
          percentage: opts.percentage,
          passed: opts.passed,
          completed_at: now,
        }
      ]);
    } catch (err) {
      // Ignore
    }

    // 2. Write to quiz_results
    try {
      await supabase.from('quiz_results').insert([
        {
          user_email: opts.userEmail.toLowerCase(),
          quiz_id: opts.quizId,
          quiz_title: opts.quizTitle,
          score: opts.score,
          total: opts.total,
          percentage: opts.percentage,
          passed: opts.passed,
          completed_at: now,
        }
      ]);
    } catch (err) {
      // Ignore
    }
  }

  /**
   * Records learning progress in Supabase
   */
  public static async recordLearningProgress(opts: {
    userEmail: string;
    courseId: string;
    courseTitle: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'completed';
  }): Promise<void> {
    const supabase = getSupabase();
    try {
      await supabase.from('learning_progress').insert([
        {
          user_email: opts.userEmail.toLowerCase(),
          course_id: opts.courseId,
          course_title: opts.courseTitle,
          progress_percentage: opts.progress,
          status: opts.status,
          updated_at: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      // Ignore
    }
  }
}
