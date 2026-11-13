import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              ゲーム進行状況のリセット
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              現在のセーブデータを消去し、DAY 01 から再開しますか？
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
          獲得した給与、累計正解実績、会社のセキュリティ評価スコアが初期状態にリセットされます。この操作は取り消せません。
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onCancel();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onConfirm();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/50"
          >
            リセットして最初から始める
          </button>
        </div>

      </div>
    </div>
  );
};
