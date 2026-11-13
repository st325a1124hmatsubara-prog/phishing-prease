import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Briefcase, 
  AlertTriangle,
  Home,
  Timer,
  Pause
} from 'lucide-react';
import { Difficulty, GameStats } from '../types/game';
import { soundManager } from '../utils/audio';
import { formatTime } from '../utils/timer';

interface HeaderProps {
  stats: GameStats;
  currentEmailIndex: number;
  totalEmails: number;
  timeLeft: number | null;
  timeLimit: number | null;
  isTimerPaused: boolean;
  onOpenManual: () => void;
  onResetGame: () => void;
  onReturnToTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hasUnreadManualAlert?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentEmailIndex,
  totalEmails,
  timeLeft,
  timeLimit,
  isTimerPaused,
  onOpenManual,
  onResetGame,
  onReturnToTitle,
  isMuted,
  onToggleMute,
  hasUnreadManualAlert
}) => {
  // Determine security health color & status text
  const health = stats.companySecurityRating;
  let healthColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
  let healthBarBg = 'bg-emerald-500';
  let statusLabel = '安全稼働中';

  if (health < 40) {
    healthColor = 'text-rose-400 bg-rose-950/60 border-rose-500/50 animate-pulse';
    healthBarBg = 'bg-rose-500';
    statusLabel = '重大危機・侵害寸前';
  } else if (health < 75) {
    healthColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    healthBarBg = 'bg-amber-500';
    statusLabel = '警戒レベル上昇';
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 shadow-md shadow-cyan-900/30 border border-cyan-400/30">
              <ShieldAlert className="w-6 h-6 text-cyan-100" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider text-slate-100 font-mono flex items-center gap-1.5">
                  PHISHING, PLEASE
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-sans">
                    SOC Ver.2.6
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>社内メールセキュリティ推進室</span>
                <span className="text-slate-600">|</span>
                <span>不正通信・標的型詐欺審査ステーション</span>
              </p>
            </div>
          </div>

          {/* Core Metrics: Day, Status, Salary, Progress */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
            {/* Day badge */}
            <div className="bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-2 shadow-inner">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">SHIFT</span>
              <span className="text-cyan-400 font-bold text-sm">DAY {String(stats.currentDay).padStart(2, '0')}</span>
            </div>

            {/* Read-only Current Difficulty Badge (Selected on Title Screen) */}
            <div className="bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5 shadow-inner" title="難易度はタイトル画面から選択された固定設定です">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">難易度</span>
              <span className={`font-bold text-xs ${
                stats.difficulty === 'HARD' 
                  ? 'text-rose-400' 
                  : stats.difficulty === 'NORMAL' 
                    ? 'text-cyan-400' 
                    : 'text-emerald-400'
              }`}>
                {stats.difficulty}
              </span>
            </div>

            {/* Email Progress */}
            <div className="bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-2 shadow-inner">
              <span className="text-slate-500 text-[10px] uppercase font-bold">審査件数</span>
              <span className="text-slate-200 font-bold">
                <span className="text-cyan-400">{Math.min(currentEmailIndex + 1, totalEmails)}</span>
                <span className="text-slate-500"> / </span>
                {totalEmails}
              </span>
            </div>

            {/* Mission Timer Badge (NORMAL & HARD mode) */}
            {timeLimit !== null ? (
              <div 
                className={`px-3 py-1 rounded-md border flex items-center gap-2.5 shadow-inner transition-colors ${
                  isTimerPaused
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : (timeLeft !== null && timeLeft <= 30)
                      ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
                      : (timeLeft !== null && timeLeft <= 60)
                        ? 'bg-amber-950/60 border-amber-600/70 text-amber-200'
                        : 'bg-slate-950 border-cyan-500/40 text-cyan-300'
                }`}
                title={isTimerPaused ? 'タイマー停止中（判定・モーダル確認中は自動一時停止）' : '本日シフトの残り審査時間'}
              >
                <div className="flex items-center gap-1.5">
                  {isTimerPaused ? (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Timer className={`w-3.5 h-3.5 ${
                      (timeLeft !== null && timeLeft <= 30) 
                        ? 'text-rose-400 animate-bounce' 
                        : (timeLeft !== null && timeLeft <= 60)
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                    }`} />
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">制限時間</span>
                      {isTimerPaused ? (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 animate-pulse">
                          タイマー停止中
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono">
                          (最大 {formatTime(timeLimit)})
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-sm font-black font-mono tracking-wider ${
                        (timeLeft !== null && timeLeft <= 30 && !isTimerPaused) 
                          ? 'text-rose-400' 
                          : (timeLeft !== null && timeLeft <= 60 && !isTimerPaused)
                            ? 'text-amber-300'
                            : isTimerPaused
                              ? 'text-amber-200'
                              : 'text-cyan-300'
                      }`}>
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5 text-slate-400 shadow-inner" title="EASYモードは制限時間なし（無制限）でじっくり審査できます">
                <Timer className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-bold">制限時間</span>
                  <span className="text-[10px] font-bold text-emerald-400">無制限 (EASY)</span>
                </div>
              </div>
            )}

            {/* Salary */}
            <div className="bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-2 shadow-inner">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[10px]">支給給与</span>
              <span className="text-amber-400 font-bold">¥{stats.salary.toLocaleString()}</span>
            </div>

            {/* Security Rating meter */}
            <div className={`px-3 py-1.5 rounded-md border flex items-center gap-2.5 ${healthColor}`}>
              <div className="flex items-center gap-1.5">
                {health < 50 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold">会社防衛度</span>
                    <span className="font-extrabold">{health}%</span>
                  </div>
                  {/* Mini bar */}
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className={`h-full transition-all duration-500 ${healthBarBg}`} 
                      style={{ width: `${health}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Buttons: Sound, Manual, Reset */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-colors"
              title={isMuted ? 'サウンドを有効化' : 'サウンドをミュート'}
              aria-label="Sound toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Manual Handbook */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenManual();
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/50 text-xs font-medium transition-all shadow-sm"
              title="セキュリティマニュアルを開く"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>マニュアル</span>
              {hasUnreadManualAlert && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>

            {/* Title Screen Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onReturnToTitle();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 text-xs font-medium transition-colors"
              title="タイトル画面に戻る"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">タイトル</span>
            </button>

            {/* Reset / Career Restart */}
            <button
              onClick={onResetGame}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
              title="最初からやり直す (リセット)"
              aria-label="Reset career"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
