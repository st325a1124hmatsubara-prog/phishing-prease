import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  ExternalLink, 
  Paperclip, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  FileCode, 
  Clock, 
  HelpCircle,
  Maximize2,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { 
  EmailItem, 
  EmailInspectionState, 
  UrlDetails, 
  AttachmentDetails, 
  SuspiciousPhrase,
  ChineseKanjiAnomaly
} from '../types/game';
import { soundManager } from '../utils/audio';
import { sanitizeDisplayText } from '../utils/security';

interface EmailViewerProps {
  email: EmailItem;
  inspectionState: EmailInspectionState;
  onInspectSender: () => void;
  onInspectDomain: () => void;
  onInspectUrl: (url: UrlDetails) => void;
  onInspectAttachment: (att: AttachmentDetails) => void;
  onInspectHeaders: () => void;
  onInspectPhrase: (phrase: SuspiciousPhrase) => void;
  onInspectKanji: (anomaly: ChineseKanjiAnomaly) => void;
  isAudited: boolean;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  inspectionState,
  onInspectSender,
  onInspectDomain,
  onInspectUrl,
  onInspectAttachment,
  onInspectHeaders,
  onInspectPhrase,
  onInspectKanji,
  isAudited
}) => {
  const [activeTab, setActiveTab] = useState<'BODY' | 'HEADERS'>('BODY');

  // Helper to render subject with clickable kanji anomalies
  const renderSubject = () => {
    const subjectAnomalies = email.chineseAnomalies?.filter(a => a.location === 'SUBJECT') || [];
    if (subjectAnomalies.length === 0) {
      return email.subject;
    }

    let text = sanitizeDisplayText(email.subject);
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;

    const sorted = [...subjectAnomalies]
      .filter(a => a.injectedText.length > 0)
      .sort((a, b) => text.indexOf(a.injectedText) - text.indexOf(b.injectedText));

    sorted.forEach((anomaly, idx) => {
      const pos = text.indexOf(anomaly.injectedText, lastIdx);
      if (pos !== -1) {
        if (pos > lastIdx) {
          parts.push(<span key={`subj-txt-${idx}`}>{text.substring(lastIdx, pos)}</span>);
        }
        const isInspected = inspectionState.inspectedKanji?.includes(anomaly.id);
        parts.push(
          <button
            key={`subj-kanji-${anomaly.id}`}
            onClick={() => {
              soundManager.playScan();
              onInspectKanji(anomaly);
            }}
            className={`inline-block px-1.5 py-0.5 mx-0.5 rounded text-left transition-all cursor-pointer font-bold ${
              isInspected
                ? 'bg-rose-950/80 text-rose-300 border-b-2 border-rose-400'
                : 'bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 border-b border-dashed border-rose-500/80'
            }`}
            title="クリックして簡体字・表記異常を調査"
          >
            {anomaly.injectedText}
            <span className="ml-1 text-[9px] font-mono text-rose-400 opacity-80">🔍簡体字</span>
          </button>
        );
        lastIdx = pos + anomaly.injectedText.length;
      }
    });

    if (lastIdx < text.length) {
      parts.push(<span key="subj-end">{text.substring(lastIdx)}</span>);
    }

    return parts;
  };

  // Helper to render body with clickable phrases AND clickable Chinese kanji
  const renderBodyWithClickablePhrases = () => {
    const phrases = email.bodyPhrases || [];
    const bodyKanji = email.chineseAnomalies?.filter(a => a.location === 'BODY') || [];
    const content = sanitizeDisplayText(email.body);

    if (phrases.length === 0 && bodyKanji.length === 0) {
      return (
        <div className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-sm">
          {content}
        </div>
      );
    }

    type SegmentItem = 
      | { type: 'PHRASE'; text: string; data: SuspiciousPhrase; id: string }
      | { type: 'KANJI'; text: string; data: ChineseKanjiAnomaly; id: string };

    const items: SegmentItem[] = [
      ...phrases.filter(p => p.text.length > 0).map(p => ({ type: 'PHRASE' as const, text: p.text, data: p, id: p.id })),
      ...bodyKanji.filter(k => k.injectedText.length > 0).map(k => ({ type: 'KANJI' as const, text: k.injectedText, data: k, id: k.id }))
    ];

    // Find occurrences in content
    interface Occurrence {
      item: SegmentItem;
      start: number;
      end: number;
    }

    const occurrences: Occurrence[] = [];
    items.forEach(item => {
      if (!item.text) return;
      let searchStart = 0;
      while (searchStart < content.length) {
        const idx = content.indexOf(item.text, searchStart);
        if (idx === -1) break;
        occurrences.push({
          item,
          start: idx,
          end: idx + item.text.length
        });
        searchStart = idx + item.text.length;
      }
    });

    // Sort by start position
    occurrences.sort((a, b) => a.start - b.start);

    // Filter out overlapping items (prefer earlier or longer)
    const nonOverlapping: Occurrence[] = [];
    let currentEnd = 0;
    for (const occ of occurrences) {
      if (occ.start >= currentEnd) {
        nonOverlapping.push(occ);
        currentEnd = occ.end;
      }
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    nonOverlapping.forEach((occ, idx) => {
      if (occ.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`} className="whitespace-pre-wrap">
            {content.substring(lastIndex, occ.start)}
          </span>
        );
      }

      if (occ.item.type === 'PHRASE') {
        const phrase = occ.item.data;
        const isInspected = inspectionState.inspectedPhrases.includes(phrase.id);
        parts.push(
          <button
            key={`phrase-${phrase.id}-${idx}`}
            onClick={() => {
              soundManager.playScan();
              onInspectPhrase(phrase);
            }}
            className={`inline-block px-1.5 py-0.5 my-0.5 rounded text-left transition-all cursor-pointer font-sans text-sm ${
              isInspected
                ? 'bg-cyan-950/70 text-cyan-200 border-b-2 border-cyan-400 font-medium'
                : 'bg-slate-800/80 hover:bg-cyan-950/50 hover:text-cyan-200 text-slate-200 border-b border-dashed border-slate-500'
            }`}
            title="クリックして文面・表現の意図を調査"
          >
            {phrase.text}
            <span className="ml-1 text-[10px] text-cyan-400 opacity-60">🔍調査</span>
          </button>
        );
      } else {
        const kanji = occ.item.data;
        const isInspected = inspectionState.inspectedKanji?.includes(kanji.id);
        parts.push(
          <button
            key={`kanji-${kanji.id}-${idx}`}
            onClick={() => {
              soundManager.playScan();
              onInspectKanji(kanji);
            }}
            className={`inline-block px-1.5 py-0.5 my-0.5 rounded text-left transition-all cursor-pointer font-sans text-sm ${
              isInspected
                ? 'bg-rose-950/80 text-rose-300 border-b-2 border-rose-400 font-medium'
                : 'bg-slate-800/90 text-rose-200 hover:bg-rose-950/60 hover:text-rose-100 border-b border-dashed border-rose-500/70'
            }`}
            title="クリックして簡体字・表記異常を調査"
          >
            {kanji.injectedText}
            <span className="ml-1 text-[10px] font-mono text-rose-400 opacity-80">🔍簡体字</span>
          </button>
        );
      }

      lastIndex = occ.end;
    });

    if (lastIndex < content.length) {
      parts.push(
        <span key="text-end" className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return <div className="leading-relaxed text-sm">{parts}</div>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/60 overflow-hidden">
      {/* Top Banner Guide */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">
            各項目をクリックして調査ツールで証拠を収集してください（未確定のまま判定しないこと）
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('BODY');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'BODY'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800'
            }`}
          >
            メール本文
          </button>
          <button
            onClick={() => {
              soundManager.playScan();
              setActiveTab('HEADERS');
              onInspectHeaders();
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'HEADERS'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            ヘッダー・SPF/DKIM
            {inspectionState.inspectedHeaders && (
              <CheckCircle2 className="w-3 h-3 text-cyan-300" />
            )}
          </button>
        </div>
      </div>

      {/* Main Mail Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Enterprise Security Gateway Warning Banner */}
        {email.senderDomain.toLowerCase().endsWith('company.co.jp') ? (
          <div className="bg-slate-900 border border-slate-700/60 px-3.5 py-2 rounded-lg flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <strong className="text-cyan-400 font-bold">[社内ドメイン]</strong>
              <span>フロンティア社内Exchange認証ネットワークからの正規通信</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">ORG: INTERNAL_DOMAIN</span>
          </div>
        ) : (
          <div className="bg-amber-950/40 border border-amber-600/40 px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="font-bold text-amber-300 mr-1">[外部受信メール]</strong>
                このメールは組織外のサーバー（@{email.senderDomain}）から送信されています。記載のURLや添付ファイルには十分ご注意ください。
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400/80 shrink-0 hidden md:inline ml-2">GATEWAY WARNING</span>
          </div>
        )}

        {/* Subject Header */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {renderSubject()}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              {email.chineseAnomalies && email.chineseAnomalies.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/80 text-[10px] font-mono" title="このメールの件名または本文から非標準の簡体字が検出されました">
                  <Languages className="w-3 h-3 text-rose-400" />
                  簡体字混入
                </span>
              )}
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {email.receivedAt}
              </span>
            </div>
          </div>

          {/* Interactive Sender & Recipient Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            {/* Sender block (Clickable to inspect address & domain) */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 flex flex-col gap-1.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  差出人 (From)
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {inspectionState.inspectedSender ? '✓ 調査済' : 'クリックで調査'}
                </span>
              </div>

              {/* Clickable Sender Box */}
              <button
                onClick={() => {
                  soundManager.playScan();
                  onInspectSender();
                }}
                className={`text-left p-2 rounded transition-all group flex items-start justify-between gap-2 ${
                  inspectionState.inspectedSender
                    ? 'bg-slate-900 border border-cyan-500/50 shadow-inner'
                    : 'bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/30'
                }`}
                title="送信者アドレスと表示名の相違を調査"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-100 truncate flex items-center gap-1.5">
                    {email.senderDisplayName}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 truncate">
                    &lt;{email.senderEmail}&gt;
                  </div>
                </div>
                <Search className="w-4 h-4 text-cyan-400 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity mt-0.5" />
              </button>

              {/* Clickable Domain Box */}
              <button
                onClick={() => {
                  soundManager.playScan();
                  onInspectDomain();
                }}
                className={`text-left px-2 py-1.5 rounded transition-all flex items-center justify-between text-[11px] ${
                  inspectionState.inspectedDomain
                    ? 'bg-slate-900 border border-cyan-500/50'
                    : 'bg-slate-900/40 hover:bg-slate-800 border border-slate-800/60'
                }`}
                title="送信元ドメインのWHOISおよび類似性を調査"
              >
                <span className="font-mono text-slate-300 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  ドメイン: <span className="text-cyan-300 font-bold">{email.senderDomain}</span>
                </span>
                <span className="text-[10px] text-cyan-400">
                  {inspectionState.inspectedDomain ? '✓ WHOIS照合済' : 'ドメイン照合'}
                </span>
              </button>
            </div>

            {/* Recipient & Security Info */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium mb-1">
                  宛先 (To):
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800/60 text-[11px] truncate">
                  {email.recipient}
                </div>
              </div>

              {/* Quick Auth badges */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">簡易認証状態:</span>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    email.headers.spf.status === 'PASS' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    SPF: {email.headers.spf.status}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    email.headers.dkim.status === 'PASS' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    DKIM: {email.headers.dkim.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Body Mode */}
        {activeTab === 'BODY' && (
          <div className="space-y-4">
            {/* Email Body Card */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
              <div className="text-[11px] font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>本文テキスト（不審な文言をクリックして解析可能）</span>
                <span className="text-slate-500">PLAIN/HTML TEXT</span>
              </div>

              {/* Interactive body */}
              {renderBodyWithClickablePhrases()}
            </div>

            {/* URLs Section (if any) */}
            {email.urls && email.urls.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span>含まれるハイパーリンク ({email.urls.length}件)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ※安全のため直接接続せずサンドボックスで検査します
                  </span>
                </div>

                <div className="space-y-2">
                  {email.urls.map((u, idx) => {
                    const isInspected = inspectionState.inspectedUrls.includes(u.targetUrl);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                          isInspected
                            ? 'bg-slate-950 border-cyan-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-cyan-400 font-mono truncate underline">
                            {u.displayText}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            接続先ホスト: <span className="text-slate-300 font-bold">{u.domain}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            soundManager.playScan();
                            onInspectUrl(u);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                            isInspected
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5" />
                          {isInspected ? '再検査 / 結果表示' : 'リンクを安全に解析'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attachments Section (if any) */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Paperclip className="w-4 h-4 text-amber-400" />
                    <span>添付ファイル ({email.attachments.length}件)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ※サンドボックス隔離静的解析を実行可能
                  </span>
                </div>

                <div className="space-y-2">
                  {email.attachments.map((att, idx) => {
                    const isInspected = inspectionState.inspectedAttachments.includes(att.fileName);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                          isInspected
                            ? 'bg-slate-950 border-cyan-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded bg-slate-800 text-slate-300">
                            <FileText className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-200 font-mono truncate">
                              {att.fileName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              サイズ: {att.fileSize} | 形式: {att.fileType}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            soundManager.playScan();
                            onInspectAttachment(att);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                            isInspected
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5" />
                          {isInspected ? '解析結果を確認' : '検疫サンドボックス解析'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Email Headers Mode */}
        {activeTab === 'HEADERS' && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Raw RFC 5322 Email Headers & Routing Info
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">Verified in Inspector</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Return-Path:</span>
                <span className="text-slate-200">{email.headers.returnPath}</span>
              </div>

              {email.headers.replyTo && (
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Reply-To:</span>
                  <span className="text-amber-400 font-bold">{email.headers.replyTo}</span>
                </div>
              )}

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Message-ID:</span>
                <span className="text-slate-300 break-all">{email.headers.messageId}</span>
              </div>

              {/* Authentication Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SPF Authentication:</span>
                  <span className={`font-bold ${email.headers.spf.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {email.headers.spf.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{email.headers.spf.details}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DKIM Signature:</span>
                  <span className={`font-bold ${email.headers.dkim.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {email.headers.dkim.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{email.headers.dkim.details}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DMARC Policy:</span>
                  <span className={`font-bold ${email.headers.dmarc.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {email.headers.dmarc.status} ({email.headers.dmarc.policy})
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{email.headers.dmarc.details}</p>
                </div>
              </div>

              {/* Received Hops */}
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px] mb-1">Received Relay Trace:</span>
                {email.headers.hops.map((hop, i) => (
                  <div key={i} className="text-[11px] text-slate-400 flex items-center justify-between py-0.5">
                    <span>hop #{i+1}: {hop.from} ➔ {hop.by}</span>
                    <span className="text-slate-500 text-[10px]">{hop.country} ({hop.timestamp})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
