import React, { useState, useEffect } from 'react';
import { assetManager } from '../../services/assetManager';
import {
  Globe2,
  Smile,
  BookmarkCheck,
  AlertCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type PatternTab = 'nationality' | 'personality';

export const SentencePatternsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PatternTab>('nationality');
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    return assetManager.subscribe(() => {
      setRefreshTick((t) => t + 1);
    });
  }, []);

  const p1MindmapUrl = assetManager.getAssetUrl('pattern1_nationality.png');
  const p2MindmapUrl = assetManager.getAssetUrl('pattern2_personality.png');

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
              SECTION C
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              SENTENCE PATTERNS
            </h2>
          </div>
          <h3 className="text-base font-bold text-sky-700 mt-0.5">
            Learn the patterns
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Master the two core sentence patterns from Global Success English 5 Unit 3.
          </p>
        </div>
      </div>

      {/* CORE 2 PATTERN SELECTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tab 1: NATIONALITY */}
        <button
          type="button"
          onClick={() => setActiveTab('nationality')}
          className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
            activeTab === 'nationality'
              ? 'bg-sky-50/90 border-sky-500 shadow-sm ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/70 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'nationality'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Pattern 1
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                1. NATIONALITY
              </h4>
              <p className="text-xs text-slate-500">Hỏi &amp; trả lời về quốc tịch</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
              activeTab === 'nationality'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {activeTab === 'nationality' ? 'Đang xem' : 'Chọn xem'}
          </span>
        </button>

        {/* Tab 2: PERSONALITY */}
        <button
          type="button"
          onClick={() => setActiveTab('personality')}
          className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
            activeTab === 'personality'
              ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/70 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'personality'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Pattern 2
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                2. PERSONALITY
              </h4>
              <p className="text-xs text-slate-500">Hỏi &amp; trả lời về tính cách</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
              activeTab === 'personality'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {activeTab === 'personality' ? 'Đang xem' : 'Chọn xem'}
          </span>
        </button>
      </div>

      {/* ================================================== */}
      {/* PATTERN 1 – NATIONALITY CONTENT                    */}
      {/* ================================================== */}
      {activeTab === 'nationality' && (
        <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
          {/* 1. PATTERN TITLE */}
          <div className="border-b border-sky-100 pb-4">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              <span>PATTERN 1</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ASKING ABOUT NATIONALITY
            </h3>
            <p className="text-base font-semibold text-sky-700 mt-0.5">
              Hỏi về quốc tịch
            </p>
          </div>

          {/* 2. PATTERN 1 MINDMAP OVERVIEW */}
          {p1MindmapUrl && (
            <div className="bg-sky-50/80 rounded-3xl p-5 sm:p-6 border-2 border-sky-200 space-y-4">
              <div>
                <span className="bg-sky-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  PATTERN OVERVIEW
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                  Sơ đồ tổng hợp
                </h4>
                <p className="text-xs text-slate-600">
                  Xem lại toàn bộ kiến thức Mẫu câu 1 qua sơ đồ trực quan.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-2 sm:p-4 border border-sky-200 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={p1MindmapUrl}
                  alt="Pattern 1 Mindmap - Asking about nationality"
                  className="w-full h-auto max-h-[700px] object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          {/* 3. MODEL SENTENCE */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border-2 border-sky-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-sky-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                MODEL
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Mẫu câu chuẩn
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Question (Hỏi):
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex flex-wrap items-center gap-2">
                  <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-300">
                    What nationality
                  </span>
                  <span>is</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-300">
                    he / she
                  </span>
                  <span>?</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Answer (Trả lời):
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex flex-wrap items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-300">
                    He’s / She’s
                  </span>
                  <span className="text-slate-400 font-bold">+</span>
                  <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-300">
                    nationality
                  </span>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MEANING & USE */}
          <div className="bg-sky-50/50 rounded-2xl p-6 border border-sky-200 space-y-4">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-sky-900 block mb-1">
                MEANING &amp; USE (Cách dùng)
              </h4>
              <p className="text-sm font-semibold text-slate-800">
                <span className="font-bold text-sky-900">Cách dùng:</span> Dùng để hỏi và trả lời về quốc tịch của một người.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-sky-100 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                  Question:
                </span>
                <p className="text-base font-bold text-slate-800">
                  What nationality is he?
                </p>
                <p className="text-base font-bold text-slate-800">
                  What nationality is she?
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                  Answer:
                </span>
                <p className="text-base font-bold text-slate-800">
                  He’s + nationality.
                </p>
                <p className="text-base font-bold text-slate-800">
                  She’s + nationality.
                </p>
              </div>
            </div>
          </div>

          {/* 5. EXAMPLES */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              EXAMPLES (Ví dụ)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md">
                    Example 1
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What nationality is he?
                </p>
                <p className="text-base font-bold text-sky-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>He’s Australian.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md">
                    Example 2
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What nationality is she?
                </p>
                <p className="text-base font-bold text-sky-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>She’s Malaysian.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md">
                    Example 3
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What nationality is she?
                </p>
                <p className="text-base font-bold text-sky-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>She’s American.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md">
                    Example 4
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What nationality is she?
                </p>
                <p className="text-base font-bold text-sky-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>She’s Japanese.
                </p>
              </div>
            </div>
          </div>

          {/* 6. REMEMBER / GRAMMAR NOTE */}
          <div className="bg-amber-50/80 rounded-2xl p-5 sm:p-6 border border-amber-200 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider">
                  REMEMBER (Ghi nhớ)
                </h4>
                <p className="text-xs font-semibold text-amber-800">
                  Country → Nationality (Đất nước → Quốc tịch)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs text-slate-500 block">Australia →</span>
                <span className="text-sm font-bold text-amber-900 block mt-0.5">Australian</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs text-slate-500 block">Malaysia →</span>
                <span className="text-sm font-bold text-amber-900 block mt-0.5">Malaysian</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs text-slate-500 block">America →</span>
                <span className="text-sm font-bold text-amber-900 block mt-0.5">American</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs text-slate-500 block">Japan →</span>
                <span className="text-sm font-bold text-amber-900 block mt-0.5">Japanese</span>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Short note:</p>
                <p>Use nationality words to answer this question.</p>
                <p className="text-amber-800 italic mt-0.5">
                  Dùng từ chỉ quốc tịch để trả lời câu hỏi này.
                </p>
              </div>
            </div>
          </div>

          {/* 7. BE CAREFUL / WATCH OUT */}
          <div className="bg-emerald-50/80 rounded-2xl p-5 sm:p-6 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                  BE CAREFUL / WATCH OUT (Chú ý cách dùng)
                </h4>
                <p className="text-xs font-semibold text-emerald-800">
                  Phân biệt giữa Quốc gia (Country) và Quốc tịch (Nationality)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Use FROM + COUNTRY:
                </span>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>He’s from Australia.</span>
                </p>
                <p className="text-xs text-slate-500 italic">
                  Sau &quot;from&quot; dùng tên quốc gia.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Use BE + NATIONALITY:
                </span>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>He’s Australian.</span>
                </p>
                <p className="text-xs text-slate-500 italic">
                  Sau &quot;He&apos;s / She&apos;s&quot; dùng từ chỉ quốc tịch.
                </p>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs sm:text-sm">
              <span className="font-bold text-emerald-900 block">Ví dụ phân biệt đúng - sai:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đúng:</span>
                  </div>
                  <p>✔ He’s from Australia.</p>
                  <p>✔ He’s Australian.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Sai cần tránh:</span>
                  </div>
                  <p className="line-through text-rose-700">✖ He’s from Australian.</p>
                  <p className="line-through text-rose-700">✖ He’s Australia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* PATTERN 2 – PERSONALITY CONTENT                    */}
      {/* ================================================== */}
      {activeTab === 'personality' && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
          {/* 1. PATTERN TITLE */}
          <div className="border-b border-emerald-100 pb-4">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Smile className="w-3.5 h-3.5" />
              <span>PATTERN 2</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ASKING ABOUT PERSONALITY
            </h3>
            <p className="text-base font-semibold text-emerald-700 mt-0.5">
              Hỏi về tính cách
            </p>
          </div>

          {/* 2. PATTERN 2 MINDMAP OVERVIEW */}
          {p2MindmapUrl && (
            <div className="bg-emerald-50/80 rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 space-y-4">
              <div>
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  PATTERN OVERVIEW
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                  Sơ đồ tổng hợp
                </h4>
                <p className="text-xs text-slate-600">
                  Xem lại toàn bộ kiến thức Mẫu câu 2 qua sơ đồ trực quan.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-2 sm:p-4 border border-emerald-200 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src={p2MindmapUrl}
                  alt="Pattern 2 Mindmap - Asking about personality"
                  className="w-full h-auto max-h-[700px] object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          {/* 3. MODEL SENTENCE */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                MODEL
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Mẫu câu chuẩn
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Question (Hỏi):
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                    What’s
                  </span>
                  <span className="bg-teal-100 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-300">
                    he / she
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                    like
                  </span>
                  <span>?</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Answer (Trả lời):
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex flex-wrap items-center gap-2">
                  <span className="bg-teal-100 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-300">
                    He’s / She’s
                  </span>
                  <span className="text-slate-400 font-bold">+</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                    personality adjective
                  </span>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MEANING & USE */}
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 space-y-4">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                MEANING &amp; USE (Cách dùng)
              </h4>
              <p className="text-sm font-semibold text-slate-800">
                <span className="font-bold text-emerald-900">Cách dùng:</span> Dùng để hỏi và trả lời về tính cách của một người.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Question:
                </span>
                <p className="text-base font-bold text-slate-800">
                  What’s he like?
                </p>
                <p className="text-base font-bold text-slate-800">
                  What’s she like?
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1.5 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Answer:
                </span>
                <p className="text-base font-bold text-slate-800">
                  He’s + personality adjective.
                </p>
                <p className="text-base font-bold text-slate-800">
                  She’s + personality adjective.
                </p>
              </div>
            </div>
          </div>

          {/* 5. EXAMPLES */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              EXAMPLES (Ví dụ)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    Example 1
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What’s she like?
                </p>
                <p className="text-base font-bold text-emerald-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>She’s friendly.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    Example 2
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What’s she like?
                </p>
                <p className="text-base font-bold text-emerald-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>She’s helpful.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    Example 3
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What’s he like?
                </p>
                <p className="text-base font-bold text-emerald-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>He’s clever.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    Example 4
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Q: </span>What’s he like?
                </p>
                <p className="text-base font-bold text-emerald-700 mt-1">
                  <span className="text-slate-400 font-medium">A: </span>He’s active.
                </p>
              </div>
            </div>
          </div>

          {/* 6. REMEMBER / GRAMMAR NOTE */}
          <div className="bg-rose-50/80 rounded-2xl p-5 sm:p-6 border border-rose-200 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider">
                  REMEMBER (Ghi nhớ)
                </h4>
                <p className="text-xs font-semibold text-rose-800">
                  Abbreviations &amp; Form Note
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-900 block mb-2">
                Abbreviations (Viết tắt):
              </span>
              <div className="flex flex-wrap gap-2.5">
                <span className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                  What’s = What is
                </span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                  He’s = He is
                </span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
                  She’s = She is
                </span>
              </div>
            </div>
          </div>

          {/* 7. BE CAREFUL / WATCH OUT */}
          <div className="bg-rose-50/90 p-5 sm:p-6 rounded-2xl border-2 border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="uppercase tracking-wider">BE CAREFUL / WATCH OUT (Lưu ý quan trọng)</span>
            </div>

            <div className="bg-white/95 p-4 rounded-xl border border-rose-200 space-y-2">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold">
                “What’s he/she like?” asks about personality.
                <br />
                It does NOT mean “What does he/she like?”
              </p>
              <div className="pt-2 border-t border-rose-100 text-xs text-rose-950 font-medium space-y-1">
                <p className="font-bold text-rose-800">Phân biệt:</p>
                <p>
                  ✔ <strong>What’s he/she like?</strong> → Hỏi về tính cách (friendly, clever, ...).
                </p>
                <p className="text-slate-600 italic">
                  ✖ <strong>What does he/she like?</strong> → Hỏi về sở thích (thích cái gì).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
