import React from 'react';
import { ShieldCheck, Play, Bell, Calendar, Target, AlertTriangle, Timer } from 'lucide-react';
import { Difficulty } from '../types/game';
import { soundManager } from '../utils/audio';
import { getDayTimeLimit, formatTimeJapanese } from '../utils/timer';

interface DayStartModalProps {
  isOpen: boolean;
  day: number;
  difficulty: Difficulty;
  emailCount: number;
  onStartDay: () => void;
}

export const DayStartModal: React.FC<DayStartModalProps> = ({
  isOpen,
  day,
  difficulty,
  emailCount,
  onStartDay
}) => {
  if (!isOpen) return null;

  const timeLimitSeconds = getDayTimeLimit(difficulty, day);

  // Day specific briefing alerts
  let threatIntel = '本日は一般的な表示名偽装や単純なURL偽装、二重拡張子マルウェアの流入が予測されます。差出人アドレスのドメイン名と実体リンクを必ず照合してください。';
  if (day === 2) {
    threatIntel = '【警戒情報】取引先や社内ポータルを装うサブドメイン偽装(ドメイン名の右端チェック)や短縮URL、マクロ付きExcelファイルが急増しています。複数の項目を念入りにフォレンジック調査してください。';
  } else if (day >= 3) {
    threatIntel = '【非常警報】経営陣を騙るCEO詐欺(ギフトカード要求)、取引先振込口座の急な変更(BEC)、国際化ドメイン(Punycode/ホモグラフ攻撃)、ヘッダー直偽装(Direct Spoofing)など高度な標的型攻撃が確認されています。SPF/DKIM/DMARCの電子署名まで徹底検証してください。';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Morning Briefing Banner */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-6 border-b border-cyan-800/40 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            MORNING BRIEFING / SHIFT START
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-wider">
            DAY {String(day).padStart(2, '0')} 出勤
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            サイバーセキュリティ推進室 審査係 デスク
          </p>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Target & Rules */}
          <div className="grid grid-cols-3 gap-2.5 font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase block">本日ノルマ</span>
              <span className="text-sm font-bold text-slate-100 mt-1">{emailCount} 件</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase block">審査難易度</span>
              <span className="text-sm font-bold text-cyan-400 mt-1">{difficulty}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
              timeLimitSeconds !== null 
                ? 'bg-slate-950 border-amber-500/40 text-amber-300' 
                : 'bg-slate-950 border-emerald-500/40 text-emerald-300'
            }`}>
              <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                <Timer className="w-3 h-3" />
                制限時間
              </span>
              <span className="text-sm font-bold font-mono mt-1">
                {timeLimitSeconds !== null ? formatTimeJapanese(timeLimitSeconds) : '無制限'}
              </span>
            </div>
          </div>

          {timeLimitSeconds !== null && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/40 text-amber-200 text-[11px] flex items-center justify-between font-mono">
              <span>※前日比+10秒加算（判定画面表示中は自動一時停止）</span>
              <span className="text-rose-400 font-bold">時間切れ: 強制不合格</span>
            </div>
          )}

          {/* Today's Threat Intel Warning */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              本日の脅威インテリジェンス・速報
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {threatIntel}
            </p>
          </div>

          {/* Operational Directive */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 space-y-1">
            <span className="text-[11px] font-bold text-slate-300 block">審査官への業務心得:</span>
            <p>1. メールアドレスの「見た目」ではなく「実体ドメイン」を照合すること。</p>
            <p>2. リンクや添付ファイルは必ず調査ツールで安全性を解析すること。</p>
            <p>3. 危険メールの社内通過(見落とし)は会社評価に致命的損害を与えます。</p>
          </div>
        </div>

        {/* Start Shift Button */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartDay();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/50 cursor-pointer active:scale-[0.99] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>業務を開始する (START SHIFT)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
