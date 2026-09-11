import React, { useState } from 'react';
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
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  Layers,
  Sparkles,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

interface TrainerDashboardViewProps {
  onNavigate: (viewId: string) => void;
}

export const TrainerDashboardView: React.FC<TrainerDashboardViewProps> = ({
  onNavigate,
}) => {
  const [docSearch, setDocSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'PDF' | 'PPT' | 'DOCX'>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDomain, setNewDocDomain] = useState('Statistical');
  const [newDocType, setNewDocType] = useState('PDF');
  const [materialsList, setMaterialsList] = useState([
    {
      id: 'mat-1',
      title: 'NSSTA_Training_Manual_Sampling_Design_Vol_IV.pdf',
      type: 'PDF',
      size: '14.2 MB',
      pages: 42,
      domain: 'Statistical',
      quizzesGenerated: 3,
      uploaded: '2 days ago',
      status: 'Indexed & Grounded',
    },
    {
      id: 'mat-2',
      title: 'MoSPI_Urban_Frame_Survey_Mapping_Guidelines_2024.docx',
      type: 'DOCX',
      size: '6.8 MB',
      pages: 28,
      domain: 'Technical / GIS',
      quizzesGenerated: 2,
      uploaded: '1 week ago',
      status: 'Indexed & Grounded',
    },
    {
      id: 'mat-3',
      title: 'PLFS_Field_Enumerator_Consistency_Rules.ppt',
      type: 'PPT',
      size: '18.5 MB',
      pages: 56,
      domain: 'Digital Governance',
      quizzesGenerated: 1,
      uploaded: '2 weeks ago',
      status: 'Indexed & Grounded',
    },
    {
      id: 'mat-4',
      title: 'National_Accounts_Statistics_SNA_2008_Compilation_Guide.pdf',
      type: 'PDF',
      size: '22.1 MB',
      pages: 114,
      domain: 'Statistical',
      quizzesGenerated: 4,
      uploaded: '3 weeks ago',
      status: 'Indexed & Grounded',
    },
    {
      id: 'mat-5',
      title: 'Annual_Survey_of_Industries_Factory_Schedule_Validation.docx',
      type: 'DOCX',
      size: '9.4 MB',
      pages: 36,
      domain: 'Technical',
      quizzesGenerated: 2,
      uploaded: '1 month ago',
      status: 'Indexed & Grounded',
    },
  ]);

  const [quizzesList, setQuizzesList] = useState([
    {
      id: 'quiz-nssta-sampling-2025',
      title: 'Multi-Stage Stratified Sampling & Non-Sampling Error Controls',
      questions: 5,
      difficulty: 'Intermediate',
      status: 'Published',
      learnersTested: 142,
      avgScore: '81.4%',
      targetWing: 'FOD (Field Operations)',
      sourceDoc: 'NSSTA_Training_Manual_Sampling_Design_Vol_IV.pdf',
    },
    {
      id: 'quiz-cpi-basket',
      title: 'CPI Imputation & Modified Laspeyres Price Relatives',
      questions: 10,
      difficulty: 'Foundational',
      status: 'Published',
      learnersTested: 288,
      avgScore: '76.8%',
      targetWing: 'PSD (Price Statistics)',
      sourceDoc: 'PLFS_Field_Enumerator_Consistency_Rules.ppt',
    },
    {
      id: 'quiz-py-microdata',
      title: 'Python Pandas High-Throughput Microdata Batch Scripts',
      questions: 8,
      difficulty: 'Advanced',
      status: 'Under Review',
      learnersTested: 0,
      avgScore: '—',
      targetWing: 'Data Informatics & Innovation',
      sourceDoc: 'MoSPI_Urban_Frame_Survey_Mapping_Guidelines_2024.docx',
    },
    {
      id: 'quiz-sna-gdp',
      title: 'Gross Value Added (GVA) Supply-Use Table (SUT) Balances',
      questions: 12,
      difficulty: 'Advanced',
      status: 'Published',
      learnersTested: 94,
      avgScore: '72.1%',
      targetWing: 'NAD (National Accounts)',
      sourceDoc: 'National_Accounts_Statistics_SNA_2008_Compilation_Guide.pdf',
    },
  ]);

  const cadreDiagnostic = [
    { wing: 'Field Operations Division (FOD)', officers: 480, avgCompetency: 64, primaryGap: 'CAPI Validation & GPS Tracing', urgency: 'HIGH' },
    { wing: 'Price Statistics Division (PSD)', officers: 210, avgCompetency: 78, primaryGap: 'Modified Laspeyres Aggregation', urgency: 'LOW' },
    { wing: 'National Accounts Division (NAD)', officers: 165, avgCompetency: 71, primaryGap: 'SUT Discrepancy Allocation', urgency: 'MEDIUM' },
    { wing: 'Survey Design & Research (SDRD)', officers: 140, avgCompetency: 83, primaryGap: 'Non-response Weight Calibration', urgency: 'LOW' },
  ];

  const filteredMaterials = materialsList.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(docSearch.toLowerCase()) || m.domain.toLowerCase().includes(docSearch.toLowerCase());
    const matchesFormat = formatFilter === 'ALL' || m.type === formatFilter;
    return matchesSearch && matchesFormat;
  });

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const extension = newDocType === 'PDF' ? '.pdf' : newDocType === 'PPT' ? '.ppt' : '.docx';
    const formattedName = newDocName.endsWith(extension) ? newDocName : `${newDocName.replace(/\s+/g, '_')}${extension}`;

    setMaterialsList((prev) => [
      {
        id: `mat-${Date.now()}`,
        title: formattedName,
        type: newDocType,
        size: '11.4 MB',
        pages: 34,
        domain: newDocDomain,
        quizzesGenerated: 0,
        uploaded: 'Just now',
        status: 'Indexed & Grounded',
      },
      ...prev,
    ]);

    setIsUploadModalOpen(false);
    setNewDocName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Faculty Header */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-technical uppercase tracking-widest text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5">
                FACULTY COMMAND CONSOLE
              </span>
              <span className="text-xs font-technical text-zinc-500">
                NSSTA GREATER NOIDA CAMPUS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Trainer Assessment & Curricular Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Dr. S. Rao · Senior Faculty & Curriculum Coordinator · National Statistical Systems Training Academy (NSSTA), MoSPI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 text-xs font-technical uppercase font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Training Manual</span>
            </button>

            <button
              onClick={() => onNavigate('quiz-generator')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500 text-xs font-technical uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Wand2 className="w-4 h-4 fill-zinc-950 text-zinc-950" />
              <span>Generate AI Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>INGESTED MANUALS</span>
            <FolderArchive className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">{materialsList.length} Manuals</div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            Official MoSPI & NSSTA Formats
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>SYNTHESIZED DRILLS</span>
            <Wand2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">{quizzesList.length} AI Quizzes</div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            100% Page-Cited Verifiable Rationale
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>LIVE CADRE ASSESSMENTS</span>
            <FileQuestion className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">
            {quizzesList.filter((q) => q.status === 'Published').length} Published
          </div>
          <div className="text-[11px] font-technical text-zinc-500 mt-1">
            Active on SSS & ISS Consoles
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-300">
          <div className="text-xs font-technical uppercase text-zinc-500 mb-1 flex items-center justify-between">
            <span>CADRE PASS RATE</span>
            <GraduationCap className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">78.4% Avg</div>
          <div className="text-[11px] font-technical text-emerald-700 font-semibold mt-1">
            524 Officers Tested This Quarter
          </div>
        </div>
      </div>

      {/* Cadre Competency Intelligence Heatmap */}
      <div className="bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <span className="text-[10px] font-technical uppercase font-bold text-amber-800">
              CADRE DIAGNOSTIC OVERVIEW
            </span>
            <h3 className="text-base font-bold text-zinc-950 font-heading">
              Division-Level Competency Heatmap & Urgent Training Requirements
            </h3>
          </div>
          <span className="text-xs font-technical text-zinc-500">
            UPDATED DAILY VIA SSS ROSTER EVALUATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cadreDiagnostic.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border border-zinc-200 bg-[#FAFAFA] space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 font-heading">
                  {item.wing}
                </span>
                <span
                  className={`text-[9px] font-technical uppercase font-bold px-1.5 py-0.5 border ${
                    item.urgency === 'HIGH'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : item.urgency === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {item.urgency} DEFICIT
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-heading text-zinc-950">
                  {item.avgCompetency}%
                </span>
                <span className="text-[11px] font-technical text-zinc-500">
                  Cadre Readiness ({item.officers} Officers)
                </span>
              </div>

              <div className="w-full bg-zinc-200 h-1.5 rounded-none overflow-hidden">
                <div
                  className={`h-full ${
                    item.avgCompetency < 70 ? 'bg-rose-600' : item.avgCompetency < 75 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${item.avgCompetency}%` }}
                />
              </div>

              <div className="text-[11px] font-sans text-zinc-600 pt-1">
                <strong>Primary Deficit:</strong> {item.primaryGap}
              </div>

              <button
                onClick={() => onNavigate('quiz-generator')}
                className="w-full mt-2 py-1.5 bg-zinc-900 hover:bg-black text-amber-300 text-[10px] font-technical uppercase font-bold text-center cursor-pointer transition-colors"
              >
                Synthesize Targeted Drill →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Training Materials Repository vs Generated Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): Training Materials Repository */}
        <div className="lg:col-span-6 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
            <div>
              <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                CURRICULAR ASSETS ({filteredMaterials.length})
              </span>
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                Training Materials Repository
              </h3>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Manual</span>
            </button>
          </div>

          {/* Search and Format Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search manual title or domain..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div className="flex items-center gap-1 font-technical text-[10px]">
              {(['ALL', 'PDF', 'DOCX', 'PPT'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2 py-1.5 border uppercase font-bold ${
                    formatFilter === fmt
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="px-2 py-1 bg-zinc-900 text-amber-400 font-technical text-[10px] font-bold shrink-0">
                    {mat.type}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-950 font-heading truncate max-w-xs sm:max-w-sm">
                      {mat.title}
                    </h4>
                    <div className="text-[10px] font-technical text-zinc-500 mt-0.5">
                      {mat.pages} Pages · {mat.size} · {mat.domain} · {mat.uploaded}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quiz-generator')}
                  className="px-2.5 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 text-[11px] font-technical uppercase font-bold shrink-0 cursor-pointer transition-colors"
                >
                  Synthesize Quiz
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
                ASSESSMENT REGISTRY ({quizzesList.length})
              </span>
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                Synthesized Assessment Suites
              </h3>
            </div>
            <button
              onClick={() => onNavigate('quiz-review')}
              className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold cursor-pointer"
            >
              Review Suite →
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {quizzesList.map((quiz) => (
              <div
                key={quiz.id}
                className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-zinc-950 font-heading truncate max-w-xs">
                      {quiz.title}
                    </h4>
                    <span
                      className={`text-[9px] font-technical font-bold uppercase px-1.5 py-0.2 border ${
                        quiz.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-technical text-zinc-500 mt-1">
                    {quiz.questions} MCQs · {quiz.difficulty} · Target: {quiz.targetWing} · {quiz.learnersTested} Attempts ({quiz.avgScore})
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onNavigate('quiz-review')}
                    className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase font-bold cursor-pointer transition-colors"
                  >
                    Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Manual Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-zinc-950 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Upload Official MoSPI Training Material
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-technical uppercase font-bold text-zinc-700 mb-1">
                  Manual Title / Document Name:
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. NSSO_78th_Round_Domestic_Tourism_Manual"
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-300 font-sans focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-technical uppercase font-bold text-zinc-700 mb-1">
                    Document Format:
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full p-2 text-xs bg-zinc-50 border border-zinc-300 font-technical uppercase focus:outline-none"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="PPT">PPT / PPTX (Lecture Slides)</option>
                    <option value="DOCX">DOCX (Handbook / Circular)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-technical uppercase font-bold text-zinc-700 mb-1">
                    Statistical Domain:
                  </label>
                  <select
                    value={newDocDomain}
                    onChange={(e) => setNewDocDomain(e.target.value)}
                    className="w-full p-2 text-xs bg-zinc-50 border border-zinc-300 font-technical focus:outline-none"
                  >
                    <option value="Statistical">Statistical Methodology</option>
                    <option value="Technical">Technical Data Processing</option>
                    <option value="Digital Governance">Digital Governance / CAPI</option>
                    <option value="National Accounts">National Accounts / Macro</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-zinc-300 bg-zinc-50 text-center space-y-1">
                <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                <div className="text-xs font-technical text-zinc-700">
                  Drag & Drop official training file here, or click to browse
                </div>
                <div className="text-[10px] font-technical text-zinc-500">
                  Supported formats: PDF, DOCX, PPT, PPTX (Max 50MB)
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-xs font-technical uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-black text-amber-400 font-technical text-xs uppercase font-bold cursor-pointer transition-colors"
                >
                  Ingest & Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
