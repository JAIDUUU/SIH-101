import React from 'react';
import {
  Wand2,
  FolderArchive,
  FileQuestion,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface TrainerDashboardViewProps {
  onNavigate: (viewId: string) => void;
}

export const TrainerDashboardView: React.FC<TrainerDashboardViewProps> = ({
  onNavigate,
}) => {
  const materials = [
    {
      title: 'NSSTA_Training_Manual_Sampling_Design_Vol_IV.pdf',
      type: 'PDF',
      size: '14.2 MB',
      pages: 42,
      domain: 'Statistical',
      quizzesGenerated: 3,
      uploaded: '2 days ago',
    },
    {
      title: 'MoSPI_Urban_Frame_Survey_Mapping_Guidelines_2024.docx',
      type: 'DOCX',
      size: '6.8 MB',
      pages: 28,
      domain: 'Technical / GIS',
      quizzesGenerated: 2,
      uploaded: '1 week ago',
    },
    {
      title: 'PLFS_Field_Enumerator_Consistency_Rules.ppt',
      type: 'PPT',
      size: '18.5 MB',
      pages: 56,
      domain: 'Digital Governance',
      quizzesGenerated: 1,
      uploaded: '2 weeks ago',
    },
  ];

  const recentQuizzes = [
    {
      id: 'quiz-nssta-sampling-2025',
      title: 'Multi-Stage Stratified Sampling & Non-Sampling Error Controls',
      questions: 5,
      difficulty: 'Intermediate',
      status: 'Published',
      learnersTested: 142,
      avgScore: '81.4%',
    },
    {
      id: 'quiz-cpi-basket',
      title: 'CPI Imputation & Modified Laspeyres Price Relatives',
      questions: 10,
      difficulty: 'Foundational',
      status: 'Published',
      learnersTested: 288,
      avgScore: '76.8%',
    },
    {
      id: 'quiz-py-microdata',
      title: 'Python Pandas High-Throughput Microdata Batch Scripts',
      questions: 8,
      difficulty: 'Advanced',
      status: 'Under Review',
      learnersTested: 0,
      avgScore: '—',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Main CTA (Exact requirement: Upload Material & Generate Quiz) */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              FACULTY CONSOLE // NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Trainer Assessment & Curricular Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Dr. S. Rao · Senior Faculty & Curriculum Coordinator · Greater Noida Campus
            </p>
          </div>

          <button
            onClick={() => onNavigate('quiz-generator')}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500 text-xs font-technical uppercase tracking-wider font-extrabold transition-all flex items-center gap-2.5 shadow-xs cursor-pointer"
          >
            <Wand2 className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            <span>Upload Material & Generate Quiz</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>TRAINING MATERIALS</span>
            <FolderArchive className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">18 Documents</div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            PDF, PPT, DOCX Ingested
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>GENERATED QUIZZES</span>
            <Wand2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">12 AI Quizzes</div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            100% Page-Cited Rationale
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>PUBLISHED ASSESSMENTS</span>
            <FileQuestion className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">9 Active Drills</div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            Live on Officer Portals
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>LEARNER PERFORMANCE</span>
            <GraduationCap className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">78.4% Avg</div>
          <div className="text-[11px] font-technical text-emerald-700 font-semibold mt-1">
            430 Officers Assessed This Month
          </div>
        </div>
      </div>

      {/* Main Grid: Training Materials vs Generated Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): Training Materials Repository */}
        <div className="lg:col-span-6 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                CURRICULAR ASSETS
              </span>
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                Training Materials Repository
              </h3>
            </div>
            <button
              onClick={() => onNavigate('quiz-generator')}
              className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
          </div>

          <div className="space-y-3">
            {materials.map((mat, idx) => (
              <div
                key={idx}
                className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 bg-zinc-900 text-amber-400 font-technical text-[10px] font-bold shrink-0">
                    {mat.type}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 font-heading truncate max-w-xs sm:max-w-sm">
                      {mat.title}
                    </h4>
                    <div className="text-[10px] font-technical text-zinc-500 mt-0.5">
                      {mat.pages} Pages · {mat.domain} · {mat.uploaded}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quiz-generator')}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-amber-100 border border-zinc-300 text-zinc-800 text-[11px] font-technical uppercase font-semibold shrink-0 cursor-pointer"
                >
                  Generate Quiz
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): Published & Generated Quizzes */}
        <div className="lg:col-span-6 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                ASSESSMENT REGISTRY
              </span>
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                Generated & Published Assessments
              </h3>
            </div>
            <button
              onClick={() => onNavigate('quiz-review')}
              className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold"
            >
              Review Suite →
            </button>
          </div>

          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-zinc-950 font-heading">
                      {quiz.title}
                    </h4>
                    <span
                      className={`text-[9px] font-technical font-bold uppercase px-1.5 py-0.2 ${
                        quiz.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-technical text-zinc-500 mt-0.5">
                    {quiz.questions} MCQs · {quiz.difficulty} · {quiz.learnersTested} Attempts · Avg: {quiz.avgScore}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quiz-review')}
                  className="px-3 py-1 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase font-semibold shrink-0 cursor-pointer"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
