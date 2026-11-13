import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  BookOpen, 
  RotateCcw, 
  Terminal, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Difficulty, GameStats } from '../types/game';
import { soundManager } from '../utils/audio';

interface TitleScreenProps {
  currentStats: GameStats;
  onStartNewGame: (difficulty: Difficulty) => void;
  onResumeGame: () => void;
  onOpenManual: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  currentStats,
  onStartNewGame,
  onResumeGame,
  onOpenManual
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentStats.difficulty || 'NORMAL');

  const hasSavedProgress = currentStats.totalReviewed > 0 && currentStats.companySecurityRating > 0;

  const difficultyDetails: Record<Difficulty, { label: string; badge: string; desc: string; quota: string; threatStyle: string; penalty: string; timeLimit: string }> = {
    EASY: {
      label: 'EASY（研修生・基礎審査）',
      badge: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      desc: '調査ツールに親切な解説ヒントが表示されます。明らかな中国語簡体字（3〜5箇所）が混入しやすく発見が容易。判定ミス時のペナルティは軽微です。',
      quota: '1日 5件',
      threatStyle: '古典的フィッシング・明白な簡体字混入',
      penalty: 'ペナルティ: 軽度 (-15%)',
      timeLimit: '制限時間: なし（無制限）'
    },
    NORMAL: {
      label: 'NORMAL（実務担当官・標準運用）',
      badge: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      desc: '本物と精巧な偽物が混在。簡体字は1〜2文字程度の控えめな混入となり、サブドメイン偽装やマクロ添付など複数項目の照合が求められます。',
      quota: '1日 7件',
      threatStyle: '実在企業なりすまし・控えめな表記異常',
      penalty: 'ペナルティ: 標準 (-25%)',
      timeLimit: '制限時間: 6分00秒（翌日+10秒）'
    },
    HARD: {
      label: 'HARD（SOC上級主任・自律フォレンジック）',
      badge: 'text-rose-400 border-rose-800 bg-rose-950/60',
      desc: '【高難度・ペナルティ激甚】大部分が極めて自然な日本語で、見落としやすい1文字のみの微細な字体異常や完全無混入のBECも出現。解説文は判定時まで非表示。通過ミス（-45%）は2通で即解雇！',
      quota: '1日 8件',
      threatStyle: '自律照合・見落としやすい異体字・高度標的型',
      penalty: 'ペナルティ: 激甚 (-45% / 誤拒否 -20%)',
      timeLimit: '制限時間: 3分00秒（翌日+10秒）'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden soc-grid-bg selection:bg-cyan-500 selection:text-black">
      
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>CYBER_DEFENSE_CORP // EMAIL_SECURITY_SOC // ST-09</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-bold">SYSTEM ACTIVE</span>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center text-center">
        
        {/* Emblem & Title */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-slate-900 border-2 border-cyan-400/40 shadow-2xl shadow-cyan-900/50 flex items-center justify-center transform rotate-3">
              <ShieldAlert className="w-11 h-11 text-cyan-200" />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-rose-600 text-[10px] font-black font-mono tracking-widest text-white shadow-md">
              INSPECTION
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-wider text-slate-100 flex items-center justify-center gap-3">
            <span>PHISHING, PLEASE</span>
          </h1>

          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 tracking-widest uppercase">
            <span className="h-px w-8 bg-cyan-500/50" />
            <span>企業メールセキュリティ審査シミュレーション</span>
            <span className="h-px w-8 bg-cyan-500/50" />
          </div>

          <p className="max-w-xl text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed font-sans">
            社内に届く大量のメールを1通ずつフォレンジック調査し、<br className="hidden sm:inline" />
            偽装アドレス・悪意あるリンク・二重拡張子・標的型詐欺を暴いて会社資産を守り抜け。
          </p>
        </div>

        {/* Difficulty Selection Card */}
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md mb-6 text-left">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                1. 難易度（配属部門）を選択
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              選択中: <strong className="text-cyan-300">{selectedDifficulty}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['EASY', 'NORMAL', 'HARD'] as Difficulty[]).map((diff) => {
              const isSelected = selectedDifficulty === diff;
              const details = difficultyDetails[diff];

              return (
                <button
                  key={diff}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedDifficulty(diff);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-black text-sm text-slate-100">
                        {diff}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium mb-1">
                      {diff === 'EASY' ? '基礎・研修' : diff === 'NORMAL' ? '実務・標準' : '高度標的型'}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">
                      {details.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{details.quota}</span>
                      <span className="text-cyan-400/80 font-bold">DAY 01〜</span>
                    </div>
                    <div className="text-amber-400 font-semibold text-[9px] truncate">
                      {details.timeLimit}
                    </div>
                    <div className="text-rose-400 font-bold text-[9px] truncate">
                      {details.penalty}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Launch Buttons */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Start Day 1 Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onStartNewGame(selectedDifficulty);
            }}
            className="group py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-sm font-mono tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-900/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>DAY 01 から審査を開始する</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Resume Saved Career (if exists) */}
          {hasSavedProgress && (
            <button
              onClick={() => {
                soundManager.playClick();
                onResumeGame();
              }}
              className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs font-mono border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>前回のシフトを再開 (DAY {String(currentStats.currentDay).padStart(2, '0')})</span>
              <span className="text-amber-400">¥{currentStats.salary.toLocaleString()}</span>
            </button>
          )}

          {/* Open Security Manual Handbook */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenManual();
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>セキュリティ教本（攻撃手法マニュアル）を開く</span>
          </button>
        </div>

      </main>

      {/* Footer System Specs */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-3 text-center text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span>FRAMEWORK: REACT + TS + TAILWIND</span>
          <span>•</span>
          <span>SIMULATION: FORENSIC INVESTIGATION & AUDIT</span>
        </div>
        <div>
          <span>PHISHING, PLEASE © 2026 CYBER DEFENSE LABS</span>
        </div>
      </footer>

    </div>
  );
};
