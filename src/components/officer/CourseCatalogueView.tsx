import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import { ApiClient } from '../../services/apiClient';
import {
  Search,
  Filter,
  BookOpen,
  Sparkles,
  Clock,
  Award,
  Star,
  Play,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Building2,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';

interface CourseCatalogueViewProps {
  onNavigate: (viewId: string) => void;
}

export const CourseCatalogueView: React.FC<CourseCatalogueViewProps> = ({
  onNavigate,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Foundational' | 'Intermediate' | 'Advanced'>('All');
  const [languageFilter, setLanguageFilter] = useState<'All' | 'English' | 'Hindi' | 'Bilingual'>('All');
  const [onlyRecommended, setOnlyRecommended] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, number>>({});

  const [selectedDomainTab, setSelectedDomainTab] = useState<string>('All');

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // Fetch both AI-ranked recommendations and complete catalogue
      const [recs, catalogue] = await Promise.all([
        ApiClient.getRecommendations().catch(() => []),
        ApiClient.getCourses().catch(() => []),
      ]);

      const recsMap = new Map<string, Course>();
      if (Array.isArray(recs)) {
        recs.forEach((r) => recsMap.set(r.id, r));
      }

      const mergedCourses: Course[] = [];
      const seenIds = new Set<string>();

      // Put high match recommendations first
      if (Array.isArray(recs)) {
        recs.forEach((r) => {
          mergedCourses.push(r);
          seenIds.add(r.id);
        });
      }

      if (Array.isArray(catalogue)) {
        catalogue.forEach((c) => {
          if (!seenIds.has(c.id)) {
            const rec = recsMap.get(c.id);
            mergedCourses.push(rec || c);
            seenIds.add(c.id);
          }
        });
      }

      if (mergedCourses.length > 0) {
        setCourses(mergedCourses);
      }
    } catch (err) {
      console.warn('Failed to fetch official courses from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSyncOfficial = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await ApiClient.syncOfficialCourses();
      if (res && res.courses) {
        setCourses(res.courses);
        setSyncStatus(`Successfully synchronized ${res.courses.length} official programmes from nssta.gov.in & mospi.gov.in (Sync time: ${new Date(res.syncedAt).toLocaleTimeString()})`);
      }
    } catch (err: any) {
      console.warn('Sync failed:', err);
      setSyncStatus('Failed to sync official courses. Displaying cached official curriculum.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEnrollOrProgress = async (course: Course) => {
    const nextProgress = Math.min(100, (course.progress || 0) + 25);
    const nextStatus = nextProgress >= 100 ? 'completed' : 'in-progress';

    try {
      await ApiClient.updateCourseProgress(course.id, nextProgress, nextStatus);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, progress: nextProgress, status: nextStatus } : c
        )
      );
      setEnrolledCourses((prev) => ({ ...prev, [course.id]: nextProgress }));
    } catch (err) {
      console.warn('Course progress update error:', err);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.competenciesGained.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.officialCircularRef && course.officialCircularRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.cadreEligibility && course.cadreEligibility.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource =
      sourceFilter === 'All' ||
      (sourceFilter === 'NSSTA TPAC'
        ? course.provider.toLowerCase().includes('nssta') ||
          course.provider.toLowerCase().includes('tpac') ||
          course.tags.some((t) => t.toLowerCase().includes('nssta') || t.toLowerCase().includes('tpac'))
        : course.provider.toLowerCase().includes(sourceFilter.toLowerCase()) ||
          course.tags.some((t) => t.toLowerCase().includes(sourceFilter.toLowerCase())));
    const matchesDifficulty = difficultyFilter === 'All' || course.difficulty === difficultyFilter;
    const matchesLanguage = languageFilter === 'All' || course.language === languageFilter;
    const matchesRecommended = !onlyRecommended || course.matchPercentage >= 85;

    const matchesDomain =
      selectedDomainTab === 'All' ||
      (selectedDomainTab === 'Survey Sampling & Field' &&
        (course.title.toLowerCase().includes('sampling') || course.tags.some(t => t.toLowerCase().includes('sampling') || t.toLowerCase().includes('plfs') || t.toLowerCase().includes('hces')) || course.competenciesGained.some(c => c.toLowerCase().includes('sampling')))) ||
      (selectedDomainTab === 'Price & Inflation' &&
        (course.title.toLowerCase().includes('price') || course.title.toLowerCase().includes('cpi') || course.tags.some(t => t.toLowerCase().includes('price') || t.toLowerCase().includes('cpi')))) ||
      (selectedDomainTab === 'National Accounts & GVA' &&
        (course.title.toLowerCase().includes('national accounts') || course.title.toLowerCase().includes('gva') || course.tags.some(t => t.toLowerCase().includes('accounts') || t.toLowerCase().includes('gva')))) ||
      (selectedDomainTab === 'AI, Python & Data Science' &&
        (course.title.toLowerCase().includes('ai') || course.title.toLowerCase().includes('python') || course.title.toLowerCase().includes('intelligence') || course.title.toLowerCase().includes('data science') || course.tags.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('python')))) ||
      (selectedDomainTab === 'Administration & Leadership' &&
        (course.title.toLowerCase().includes('governance') || course.title.toLowerCase().includes('leadership') || course.title.toLowerCase().includes('public') || course.tags.some(t => t.toLowerCase().includes('governance') || t.toLowerCase().includes('leadership'))));

    return matchesSearch && matchesSource && matchesDifficulty && matchesLanguage && matchesRecommended && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-technical uppercase tracking-widest text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5">
                OFFICIAL GOVERNMENT API INTEGRATION
              </span>
              <span className="text-xs font-technical text-zinc-500">
                LIVE SOURCES: nssta.gov.in & mospi.gov.in
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Official Statistical Curriculum & Course Repository
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              All courses, circulars, and competency drills are fetched directly via the official training APIs of the <strong>National Statistical Systems Training Academy (NSSTA)</strong> and the <strong>Ministry of Statistics & Programme Implementation (MoSPI)</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 font-technical text-xs">
            <button
              onClick={handleSyncOfficial}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-zinc-950 hover:bg-black text-amber-400 border border-zinc-900 flex items-center gap-2 font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Gov APIs...' : 'Sync Live Gov Portals'}</span>
            </button>
          </div>
        </div>

        {/* Sync notification banner */}
        {syncStatus && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-xs font-technical text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-300 p-5 space-y-4">
        {/* Domain Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {[
            'All',
            'Survey Sampling & Field',
            'Price & Inflation',
            'National Accounts & GVA',
            'AI, Python & Data Science',
            'Administration & Leadership',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedDomainTab(tab)}
              className={`px-3 py-1 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedDomainTab === tab
                  ? 'bg-zinc-950 text-amber-400 border-zinc-950 font-bold shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
              }`}
            >
              {tab === 'All' ? 'All Catalog (55+)' : tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by official circular, topic, survey name (e.g. Sampling, GVA, PLFS, CPI, CSPro, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-zinc-900"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
          </div>

          {/* Quick Clear */}
          {(searchQuery || sourceFilter !== 'All' || difficultyFilter !== 'All' || onlyRecommended || selectedDomainTab !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSourceFilter('All');
                setDifficultyFilter('All');
                setOnlyRecommended(false);
                setSelectedDomainTab('All');
              }}
              className="px-3 py-2 text-xs font-technical uppercase tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-300 hover:bg-zinc-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-200 text-xs font-technical">
          {/* Source / Portal Filter */}
          <div>
            <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">
              Government Portal Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full bg-[#FAF9F6] border border-zinc-300 px-2 py-1.5 text-xs text-zinc-900 focus:outline-none"
            >
              <option value="All">All Official Portals</option>
              <option value="NSSTA TPAC">NSSTA TPAC Recommended Programmes</option>
              <option value="iGOT Karmayogi">portal.igotkarmayogi.gov.in (iGOT Karmayogi)</option>
              <option value="SADHANA Saptah">SADHANA Saptah (Curated iGOT Special)</option>
              <option value="nssta.gov.in">nssta.gov.in (NSSTA Academy)</option>
              <option value="mospi.gov.in">mospi.gov.in (MoSPI Portal)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">
              Competency Level
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="w-full bg-[#FAF9F6] border border-zinc-300 px-2 py-1.5 text-xs text-zinc-900 focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Foundational">Foundational</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">
              Medium of Instruction
            </label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value as any)}
              className="w-full bg-[#FAF9F6] border border-zinc-300 px-2 py-1.5 text-xs text-zinc-900 focus:outline-none"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>

          {/* Cadre Priority Toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyRecommended}
                onChange={(e) => setOnlyRecommended(e.target.checked)}
                className="accent-amber-500 rounded-none w-3.5 h-3.5"
              />
              <span className="text-[11px] font-bold text-zinc-800">
                High Match (≥85%) Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs font-technical text-zinc-600 px-1">
        <span>
          Showing <strong>{filteredCourses.length}</strong> official training programmes verified from{' '}
          <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300 text-zinc-800">nssta.gov.in</code> &{' '}
          <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300 text-zinc-800">mospi.gov.in</code>
        </span>
        <span className="text-zinc-500">
          Source Synchronized: Live NIC Gateway
        </span>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-zinc-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600 mb-2" />
          <p className="text-xs font-technical text-zinc-600">
            Querying official government training catalogues from nssta.gov.in & mospi.gov.in...
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white border border-zinc-200 space-y-3">
          <BookOpen className="w-8 h-8 mx-auto text-zinc-400" />
          <h3 className="text-sm font-bold text-zinc-950 font-heading">
            No matching training programmes found
          </h3>
          <p className="text-xs text-zinc-600 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to view all official statistical courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCourses.map((course) => {
            const isCompleted = course.status === 'completed' || course.progress === 100;
            const isInProgress = course.status === 'in-progress' || (course.progress && course.progress > 0 && course.progress < 100);

            return (
              <div
                key={course.id}
                className="bg-white border border-zinc-300 p-5 shadow-xs hover:border-zinc-900 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Provider Badge + Circular Ref + Match */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-technical uppercase font-bold px-2 py-0.5 bg-zinc-950 text-amber-400 border border-zinc-800">
                          {course.provider}
                        </span>
                        {course.officialCircularRef && (
                          <span className="text-[10px] font-technical text-zinc-700 bg-zinc-100 border border-zinc-300 px-1.5 py-0.5">
                            Ref: {course.officialCircularRef}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-technical text-zinc-500 block">
                        {course.duration} · {course.difficulty} · {course.language}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-technical text-zinc-500 block">
                        CADRE MATCH
                      </span>
                      <span className="text-sm font-bold font-technical text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5">
                        {course.matchPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-950 font-heading leading-snug">
                    {course.title}
                  </h3>

                  {/* Cadre Eligibility */}
                  {course.cadreEligibility && (
                    <div className="p-2 bg-[#F8F9FA] border border-zinc-200 text-xs font-technical text-zinc-700">
                      <strong className="text-zinc-900">Cadre Eligibility:</strong> {course.cadreEligibility}
                    </div>
                  )}

                  {/* Recommendation Reason */}
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 text-xs font-sans text-amber-950 space-y-1">
                    <div className="flex items-center gap-1 font-technical text-[10px] uppercase font-bold text-amber-900">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Cadre Alignment Rationale:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {course.recommendationReason}
                    </p>
                  </div>

                  {/* Syllabus breakdown */}
                  {course.syllabusTopics && course.syllabusTopics.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block">
                        Official Syllabus Topics:
                      </span>
                      <ul className="text-xs text-zinc-700 space-y-1 pl-4 list-disc font-sans">
                        {course.syllabusTopics.map((topic, idx) => (
                          <li key={idx} className="text-[11px]">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competencies Gained */}
                  <div className="pt-2">
                    <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1.5">
                      Competencies Accredited:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.competenciesGained.map((comp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-technical px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Progress */}
                <div className="pt-3 border-t border-zinc-200 space-y-3">
                  {/* Progress Bar if started */}
                  {course.progress !== undefined && course.progress > 0 && (
                    <div className="space-y-1 font-technical text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-600">Curricular Completion Progress</span>
                        <span className="font-bold text-zinc-950">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 border border-zinc-200">
                        <div
                          className={`h-full ${course.progress >= 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 font-technical text-xs">
                    {course.portalUrl ? (
                      <a
                        href={course.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-1 transition-colors ${
                          course.portalUrl.includes('igotkarmayogi')
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                            : 'text-zinc-700 hover:text-zinc-950 hover:underline'
                        }`}
                      >
                        <span>
                          {course.portalUrl.includes('igotkarmayogi')
                            ? 'Open in iGOT Karmayogi'
                            : 'View on Gov Portal'}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 text-[11px]">Direct MoSPI Module</span>
                    )}

                    <button
                      onClick={() => handleEnrollOrProgress(course)}
                      className={`px-3.5 py-2 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500'
                          : 'bg-zinc-950 hover:bg-black text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Certified / Completed</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Advance Unit (+25%)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-amber-400" />
                          <span>Enroll Official Module</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
