import React from 'react';
import { ShieldAlert, RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  day: number;
  reason?: string;
  onRetryDay: () => void;
  onRestartCareer: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  day,
  reason,
  onRetryDay,
  onRestartCareer
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-rose-600/80 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        
        {/* Incident Alert Banner */}
        <div className="bg-gradient-to-b from-rose-950 via-slate-900 to-slate-900 p-6 border-b border-rose-900/40 relative">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 mx-auto flex items-center justify-center text-rose-500 mb-3 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 tracking-widest uppercase block mb-1">
            CRITICAL SECURITY BREACH
          </span>
          <h2 className="text-2xl font-black text-rose-100 font-mono tracking-wider">
            会社セキュリティ全壊 / 解任
          </h2>
          <p className="text-xs text-rose-300/80 mt-1">
            会社のセキュリティ健全度が0%に達し、重大インシデントが発生しました
          </p>
        </div>

        {/* Incident Report */}
        <div className="p-6 space-y-4 text-xs text-slate-300 text-left">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block font-mono">
              緊急事態調査報告 (CSIRT Incident Log):
            </span>
            <p className="text-slate-300 leading-relaxed">
              {reason || '相次ぐ悪性フィッシングメールの審査見落とし、または正当な重要業務メールの不当な遮断により、社内ネットワークにランサムウェアが侵入・または大規模な送金被害が発生しました。'}
            </p>
            <p className="text-slate-400">
              審査官としての職務基準を満たせなかったため、審査係の任を解かれます。
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs">
            <span className="font-bold block mb-0.5">次回の着眼点:</span>
            必ず「送信者ドメインの文字スペル」「URLサンドボックスの転送先」「SPF/DKIM署名」を確認してから判定ボタンを押してください。
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onRetryDay();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>DAY {day} を再審査する</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestartCareer();
            }}
            className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>DAY 1 からやり直す</span>
          </button>
        </div>

      </div>
    </div>
  );
};
