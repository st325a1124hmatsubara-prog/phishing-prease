import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Briefcase, 
  TrendingDown, 
  TrendingUp, 
  Lightbulb, 
  Check, 
  AlertTriangle,
  Languages 
} from 'lucide-react';
import { EmailItem, EmailAuditRecord } from '../types/game';
import { soundManager } from '../utils/audio';

interface VerdictModalProps {
  isOpen: boolean;
  email: EmailItem;
  auditRecord: EmailAuditRecord;
  onNextEmail: () => void;
  isLastEmailOfDay: boolean;
  onFinishDay: () => void;
  onClose: () => void;
}

export const VerdictModal: React.FC<VerdictModalProps> = ({
  isOpen,
  email,
  auditRecord,
  onNextEmail,
  isLastEmailOfDay,
  onFinishDay,
  onClose
}) => {
  if (!isOpen) return null;

  const isCorrect = auditRecord.isCorrect;
  const isFalseNegative = !isCorrect && email.isThreat; // Leaked threat
  const isFalsePositive = !isCorrect && !email.isThreat; // Blocked clean mail

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Banner Header: Correct / Incorrect */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isCorrect 
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-600/40' 
            : 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-rose-600/40'
        }`}>
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 animate-pulse">
                <XCircle className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-black tracking-wider uppercase font-mono ${
                  isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isCorrect ? '【 判 定 正 解 】' : '【 判 定 不 正 解 】'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono border border-slate-800">
                  {email.categoryTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isCorrect 
                  ? '適切なフォレンジック調査に基づく正確な審査結果です。'
                  : isFalseNegative 
                    ? '危険な脅威メールの社内通過（漏洩）を許してしまいました！'
                    : '正当な業務連絡メールを誤って隔離してしまいました（業務遅延）。'
                }
              </p>
            </div>
          </div>

          {/* Stamp Impression Badge */}
          <div className={`hidden sm:flex flex-col items-center justify-center px-4 py-2 rounded-lg border-2 font-mono font-black text-xs uppercase transform rotate-2 ${
            isCorrect 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40' 
              : 'border-rose-500 text-rose-400 bg-rose-950/40'
          }`}>
            <span>AUDIT VERDICT</span>
            <span className="text-sm">{isCorrect ? 'APPROVED' : 'VIOLATION'}</span>
          </div>
        </div>

        {/* Scrollable Report Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Comparison Cards: Expected vs Player */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">あなたの判定</span>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {auditRecord.playerVerdict === 'SAFE' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">【安全なメール】</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">【危険なメール】</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">正しい判定</span>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {!email.isThreat ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">【安全なメール】 (正規)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">【危険なメール】 (脅威)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reward & Penalty Metric Row */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-around font-mono">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">給与変動:</span>
              <span className={`font-bold ${auditRecord.earnedSalary >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {auditRecord.earnedSalary >= 0 ? `+¥${auditRecord.earnedSalary.toLocaleString()}` : `-¥${Math.abs(auditRecord.earnedSalary).toLocaleString()}`}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              {auditRecord.securityImpact >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              )}
              <span className="text-slate-400">セキュリティ健全度:</span>
              <span className={`font-bold ${auditRecord.securityImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {auditRecord.securityImpact >= 0 ? `+${auditRecord.securityImpact}%` : `${auditRecord.securityImpact}%`}
              </span>
            </div>
          </div>

          {/* Analysis & Threat / Safe Indicators */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="font-bold text-slate-100 flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              脅威分析サマリー & 見抜くためのポイント
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              {email.explanation.summary}
            </p>

            {/* Checklist of key points */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 block">審査の着眼点:</span>
              {email.explanation.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Threat Indicators vs Safe Indicators */}
            {email.explanation.threatIndicators.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  検出された危険シグナル (不審点):
                </span>
                {email.explanation.threatIndicators.map((ind, idx) => (
                  <div key={idx} className="text-rose-200/90 pl-4 text-[11px]">
                    - {ind}
                  </div>
                ))}
              </div>
            )}

            {/* Chinese Kanji / Glyph Breakdown (if any existed in this email) */}
            {email.chineseAnomalies && email.chineseAnomalies.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 space-y-2">
                <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-rose-400" />
                  混入していた中国語簡体字・表記異常 ({email.chineseAnomalies.length}箇所):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {email.chineseAnomalies.map(anom => (
                    <div key={anom.id} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-rose-400 font-bold font-sans">
                          検知: 「{anom.injectedText}」
                        </span>
                        <span className="text-emerald-400 font-medium">
                          正規: 「{anom.originalJpText}」
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        {anom.charExplanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {email.explanation.safeIndicators.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  正当性の証明指標 (安全の根拠):
                </span>
                {email.explanation.safeIndicators.map((ind, idx) => (
                  <div key={idx} className="text-emerald-200/90 pl-4 text-[11px]">
                    - {ind}
                  </div>
                ))}
              </div>
            )}

            {/* Best practice for the future */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-[11px] font-bold text-cyan-400 block mb-0.5">
                今後の実務対策 (ベストプラクティス):
              </span>
              <span>{email.explanation.bestPractice}</span>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            閉じる
          </button>

          {isLastEmailOfDay ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onFinishDay();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 cursor-pointer"
            >
              <span>本日の審査業務を終了（成績集計へ）</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextEmail();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 cursor-pointer"
            >
              <span>次のメールを審査する</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
