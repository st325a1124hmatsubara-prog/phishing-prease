export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export type Verdict = 'SAFE' | 'THREAT';

export type AttackCategory =
  | 'DISPLAY_NAME_SPOOF'    // 表示名なりすまし
  | 'TYPOSQUATTING'         // 類似ドメイン・タイポスクワッティング
  | 'HOMOGLYPH_PUNYCODE'    // 異体字・Punycode偽装
  | 'URL_MISMATCH'          // 表示URLと実リンク先相違
  | 'SUBDOMAIN_TRICK'       // サブドメイン偽装 (login.bank.com.fake.xyz)
  | 'SHORT_URL'             // 短縮URLの悪用
  | 'DOUBLE_EXTENSION'      // 二重拡張子 (invoice.pdf.exe)
  | 'MACRO_MALWARE'         // マクロ内蔵Officeファイル
  | 'BEC_WIRE_FRAUD'        // ビジネスメール詐欺 (振込先変更)
  | 'CEO_FRAUD'             // 経営陣なりすまし (至急ギフトカード要求等)
  | 'CREDENTIAL_PHISH'      // パスワード・アカウント情報窃取
  | 'URGENT_PSYCHOLOGY'     // 脅迫・期限煽り心理誘導
  | 'SPF_DKIM_FAIL'         // 送信ドメイン認証失敗
  | 'DELIVERY_PHISH'        // 配達通知・不在連絡偽装型
  | 'SPEAR_PHISHING'        // 標的型（スピアフィッシング）
  | 'SEXTORTION_BLACKMAIL'  // 恐喝・脅迫型（セクストーション）
  | 'THREAD_HIJACK_CLONE'   // メール返信偽装・会話スレッドハイジャック型
  | 'LEGITIMATE';           // 正常メール

export interface HeaderDetails {
  from: string;
  fromDisplayName: string;
  returnPath: string;
  replyTo?: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  spf: {
    status: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NEUTRAL' | 'NONE';
    clientIp: string;
    details: string;
  };
  dkim: {
    status: 'PASS' | 'FAIL' | 'NONE';
    domain: string;
    details: string;
  };
  dmarc: {
    status: 'PASS' | 'FAIL' | 'NONE';
    policy: 'none' | 'quarantine' | 'reject';
    details: string;
  };
  hops: Array<{
    by: string;
    from: string;
    timestamp: string;
    country: string;
  }>;
}

export interface AttachmentDetails {
  fileName: string;
  fileSize: string;
  fileType: string;
  isSuspicious: boolean;
  suspicionReason?: string;
  staticScan: {
    trueMimeType: string;
    hasMacros: boolean;
    hasHiddenExtension: boolean;
    entropyScore: number; // 0-10
    antivirusDetection: string; // e.g. "Clean" or "Trojan.Agent.WScript"
  };
}

export interface UrlDetails {
  displayText: string;
  targetUrl: string;
  domain: string;
  isMismatch: boolean;
  isSuspicious: boolean;
  suspicionReason?: string;
  destinationPreview?: string;
  sslCert: {
    issuer: string;
    isValid: boolean;
    daysOld: number;
  };
  whoisAgeDays: number;
}

export interface SuspiciousPhrase {
  id: string;
  text: string;
  reason: string;
  isSuspicious: boolean;
}

export interface ChineseKanjiAnomaly {
  id: string;
  injectedText: string;    // e.g. "确认"
  originalJpText: string;  // e.g. "確認"
  location: 'SUBJECT' | 'BODY';
  subtlety: 'OBVIOUS' | 'MODERATE' | 'SUBTLE';
  charExplanation: string; // 混入している文字が中国語の簡体字であることの説明
  securityReason: string;  // このような表記が含まれている場合に注意すべき理由
  unicodeHex?: string;     // e.g. "U+786E U+8BA4"
  jpUnicodeHex?: string;   // e.g. "U+78BA U+8A8D"
}

export interface EmailItem {
  id: string;
  day: number;
  difficulty: Difficulty;
  isThreat: boolean;
  category: AttackCategory;
  categoryTitle: string;
  
  senderDisplayName: string;
  senderEmail: string;
  senderDomain: string;
  officialDomain?: string;
  
  recipient: string;
  subject: string;
  receivedAt: string;
  
  body: string;
  bodyPhrases?: SuspiciousPhrase[];
  chineseAnomalies?: ChineseKanjiAnomaly[];
  
  urls: UrlDetails[];
  attachments: AttachmentDetails[];
  headers: HeaderDetails;
  
  // Clues & Investigation data
  domainAnalysis: {
    domainName: string;
    isTyposquat: boolean;
    officialEquivalent?: string;
    domainAge: string;
    registrar: string;
    notes: string;
  };
  
  addressAnalysis: {
    displayNameVsEmailMatch: boolean;
    anomalyDetected: boolean;
    notes: string;
  };

  explanation: {
    summary: string;
    keyPoints: string[];
    threatIndicators: string[];
    safeIndicators: string[];
    bestPractice: string;
  };
}

export interface EmailInspectionState {
  inspectedSender: boolean;
  inspectedDomain: boolean;
  inspectedUrls: string[]; // targetUrl
  inspectedAttachments: string[]; // fileName
  inspectedHeaders: boolean;
  inspectedPhrases: string[]; // phraseId
  inspectedKanji?: string[]; // anomalyId
}

export interface EmailAuditRecord {
  emailId: string;
  day: number;
  playerVerdict: Verdict;
  actualVerdict: Verdict;
  isCorrect: boolean;
  inspectedCount: number;
  earnedSalary: number;
  securityImpact: number;
  timestamp: string;
}

export interface DaySummary {
  day: number;
  difficulty: Difficulty;
  totalReviewed: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  threatsBlocked: number;
  threatsPassed: number; // False Negatives (Critical)
  safeBlocked: number;   // False Positives (Disruption)
  daySalary: number;
  securityChange: number;
  finalSecurityRating: number;
  learnedPoints: string[];
  isTimeout?: boolean;
  unreviewedCount?: number;
  unreviewedPenalty?: number;
}

export interface GameStats {
  totalReviewed: number;
  totalCorrect: number;
  totalThreatsBlocked: number;
  totalFalseNegatives: number;
  totalFalsePositives: number;
  currentStreak: number;
  bestStreak: number;
  salary: number;
  companySecurityRating: number; // 0 - 100
  currentDay: number;
  difficulty: Difficulty;
  unlockedManualTopics: string[];
  history: DaySummary[];
}
