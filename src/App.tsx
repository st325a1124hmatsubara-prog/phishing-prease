import React, { useState, useEffect, useMemo } from 'react';
import { 
  Difficulty, 
  GameStats, 
  Verdict, 
  EmailItem, 
  EmailAuditRecord, 
  EmailInspectionState, 
  UrlDetails, 
  AttachmentDetails, 
  SuspiciousPhrase, 
  ChineseKanjiAnomaly,
  DaySummary 
} from './types/game';
import { getEmailsForSession } from './data/emails';
import { 
  loadGameStats, 
  saveGameStats, 
  loadAuditRecords, 
  saveAuditRecords, 
  resetGameStorage, 
  INITIAL_GAME_STATS 
} from './utils/storage';
import { soundManager } from './utils/audio';
import { getDayTimeLimit } from './utils/timer';

// Components
import { Header } from './components/Header';
import { EmailList } from './components/EmailList';
import { EmailViewer } from './components/EmailViewer';
import { InvestigationPanel, ActiveInspection } from './components/InvestigationPanel';
import { VerdictModal } from './components/VerdictModal';
import { DayStartModal } from './components/DayStartModal';
import { DayEndModal } from './components/DayEndModal';
import { SecurityManualModal } from './components/SecurityManualModal';
import { GameOverModal } from './components/GameOverModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { TitleScreen } from './components/TitleScreen';

