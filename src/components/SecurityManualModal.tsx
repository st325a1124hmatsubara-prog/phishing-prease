import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { MANUAL_ARTICLES, ManualArticle } from '../data/manual';
import { soundManager } from '../utils/audio';

interface SecurityManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedTopicIds: string[];
}

export const SecurityManualModal: React.FC<SecurityManualModalProps> = ({
  isOpen,
  onClose,
  unlockedTopicIds
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(MANUAL_ARTICLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredArticles = MANUAL_ARTICLES.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentArticle = MANUAL_ARTICLES.find(a => a.id === selectedArticleId) || MANUAL_ARTICLES[0];
  const isUnlocked = unlockedTopicIds.includes(currentArticle.id) || true; // All available for learning, with badges

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider flex items-center gap-2">
                サイバーセキュリティ審査官 職務教本 & 脅威図鑑
              </h2>
              <p className="text-[11px] text-slate-400">
                最新フィッシング攻撃手法のメカニズム・検知チェックリスト・実務対策集
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two Column Layout: Articles List (Left) + Detail Reader (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Article Selector */}
          <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/70 flex flex-col shrink-0">
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  maxLength={100}
                  placeholder="手法・キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {filteredArticles.map((article) => {
                const isSelected = article.id === selectedArticleId;
                const isEncountered = unlockedTopicIds.includes(article.id);

                return (
                  <button
                    key={article.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedArticleId(article.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                        article.threatLevel === 'CRITICAL' 
                          ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {article.threatLevel}
                      </span>
                      {isEncountered && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ★ 遭遇済
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold line-clamp-1">
                      {article.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {article.summary}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Article Details */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-900 space-y-5">
            {/* Title & Badge */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {currentArticle.category}
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  currentArticle.threatLevel === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  脅威レベル: {currentArticle.threatLevel}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                {currentArticle.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentArticle.summary}
              </p>
            </div>

            {/* Mechanism Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                攻撃の仕組みと手口 (Mechanism)
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentArticle.mechanism}
              </div>
            </div>

            {/* Real World Example */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                実際の被害・攻撃事例 (Real-world Scenario)
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 text-xs text-amber-200 leading-relaxed">
                {currentArticle.realWorldExample}
              </div>
            </div>

            {/* Detection Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                審査官の見極めチェックリスト (Detection Checklist)
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                {currentArticle.detectionChecklist.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Countermeasure */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-blue-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                恒久的な防御策・社内ルール (Countermeasure)
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {currentArticle.countermeasure}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            収録記事数: {MANUAL_ARTICLES.length}項目 | 実践セキュリティガイド
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};
