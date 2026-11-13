import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { DaySummary } from '../types/game';
import { soundManager } from '../utils/audio';

interface DayEndModalProps {
  isOpen: boolean;
  summary: DaySummary;
  onNextDay: () => void;
}

export const DayEndModal: React.FC<DayEndModalProps> = ({
  isOpen,
  summary,
  onNextDay
}) => {
  useEffect(() => {
    if (isOpen) {
      if (summary.accuracyRate >= 80) {
        soundManager.playSuccess();
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen, summary.accuracyRate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-6 border-b border-slate-800 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/50 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            DAILY PERFORMANCE REPORT
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-wider">
            DAY {String(summary.day).padStart(2, '0')} 業務終了報告書
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            本日のメール審査実績と社内セキュリティ評価サマリー
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Timeout Alert Banner (if time ran out) */}
          {summary.isTimeout && (
            <div className="bg-rose-950/70 border-2 border-rose-600/80 p-4 rounded-xl text-rose-200 flex items-start gap-3 shadow-lg shadow-rose-950/50">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="font-bold text-rose-300 text-sm font-mono block">
                  【 審査制限時間切れ強制終了 (TIME OUT) 】
                </span>
                <p className="leading-relaxed text-xs text-rose-200/90">
                  本日の規定審査制限時間を超過しました。未審査のメール（{summary.unreviewedCount ?? 0}件）は全件「不合格（未処理失点）」として処理され、防衛度ペナルティ（{summary.unreviewedPenalty ?? 0}%）が科されました。
                </p>
                {summary.finalSecurityRating <= 0 && (
                  <p className="text-rose-300 font-black text-xs pt-1">
                    ※会社防衛度が0%に達したため、懲戒解任（ゲームオーバー）となります。
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            {/* Accuracy */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">正解率</span>
              <span className={`text-xl font-black ${
                summary.accuracyRate >= 80 ? 'text-emerald-400' : summary.accuracyRate >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {summary.accuracyRate}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {summary.correctCount} / {summary.totalReviewed} 件正解
              </span>
            </div>

            {/* Salary */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">本日の獲得給与</span>
              <span className="text-xl font-black text-amber-400">
                ¥{summary.daySalary.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                実績加算ボーナス
              </span>
            </div>

            {/* Leaked Threats */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">通過させた危険メール</span>
              <span className={`text-xl font-black ${summary.threatsPassed > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {summary.threatsPassed} 件
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {summary.threatsPassed > 0 ? 'セキュリティ損害発生' : '完封ブロック達成'}
              </span>
            </div>

            {/* Blocked Clean Emails */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">誤拒否した安全メール</span>
              <span className={`text-xl font-black ${summary.safeBlocked > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {summary.safeBlocked} 件
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {summary.safeBlocked > 0 ? '軽微な業務遅延' : '誤検知なし'}
              </span>
            </div>
          </div>

          {/* Company Security Health Status Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                会社のセキュリティ健全度
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className={`flex items-center gap-1 font-bold ${
                  summary.securityChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {summary.securityChange >= 0 ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{summary.securityChange}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3.5 h-3.5" />
                      {summary.securityChange}%
                    </>
                  )}
                </span>
                <span className="text-slate-500">➔</span>
                <span className="font-extrabold text-sm text-slate-100">{summary.finalSecurityRating}%</span>
              </div>
            </div>

            {/* Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${
                  summary.finalSecurityRating < 40 ? 'bg-rose-500' : summary.finalSecurityRating < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${summary.finalSecurityRating}%` }}
              />
            </div>
          </div>

          {/* Today's Learning Takeaways */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Lightbulb className="w-4 h-4" />
              本日のセキュリティ学習ポイント & 今後の実務指針
            </div>

            <div className="space-y-1.5 text-slate-300">
              {summary.learnedPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer: Advance to Next Day */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onNextDay();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/50 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>
              {summary.finalSecurityRating <= 0
                ? '会社防衛度0%：解任処分（ゲームオーバー画面へ）'
                : `翌日（DAY ${summary.day + 1}）の業務へ進む`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