export default function App() {
  // Title Screen State (defaults to true for immersive entry)
  const [isTitleScreen, setIsTitleScreen] = useState<boolean>(true);

  // Game Stats
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());
  const [auditRecords, setAuditRecords] = useState<Record<string, EmailAuditRecord>>(() => loadAuditRecords());
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.isMuted);

  // Current session email queue
  const dayEmails = useMemo(() => {
    return getEmailsForSession(stats.currentDay, stats.difficulty);
  }, [stats.currentDay, stats.difficulty]);

  const [currentEmailIndex, setCurrentEmailIndex] = useState<number>(0);
  const activeEmail: EmailItem = dayEmails[currentEmailIndex] || dayEmails[0];

  // Forensic Inspection States (tracked per email id)
  const [inspectionStates, setInspectionStates] = useState<Record<string, EmailInspectionState>>({});
  const [activeInspection, setActiveInspection] = useState<ActiveInspection>(null);

  // Responsive mobile active view: 'INBOX' | 'VIEWER' | 'INSPECTION'
  const [mobileTab, setMobileTab] = useState<'INBOX' | 'VIEWER' | 'INSPECTION'>('VIEWER');

  // Modals state
  const [isDayStartOpen, setIsDayStartOpen] = useState<boolean>(false);
  const [isDayEndOpen, setIsDayEndOpen] = useState<boolean>(false);
  const [isVerdictOpen, setIsVerdictOpen] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [latestDaySummary, setLatestDaySummary] = useState<DaySummary | null>(null);

  // Timer State (NORMAL: 6 min base, HARD: 3 min base, +10s per next day. EASY: null)
  const timeLimit = useMemo(() => {
    return getDayTimeLimit(stats.difficulty, stats.currentDay);
  }, [stats.difficulty, stats.currentDay]);

  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    return getDayTimeLimit(stats.difficulty, stats.currentDay);
  });

  // Check if all emails for today are reviewed
  const isDayCompleted = dayEmails.length > 0 && dayEmails.every(e => !!auditRecords[e.id]);

  // Is timer paused: paused during verdict, briefing, day-end, manual, reset dialog, title screen, or when ratings hit 0
  const isTimerPaused = useMemo(() => {
    if (timeLimit === null) return false;
    return isVerdictOpen || isDayStartOpen || isDayEndOpen || isManualOpen || isResetConfirmOpen || isTitleScreen || (stats.companySecurityRating <= 0);
  }, [timeLimit, isVerdictOpen, isDayStartOpen, isDayEndOpen, isManualOpen, isResetConfirmOpen, isTitleScreen, stats.companySecurityRating]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLimit === null) return;
    if (timeLeft === null || timeLeft <= 0) return;
    if (isTimerPaused || isDayCompleted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, timeLeft, isTimerPaused, isDayCompleted]);

  // Sync stats and audits to localStorage
  useEffect(() => {
    saveGameStats(stats);
  }, [stats]);

  useEffect(() => {
    saveAuditRecords(auditRecords);
  }, [auditRecords]);

  // Start new game from Day 1 with chosen difficulty
  const handleStartNewGameFromDay1 = (chosenDifficulty: Difficulty) => {
    resetGameStorage();
    const newStats: GameStats = {
      ...INITIAL_GAME_STATS,
      currentDay: 1,
      difficulty: chosenDifficulty
    };
    setStats(newStats);
    setAuditRecords({});
    setInspectionStates({});
    setCurrentEmailIndex(0);
    setActiveInspection(null);
    setTimeLeft(getDayTimeLimit(chosenDifficulty, 1));
    setIsTitleScreen(false);
    setIsDayStartOpen(true);
  };

  // Resume saved game
  const handleResumeGame = () => {
    setTimeLeft(getDayTimeLimit(stats.difficulty, stats.currentDay));
    setIsTitleScreen(false);
  };

  // Return to title screen
  const handleReturnToTitle = () => {
    setIsTitleScreen(true);
  };

  // Get or initialize inspection state for the active email
  const currentInspectionState: EmailInspectionState = inspectionStates[activeEmail?.id] || {
    inspectedSender: false,
    inspectedDomain: false,
    inspectedUrls: [],
    inspectedAttachments: [],
    inspectedHeaders: false,
    inspectedPhrases: []
  };

  const updateCurrentInspection = (updater: (prev: EmailInspectionState) => EmailInspectionState) => {
    if (!activeEmail) return;
    setInspectionStates(prev => ({
      ...prev,
      [activeEmail.id]: updater(prev[activeEmail.id] || {
        inspectedSender: false,
        inspectedDomain: false,
        inspectedUrls: [],
        inspectedAttachments: [],
        inspectedHeaders: false,
        inspectedPhrases: []
      })
    }));
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  // Difficulty change
  const handleChangeDifficulty = (diff: Difficulty) => {
    setStats(prev => ({ ...prev, difficulty: diff }));
    setTimeLeft(getDayTimeLimit(diff, stats.currentDay));
    setCurrentEmailIndex(0);
    setActiveInspection(null);
  };

  // Switch inspected item handlers
  const handleInspectSender = () => {
    updateCurrentInspection(prev => ({ ...prev, inspectedSender: true }));
    setActiveInspection({ type: 'SENDER' });
    setMobileTab('INSPECTION');
  };

  const handleInspectDomain = () => {
    updateCurrentInspection(prev => ({ ...prev, inspectedDomain: true }));
    setActiveInspection({ type: 'DOMAIN' });
    setMobileTab('INSPECTION');
  };

  const handleInspectUrl = (url: UrlDetails) => {
    updateCurrentInspection(prev => ({
      ...prev,
      inspectedUrls: Array.from(new Set([...prev.inspectedUrls, url.targetUrl]))
    }));
    setActiveInspection({ type: 'URL', data: url });
    setMobileTab('INSPECTION');
  };

  const handleInspectAttachment = (att: AttachmentDetails) => {
    updateCurrentInspection(prev => ({
      ...prev,
      inspectedAttachments: Array.from(new Set([...prev.inspectedAttachments, att.fileName]))
    }));
    setActiveInspection({ type: 'ATTACHMENT', data: att });
    setMobileTab('INSPECTION');
  };

  const handleInspectHeaders = () => {
    updateCurrentInspection(prev => ({ ...prev, inspectedHeaders: true }));
    setActiveInspection({ type: 'HEADERS' });
  };

  const handleInspectPhrase = (phrase: SuspiciousPhrase) => {
    updateCurrentInspection(prev => ({
      ...prev,
      inspectedPhrases: Array.from(new Set([...prev.inspectedPhrases, phrase.id]))
    }));
    setActiveInspection({ type: 'PHRASE', data: phrase });
    setMobileTab('INSPECTION');
  };

  const handleInspectKanji = (anomaly: ChineseKanjiAnomaly) => {
    updateCurrentInspection(prev => ({
      ...prev,
      inspectedKanji: Array.from(new Set([...(prev.inspectedKanji || []), anomaly.id]))
    }));
    setActiveInspection({ type: 'CHINESE_KANJI', data: anomaly });
    setMobileTab('INSPECTION');
  };

  // Final Verdict Logic
  const handleMakeVerdict = (playerVerdict: Verdict) => {
    if (!activeEmail || auditRecords[activeEmail.id]) return;

    const actualVerdict: Verdict = activeEmail.isThreat ? 'THREAT' : 'SAFE';
    const isCorrect = playerVerdict === actualVerdict;

    let earnedSalary = 0;
    let securityImpact = 0;

    // Difficulty-scaled rewards and penalties
    if (stats.difficulty === 'EASY') {
      if (isCorrect) {
        earnedSalary = activeEmail.isThreat ? 12000 : 8000;
        securityImpact = 2;
      } else {
        if (activeEmail.isThreat) {
          // False negative (threat passed)
          earnedSalary = -12000;
          securityImpact = -15;
          soundManager.playBuzzer();
        } else {
          // False positive (safe blocked)
          earnedSalary = -3000;
          securityImpact = -5;
          soundManager.playBuzzer();
        }
      }
    } else if (stats.difficulty === 'NORMAL') {
      if (isCorrect) {
        earnedSalary = activeEmail.isThreat ? 18000 : 10000;
        securityImpact = 2;
      } else {
        if (activeEmail.isThreat) {
          earnedSalary = -30000;
          securityImpact = -25;
          soundManager.playBuzzer();
        } else {
          earnedSalary = -8000;
          securityImpact = -10;
          soundManager.playBuzzer();
        }
      }
    } else {
      // HARD MODE: Massive stakes. False negatives or false positives carry catastrophic penalties.
      if (isCorrect) {
        earnedSalary = activeEmail.isThreat ? 35000 : 15000;
        securityImpact = 3;
      } else {
        if (activeEmail.isThreat) {
          earnedSalary = -60000;
          securityImpact = -45; // 2 leaked threats results in immediate critical breach
          soundManager.playBuzzer();
        } else {
          earnedSalary = -25000;
          securityImpact = -20; // Blocking mission-critical legitimate communication
          soundManager.playBuzzer();
        }
      }
    }

    const auditedItemCount = 
      (currentInspectionState.inspectedSender ? 1 : 0) +
      (currentInspectionState.inspectedDomain ? 1 : 0) +
      currentInspectionState.inspectedUrls.length +
      currentInspectionState.inspectedAttachments.length +
      (currentInspectionState.inspectedHeaders ? 1 : 0) +
      currentInspectionState.inspectedPhrases.length +
      (currentInspectionState.inspectedKanji?.length || 0);

    const newRecord: EmailAuditRecord = {
      emailId: activeEmail.id,
      day: stats.currentDay,
      playerVerdict,
      actualVerdict,
      isCorrect,
      inspectedCount: auditedItemCount,
      earnedSalary,
      securityImpact,
      timestamp: new Date().toLocaleTimeString('ja-JP')
    };

    // Update Audits
    const updatedAudits = { ...auditRecords, [activeEmail.id]: newRecord };
    setAuditRecords(updatedAudits);

    // Update Stats
    setStats(prev => {
      const newRating = Math.max(0, Math.min(100, prev.companySecurityRating + securityImpact));
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const newSalary = Math.max(0, prev.salary + earnedSalary);

      // Unlock attack topic if threat encountered
      const unlockedManual = [...prev.unlockedManualTopics];
      if (activeEmail.chineseAnomalies && activeEmail.chineseAnomalies.length > 0 && !unlockedManual.includes('chinese-simplified-phish')) {
        unlockedManual.push('chinese-simplified-phish');
      }
      if (activeEmail.category === 'DISPLAY_NAME_SPOOF' && !unlockedManual.includes('display-name-spoof')) {
        unlockedManual.push('display-name-spoof');
      }
      if (activeEmail.category === 'TYPOSQUATTING' && !unlockedManual.includes('typosquatting')) {
        unlockedManual.push('typosquatting');
      }
      if (activeEmail.category === 'SUBDOMAIN_TRICK' && !unlockedManual.includes('url-mismatch')) {
        unlockedManual.push('url-mismatch');
      }
      if (activeEmail.category === 'DOUBLE_EXTENSION' && !unlockedManual.includes('double-extension')) {
        unlockedManual.push('double-extension');
      }
      if (activeEmail.category === 'MACRO_MALWARE' && !unlockedManual.includes('macro-malware')) {
        unlockedManual.push('macro-malware');
      }
      if (activeEmail.category === 'BEC_WIRE_FRAUD' && !unlockedManual.includes('bec-wire-fraud')) {
        unlockedManual.push('bec-wire-fraud');
      }
      if (activeEmail.category === 'HOMOGLYPH_PUNYCODE' && !unlockedManual.includes('typosquatting')) {
        unlockedManual.push('typosquatting');
      }

      return {
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
        totalThreatsBlocked: isCorrect && activeEmail.isThreat ? prev.totalThreatsBlocked + 1 : prev.totalThreatsBlocked,
        totalFalseNegatives: !isCorrect && activeEmail.isThreat ? prev.totalFalseNegatives + 1 : prev.totalFalseNegatives,
        totalFalsePositives: !isCorrect && !activeEmail.isThreat ? prev.totalFalsePositives + 1 : prev.totalFalsePositives,
        currentStreak: newStreak,
        bestStreak,
        salary: newSalary,
        companySecurityRating: newRating,
        unlockedManualTopics: unlockedManual
      };
    });

    // Open assessment ticket modal
    setIsVerdictOpen(true);
  };

  // Next email handler
  const handleNextEmail = () => {
    setIsVerdictOpen(false);
    if (currentEmailIndex < dayEmails.length - 1) {
      setCurrentEmailIndex(prev => prev + 1);
      setActiveInspection(null);
      setMobileTab('VIEWER');
    } else {
      // Last email completed
      handleFinishDay();
    }
  };

  // Time-out Handler: Force finish day and penalize unreviewed emails
  const handleTimeOut = () => {
    if (timeLimit === null || isDayEndOpen || isTitleScreen) return;
    soundManager.playBuzzer();

    // 1. Identify all emails for today that were not audited in time
    const unreviewed = dayEmails.filter(e => !auditRecords[e.id]);
    if (unreviewed.length === 0) return;

    let totalPenaltySec = 0;
    let totalPenaltySal = 0;
    const timeoutAudits: Record<string, EmailAuditRecord> = {};

    unreviewed.forEach(e => {
      let earnedSalary = 0;
      let securityImpact = 0;

      if (e.isThreat) {
        // Critical threat slipped through because audit expired
        if (stats.difficulty === 'HARD') {
          earnedSalary = -30000;
          securityImpact = -45;
        } else {
          earnedSalary = -15000;
          securityImpact = -25;
        }
      } else {
        // Legitimate business email delayed/failed in queue
        if (stats.difficulty === 'HARD') {
          earnedSalary = -20000;
          securityImpact = -20;
        } else {
          earnedSalary = -10000;
          securityImpact = -10;
        }
      }

      totalPenaltySec += securityImpact;
      totalPenaltySal += earnedSalary;

      timeoutAudits[e.id] = {
        emailId: e.id,
        day: stats.currentDay,
        playerVerdict: 'THREAT',
        actualVerdict: e.isThreat ? 'THREAT' : 'SAFE',
        isCorrect: false,
        inspectedCount: 0,
        earnedSalary,
        securityImpact,
        timestamp: '時間切れ未審査'
      };
    });

    // Close any open transient modals
    setIsVerdictOpen(false);
    setIsManualOpen(false);
    setIsDayStartOpen(false);

    const mergedAudits = { ...auditRecords, ...timeoutAudits };
    setAuditRecords(mergedAudits);

    const newRating = Math.max(0, stats.companySecurityRating + totalPenaltySec);
    const newSalary = Math.max(0, stats.salary + totalPenaltySal);

    const unreviewedThreatsCount = unreviewed.filter(e => e.isThreat).length;
    const unreviewedSafeCount = unreviewed.filter(e => !e.isThreat).length;

    setStats(prev => ({
      ...prev,
      totalReviewed: prev.totalReviewed + unreviewed.length,
      totalFalseNegatives: prev.totalFalseNegatives + unreviewedThreatsCount,
      totalFalsePositives: prev.totalFalsePositives + unreviewedSafeCount,
      salary: newSalary,
      companySecurityRating: newRating
    }));

    // Compute day summary with timeout flag
    const allDayAudits = dayEmails.map(e => mergedAudits[e.id]).filter(Boolean);
    const correctCount = allDayAudits.filter(a => a.isCorrect).length;
    const incorrectCount = allDayAudits.length - correctCount;
    const accuracyRate = allDayAudits.length > 0 ? Math.round((correctCount / allDayAudits.length) * 100) : 0;
    const threatsBlocked = allDayAudits.filter(a => a.isCorrect && a.actualVerdict === 'THREAT').length;
    const threatsPassed = allDayAudits.filter(a => !a.isCorrect && a.actualVerdict === 'THREAT').length;
    const safeBlocked = allDayAudits.filter(a => !a.isCorrect && a.actualVerdict === 'SAFE').length;
    const daySalary = allDayAudits.reduce((acc, a) => acc + Math.max(0, a.earnedSalary), 0);
    const securityChange = allDayAudits.reduce((acc, a) => acc + a.securityImpact, 0);

    const summary: DaySummary = {
      day: stats.currentDay,
      difficulty: stats.difficulty,
      totalReviewed: allDayAudits.length,
      correctCount,
      incorrectCount,
      accuracyRate,
      threatsBlocked,
      threatsPassed,
      safeBlocked,
      daySalary,
      securityChange,
      finalSecurityRating: newRating,
      isTimeout: true,
      unreviewedCount: unreviewed.length,
      unreviewedPenalty: totalPenaltySec,
      learnedPoints: [
        '【時間切れ強制終了】制限時間内に審査できなかったメールはすべて重大ペナルティとして計上されます。',
        '短時間で効率的に見分けるには、差出人ドメインとヘッダーSPF/DKIMを素早く確認する習慣が重要です。',
        '翌日へ進むと制限時間が+10秒延長されます。焦らず優先度の高い項目から調査しましょう。'
      ]
    };

    setLatestDaySummary(summary);
    setStats(prev => ({
      ...prev,
      history: [...prev.history, summary]
    }));

    setIsDayEndOpen(true);
  };

  // Watch for timeout expiry
  useEffect(() => {
    if (timeLimit !== null && timeLeft === 0 && !isDayEndOpen && !isDayCompleted && !isTitleScreen) {
      handleTimeOut();
    }
  }, [timeLeft, timeLimit, isDayEndOpen, isDayCompleted, isTitleScreen]);

  // Finish day evaluation
  const handleFinishDay = () => {
    setIsVerdictOpen(false);

    // Compute day summary
    const todayAudits = dayEmails.map(e => auditRecords[e.id]).filter(Boolean);
    const correctCount = todayAudits.filter(a => a.isCorrect).length;
    const incorrectCount = todayAudits.length - correctCount;
    const accuracyRate = todayAudits.length > 0 ? Math.round((correctCount / todayAudits.length) * 100) : 0;

    const threatsBlocked = todayAudits.filter(a => a.isCorrect && a.actualVerdict === 'THREAT').length;
    const threatsPassed = todayAudits.filter(a => !a.isCorrect && a.actualVerdict === 'THREAT').length;
    const safeBlocked = todayAudits.filter(a => !a.isCorrect && a.actualVerdict === 'SAFE').length;
    
    const daySalary = todayAudits.reduce((acc, a) => acc + Math.max(0, a.earnedSalary), 0);
    const securityChange = todayAudits.reduce((acc, a) => acc + a.securityImpact, 0);

    const learnedPoints = [
      '差出人アドレスのドメイン名と表示名の不一致はフィッシング詐欺の最大の兆候です。',
      '「緊急対応」や「アカウント停止」を煽るメールは一度立ち止まり、正規ポータルから確認しましょう。',
      '添付ファイルが「.exe」や「.xlsm」である場合、開く前に必ずセキュリティ部門の調査ツールを通してください。'
    ];

    const summary: DaySummary = {
      day: stats.currentDay,
      difficulty: stats.difficulty,
      totalReviewed: todayAudits.length,
      correctCount,
      incorrectCount,
      accuracyRate,
      threatsBlocked,
      threatsPassed,
      safeBlocked,
      daySalary,
      securityChange,
      finalSecurityRating: stats.companySecurityRating,
      learnedPoints
    };

    setLatestDaySummary(summary);
    setStats(prev => ({
      ...prev,
      history: [...prev.history, summary]
    }));
    setIsDayEndOpen(true);
  };

  // Next Day Transition
  const handleAdvanceToNextDay = () => {
    setIsDayEndOpen(false);
    if (stats.companySecurityRating <= 0) {
      // Rating is 0, Game Over screen displays
      return;
    }
    const nextDay = stats.currentDay + 1;
    setStats(prev => ({ ...prev, currentDay: nextDay }));
    setTimeLeft(getDayTimeLimit(stats.difficulty, nextDay));
    setCurrentEmailIndex(0);
    setActiveInspection(null);
    setMobileTab('VIEWER');
    setIsDayStartOpen(true);
  };

  // Retry Current Day
  const handleRetryDay = () => {
    // Clear audits for today's emails
    const emailIds = new Set(dayEmails.map(e => e.id));
    const cleanedAudits = Object.fromEntries(
      Object.entries(auditRecords).filter(([id]) => !emailIds.has(id))
    );
    setAuditRecords(cleanedAudits);
    setStats(prev => ({
      ...prev,
      companySecurityRating: 100 // Reset security rating to 100% for retry
    }));
    setTimeLeft(getDayTimeLimit(stats.difficulty, stats.currentDay));
    setCurrentEmailIndex(0);
    setActiveInspection(null);
    setIsDayStartOpen(true);
  };

  // Restart Entire Career
  const handleRestartCareer = () => {
    resetGameStorage();
    setStats(INITIAL_GAME_STATS);
    setAuditRecords({});
    setInspectionStates({});
    setTimeLeft(getDayTimeLimit(INITIAL_GAME_STATS.difficulty, 1));
    setCurrentEmailIndex(0);
    setActiveInspection(null);
    setIsResetConfirmOpen(false);
    setIsDayStartOpen(true);
  };

  // Check Game Over condition (suppressed while DayEndModal is open so user sees performance report first)
  const isGameOver = !isDayEndOpen && stats.companySecurityRating <= 0;

  // Active email audit record if already reviewed
  const currentAuditRecord = activeEmail ? auditRecords[activeEmail.id] : undefined;

  // Title Screen Mode
  if (isTitleScreen) {
    return (
      <>
        <TitleScreen
          currentStats={stats}
          onStartNewGame={handleStartNewGameFromDay1}
          onResumeGame={handleResumeGame}
          onOpenManual={() => setIsManualOpen(true)}
        />
        <SecurityManualModal
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
          unlockedTopicIds={stats.unlockedManualTopics}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <Header
        stats={stats}
        currentEmailIndex={currentEmailIndex}
        totalEmails={dayEmails.length}
        timeLeft={timeLeft}
        timeLimit={timeLimit}
        isTimerPaused={isTimerPaused}
        onOpenManual={() => setIsManualOpen(true)}
        onResetGame={() => setIsResetConfirmOpen(true)}
        onReturnToTitle={handleReturnToTitle}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        hasUnreadManualAlert={stats.unlockedManualTopics.length > 2}
      />

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex items-center border-b border-slate-800 bg-slate-900 text-xs font-mono">
        <button
          onClick={() => {
            soundManager.playClick();
            setMobileTab('INBOX');
          }}
          className={`flex-1 py-2 text-center border-b-2 font-bold transition-colors ${
            mobileTab === 'INBOX' ? 'border-cyan-400 text-cyan-400 bg-slate-950' : 'border-transparent text-slate-400'
          }`}
        >
          受信一覧 ({dayEmails.length})
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setMobileTab('VIEWER');
          }}
          className={`flex-1 py-2 text-center border-b-2 font-bold transition-colors ${
            mobileTab === 'VIEWER' ? 'border-cyan-400 text-cyan-400 bg-slate-950' : 'border-transparent text-slate-400'
          }`}
        >
          メール本文
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setMobileTab('INSPECTION');
          }}
          className={`flex-1 py-2 text-center border-b-2 font-bold transition-colors ${
            mobileTab === 'INSPECTION' ? 'border-cyan-400 text-cyan-400 bg-slate-950' : 'border-transparent text-slate-400'
          }`}
        >
          調査 & 判定
        </button>
      </div>

      {/* Main Workstation: 3 Column Layout on Desktop */}
      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto shadow-2xl">
        
        {/* Left: Email List Queue */}
        <section className={`w-full md:w-72 lg:w-80 shrink-0 ${mobileTab === 'INBOX' ? 'block' : 'hidden md:block'}`}>
          <EmailList
            emails={dayEmails}
            selectedIndex={currentEmailIndex}
            onSelectEmail={(idx) => {
              setCurrentEmailIndex(idx);
              setActiveInspection(null);
              setMobileTab('VIEWER');
            }}
            auditRecords={auditRecords}
          />
        </section>

        {/* Center: Email Interactive Viewer */}
        <section className={`flex-1 min-w-0 ${mobileTab === 'VIEWER' ? 'block' : 'hidden md:block'}`}>
          {activeEmail ? (
            <EmailViewer
              email={activeEmail}
              inspectionState={currentInspectionState}
              onInspectSender={handleInspectSender}
              onInspectDomain={handleInspectDomain}
              onInspectUrl={handleInspectUrl}
              onInspectAttachment={handleInspectAttachment}
              onInspectHeaders={handleInspectHeaders}
              onInspectPhrase={handleInspectPhrase}
              onInspectKanji={handleInspectKanji}
              isAudited={!!currentAuditRecord}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              メールが選択されていません
            </div>
          )}
        </section>

        {/* Right: Forensic Investigation Tool & Stamp Verdict Station */}
        <section className={`w-full md:w-80 lg:w-96 shrink-0 ${mobileTab === 'INSPECTION' ? 'block' : 'hidden md:block'}`}>
          {activeEmail && (
            <InvestigationPanel
              email={activeEmail}
              activeInspection={activeInspection}
              inspectionState={currentInspectionState}
              difficulty={stats.difficulty}
              onMakeVerdict={handleMakeVerdict}
              auditRecord={currentAuditRecord}
              onShowVerdictDetails={() => setIsVerdictOpen(true)}
            />
          )}
        </section>

      </main>

      {/* Modals */}
      {/* 1. Day Start Briefing */}
      <DayStartModal
        isOpen={isDayStartOpen}
        day={stats.currentDay}
        difficulty={stats.difficulty}
        emailCount={dayEmails.length}
        onStartDay={() => setIsDayStartOpen(false)}
      />

      {/* 2. Verdict Explanation & Score Modal */}
      {activeEmail && currentAuditRecord && (
        <VerdictModal
          isOpen={isVerdictOpen}
          email={activeEmail}
          auditRecord={currentAuditRecord}
          onNextEmail={handleNextEmail}
          isLastEmailOfDay={currentEmailIndex === dayEmails.length - 1}
          onFinishDay={handleFinishDay}
          onClose={() => setIsVerdictOpen(false)}
        />
      )}

      {/* 3. Day End Performance Report */}
      {latestDaySummary && (
        <DayEndModal
          isOpen={isDayEndOpen}
          summary={latestDaySummary}
          onNextDay={handleAdvanceToNextDay}
        />
      )}

      {/* 4. Security Manual & Attack Encyclopedia */}
      <SecurityManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        unlockedTopicIds={stats.unlockedManualTopics}
      />

      {/* 5. Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        day={stats.currentDay}
        reason={latestDaySummary?.isTimeout ? '審査制限時間の超過により未審査メールが社内ネットワークに放置され、会社セキュリティ防衛度が0%に崩壊しました。' : undefined}
        onRetryDay={handleRetryDay}
        onRestartCareer={handleRestartCareer}
      />

      {/* 6. Career Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onConfirm={handleRestartCareer}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

    </div>
  );
}
