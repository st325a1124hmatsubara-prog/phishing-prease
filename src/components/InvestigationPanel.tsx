import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Link2, 
  Paperclip, 
  UserCheck, 
  FileCode, 
  MessageSquareWarning,
  Info,
  Languages,
  Sparkles
} from 'lucide-react';
import { 
  EmailItem, 
  EmailInspectionState, 
  UrlDetails, 
  AttachmentDetails, 
  SuspiciousPhrase, 
  ChineseKanjiAnomaly,
  Verdict, 
  EmailAuditRecord,
  Difficulty
} from '../types/game';
import { soundManager } from '../utils/audio';

export type ActiveInspection = 
  | { type: 'SENDER' }
  | { type: 'DOMAIN' }
  | { type: 'URL'; data: UrlDetails }
  | { type: 'ATTACHMENT'; data: AttachmentDetails }
  | { type: 'HEADERS' }
  | { type: 'PHRASE'; data: SuspiciousPhrase }
  | { type: 'CHINESE_KANJI'; data: ChineseKanjiAnomaly }
  | null;

interface InvestigationPanelProps {
  email: EmailItem;
  activeInspection: ActiveInspection;
  inspectionState: EmailInspectionState;
  difficulty: Difficulty;
  onMakeVerdict: (verdict: Verdict) => void;
  auditRecord?: EmailAuditRecord;
  onShowVerdictDetails?: () => void;
}

export const InvestigationPanel: React.FC<InvestigationPanelProps> = ({
  email,
  activeInspection,
  inspectionState,
  difficulty,
  onMakeVerdict,
  auditRecord,
  onShowVerdictDetails
}) => {
  const isReviewed = !!auditRecord;
  const isHard = difficulty === 'HARD';
  const isNormal = difficulty === 'NORMAL';

  // Calculate total findings / investigated items count
  const inspectedCount = 
    (inspectionState.inspectedSender ? 1 : 0) +
    (inspectionState.inspectedDomain ? 1 : 0) +
    inspectionState.inspectedUrls.length +
    inspectionState.inspectedAttachments.length +
    (inspectionState.inspectedHeaders ? 1 : 0) +
    inspectionState.inspectedPhrases.length +
    (inspectionState.inspectedKanji?.length || 0);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
            フォレンジック調査端末 & 判定ステーション
          </h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
          調査済: {inspectedCount}項目
        </span>
      </div>

      {/* Main Inspection Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Inspection Result Card */}
        {activeInspection ? (
          <div className="space-y-3">
            {/* SENDER INSPECTION */}
            {activeInspection.type === 'SENDER' && (
              <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    送信元アドレス整合性 解析結果
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ADDR_INSPECT</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">表示名 (Display Name):</span>
                    <span className="text-slate-200 font-semibold">{email.senderDisplayName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">実送信アドレス (Envelope From):</span>
                    <span className="text-cyan-300 font-mono font-semibold">{email.senderEmail}</span>
                  </div>

                  {/* Official domain comparison */}
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">正規公式ドメイン（比較基準）:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {email.officialDomain ? `@${email.officialDomain}` : '社内・個別取引先'}
                    </span>
                  </div>

                  {/* Analysis Notes: On Hard, hide spoilers and prompt player discernment */}
                  {isHard ? (
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold block mb-0.5">【HARDモード: 自律審査】</span>
                      表示名と実送信アドレス、正規公式ドメイン（@{email.officialDomain || email.senderDomain}）との文字の整合性を目視およびヘッダーで精査してください。（詳細解説は判定後に開示されます）
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                      <span className="text-slate-400 font-bold block mb-1">差出人整合性チェック:</span>
                      {email.addressAnalysis.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DOMAIN INSPECTION */}
            {activeInspection.type === 'DOMAIN' && (
              <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    送信ドメイン WHOIS & 類似性調査
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">DOMAIN_INTEL</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">受信ドメイン</span>
                      <span className="text-slate-200 font-mono font-bold truncate block">{email.domainAnalysis.domainName}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">正規公式ドメイン</span>
                      <span className="text-emerald-400 font-mono font-bold truncate block">
                        {email.officialDomain || email.domainAnalysis.domainName}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">ドメイン取得時期</span>
                      <span className={`font-mono font-bold block ${email.domainAnalysis.domainAge.includes('日') || email.domainAnalysis.domainAge.includes('昨日') ? 'text-amber-400' : 'text-slate-200'}`}>
                        {email.domainAnalysis.domainAge}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">レジストラ (登録事業者)</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate block">{email.domainAnalysis.registrar}</span>
                    </div>
                  </div>

                  {isHard ? (
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold block mb-0.5">【HARDモード: ドメイン照合】</span>
                      受信ドメインと公式ドメインの1文字違い、サブドメイン構成、取得年数から真正性を判断してください。
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                      <span className="text-slate-400 font-bold block mb-1">類似ドメイン (タイポスクワッティング) 判定:</span>
                      {email.domainAnalysis.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL SANDBOX INSPECTION */}
            {activeInspection.type === 'URL' && (
              <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <Link2 className="w-4 h-4" />
                    URLサンドボックス脅威スキャン
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">SANDBOX_URL</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">本文表示テキスト:</span>
                    <span className="text-slate-300 font-mono break-all block">{activeInspection.data.displayText}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">実際のリンク先URL (href):</span>
                    <span className="text-cyan-300 font-mono break-all font-semibold block">{activeInspection.data.targetUrl}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">SSL証明書発行機関</span>
                      <span className="text-slate-300 text-[11px] truncate block">{activeInspection.data.sslCert.issuer}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">ドメイン登録経過日数</span>
                      <span className={`text-[11px] font-bold block ${activeInspection.data.whoisAgeDays < 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {activeInspection.data.whoisAgeDays} 日前
                      </span>
                    </div>
                  </div>

                  {activeInspection.data.destinationPreview && (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 font-bold block mb-1">ページ解析プレビュー:</span>
                      <span className="text-slate-200">{activeInspection.data.destinationPreview}</span>
                    </div>
                  )}

                  {/* In Hard mode, omit the spoiler text explaining whether it's malicious */}
                  {!isHard && activeInspection.data.suspicionReason && (
                    <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs">
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        脅威シグネチャ検知:
                      </span>
                      {activeInspection.data.suspicionReason}
                    </div>
                  )}
                  {isHard && (
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
                      【HARDモード】表示URLとhref先ドメインの乖離、証明書発行日数を元に判定してください。
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ATTACHMENT INSPECTION */}
            {activeInspection.type === 'ATTACHMENT' && (
              <div className="bg-slate-950 border border-amber-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4" />
                    添付ファイル 静的バイナリ解析
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ATTACH_SANDBOX</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">ファイル名 / サイズ:</span>
                    <span className="text-slate-200 font-mono font-semibold">{activeInspection.data.fileName} ({activeInspection.data.fileSize})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">真のMIMEタイプ</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate block">{activeInspection.data.staticScan.trueMimeType}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">エントロピー (暗号化度)</span>
                      <span className="text-slate-300 font-mono text-[11px] block">{activeInspection.data.staticScan.entropyScore} / 10</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block mb-1">ウイルススキャンエンジン判定:</span>
                    <span className={`font-mono font-bold text-xs ${activeInspection.data.staticScan.antivirusDetection.includes('Clean') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {activeInspection.data.staticScan.antivirusDetection}
                    </span>
                  </div>

                  {!isHard && activeInspection.data.suspicionReason && (
                    <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        悪性挙動・構造異常:
                      </span>
                      {activeInspection.data.suspicionReason}
                    </div>
                  )}
                  {isHard && (
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
                      【HARDモード】二重拡張子やマクロ有無、MIMEヘッダーとの整合性を自己分析してください。
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HEADERS INSPECTION */}
            {activeInspection.type === 'HEADERS' && (
              <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <FileCode className="w-4 h-4" />
                    送信ドメイン認証 (SPF/DKIM/DMARC)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">AUTH_HEADERS</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">SPF (Sender Policy Framework)</span>
                      <span className={`font-mono font-bold ${email.headers.spf.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {email.headers.spf.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{email.headers.spf.details}</p>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">DKIM (電子署名)</span>
                      <span className={`font-mono font-bold ${email.headers.dkim.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {email.headers.dkim.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{email.headers.dkim.details}</p>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">DMARC アライメント</span>
                      <span className={`font-mono font-bold ${email.headers.dmarc.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {email.headers.dmarc.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{email.headers.dmarc.details}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHRASE INSPECTION */}
            {activeInspection.type === 'PHRASE' && (
              <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <MessageSquareWarning className="w-4 h-4" />
                    本文フレーズ言語・心理分析
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">LINGUISTIC</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-sans text-slate-200 italic">
                    "{activeInspection.data.text}"
                  </div>

                  {isHard ? (
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold block mb-0.5">【HARDモード: 言語心理分析】</span>
                      この文章の緊急性・脅迫性・不自然な敬語・金銭または認証情報要求の意図を自らの洞察で判定してください。（詳細所見は判定後に開示されます）
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <span className="text-slate-400 font-bold block mb-1">アナリスト所見:</span>
                      {activeInspection.data.reason}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHINESE KANJI / GLYPH INSPECTION */}
            {activeInspection.type === 'CHINESE_KANJI' && (
              <div className="bg-slate-950 border border-rose-500/50 p-4 rounded-xl shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                    <Languages className="w-4 h-4" />
                    中国語簡体字・異体字 解析結果
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-mono">
                    {activeInspection.data.location === 'SUBJECT' ? '件名内で検知' : '本文内で検知'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Item 1 & 2: 該当する文字・単語 vs 日本語で一般的に使われる表記 */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <div className="border-r border-slate-800/80 pr-2">
                      <span className="text-[10px] text-rose-400 font-medium block">1. 検知された表記（簡体字）</span>
                      <span className="text-base font-bold text-rose-300 font-sans tracking-wide block mt-0.5">
                        {activeInspection.data.injectedText}
                      </span>
                      {activeInspection.data.unicodeHex && (
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Unicode: {activeInspection.data.unicodeHex}
                        </span>
                      )}
                    </div>
                    <div className="pl-1">
                      <span className="text-[10px] text-emerald-400 font-medium block">2. 標準日本語表記</span>
                      <span className="text-base font-bold text-emerald-300 font-sans tracking-wide block mt-0.5">
                        {activeInspection.data.originalJpText}
                      </span>
                      {activeInspection.data.jpUnicodeHex && (
                        <span className="text-[10px] font-mono text-slate-500 block">
                          JIS規格: {activeInspection.data.jpUnicodeHex}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item 3 & 4: 簡体字の説明 & 注意すべき理由 */}
                  {isHard ? (
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] font-mono space-y-1">
                      <span className="text-cyan-400 font-bold block mb-0.5">【HARDモード: 文字コード・字形自律精査】</span>
                      <p>
                        検知された文字「{activeInspection.data.injectedText}」と標準的な日本語漢字「{activeInspection.data.originalJpText}」の偏（へん）や構え、フォントグリフの違いを注意深く観察してください。
                      </p>
                      <p className="text-[10px] text-slate-500">
                        ※詳細な言語学的解説および犯罪組織のツール流用背景は判定確定後に開示されます。
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Item 3: 混入している文字が中国語の簡体字であることの説明 */}
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        <span className="text-slate-400 font-bold block mb-1 text-[11px] flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-cyan-400" />
                          3. 簡体字・表記異常の説明:
                        </span>
                        <p className="leading-relaxed text-[11px]">
                          {activeInspection.data.charExplanation}
                        </p>
                      </div>

                      {/* Item 4: このような表記が含まれている場合に注意すべき理由 */}
                      <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 text-rose-200">
                        <span className="text-rose-400 font-bold block mb-1 text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          4. 攻撃兆候としての注意理由:
                        </span>
                        <p className="leading-relaxed text-[11px]">
                          {activeInspection.data.securityReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Expert SOC Guidance Note */}
                  <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
                    <span>難易度設定: {activeInspection.data.subtlety}</span>
                    <span className="text-cyan-500">※国内金融機関・正規法人は簡体字を使用しません</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Default State */
          <div className="p-5 rounded-xl border border-dashed border-slate-800 text-center space-y-2 text-slate-500 my-auto">
            <Search className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="text-xs font-medium text-slate-400">
              調査対象が選択されていません
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              左画面の差出人、ドメイン、リンク、添付ファイル、本文のフレーズ、または簡体字の混入箇所をクリックすると、ここに詳細なフォレンジック証拠が表示されます。
            </p>
          </div>
        )}

        {/* Investigation Summary Checklist */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-medium pb-1.5 border-b border-slate-800/80">
            <span>現在の証拠収集チェックリスト</span>
            <span className="font-mono text-[10px] text-cyan-400">{inspectedCount} 項目実施</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className={`flex items-center gap-1.5 ${inspectionState.inspectedSender ? 'text-cyan-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>差出人アドレス</span>
            </div>
            <div className={`flex items-center gap-1.5 ${inspectionState.inspectedDomain ? 'text-cyan-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ドメインWHOIS</span>
            </div>
            <div className={`flex items-center gap-1.5 ${inspectionState.inspectedHeaders ? 'text-cyan-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SPF/DKIMヘッダー</span>
            </div>
            <div className={`flex items-center gap-1.5 ${inspectionState.inspectedUrls.length > 0 || email.urls.length === 0 ? 'text-cyan-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>リンク先解析</span>
            </div>
            {email.chineseAnomalies && email.chineseAnomalies.length > 0 && (
              <div className={`flex items-center gap-1.5 col-span-2 ${(inspectionState.inspectedKanji?.length || 0) > 0 ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>簡体字・不自然漢字 ({inspectionState.inspectedKanji?.length || 0} / {email.chineseAnomalies.length} 箇所特定)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STAMP / VERDICT STATION (Papers, Please inspired) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            メール最終審査判定
          </span>
          {isReviewed && (
            <span className="text-[10px] text-cyan-400 font-mono">
              ※本メールは審査確定済みです
            </span>
          )}
        </div>

        {!isReviewed ? (
          <div className="grid grid-cols-2 gap-3">
            {/* SAFE STAMP BUTTON */}
            <button
              onClick={() => {
                soundManager.playStampSafe();
                onMakeVerdict('SAFE');
              }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-3 rounded-xl bg-gradient-to-b from-emerald-950 to-slate-900 border-2 border-emerald-600/80 hover:border-emerald-400 hover:from-emerald-900/90 hover:to-slate-900 active:scale-95 transition-all shadow-lg hover:shadow-emerald-950/50 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                【安全なメール】
              </div>
              <span className="text-[10px] text-emerald-300/70 font-mono mt-0.5 group-hover:text-emerald-200">
                APPROVE DELIVERY
              </span>
            </button>

            {/* THREAT STAMP BUTTON */}
            <button
              onClick={() => {
                soundManager.playStampThreat();
                onMakeVerdict('THREAT');
              }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-3 rounded-xl bg-gradient-to-b from-rose-950 to-slate-900 border-2 border-rose-600/80 hover:border-rose-400 hover:from-rose-900/90 hover:to-slate-900 active:scale-95 transition-all shadow-lg hover:shadow-rose-950/50 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                【危険なメール】
              </div>
              <span className="text-[10px] text-rose-300/70 font-mono mt-0.5 group-hover:text-rose-200">
                QUARANTINE & BLOCK
              </span>
            </button>
          </div>
        ) : (
          /* Stamped Review State */
          <div className="space-y-2">
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              auditRecord.playerVerdict === 'SAFE' 
                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/80 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {auditRecord.playerVerdict === 'SAFE' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                )}
                <div>
                  <div className="text-xs font-black tracking-wider">
                    判定済: {auditRecord.playerVerdict === 'SAFE' ? '【安全なメール（承認）】' : '【危険なメール（隔離）】'}
                  </div>
                  <div className="text-[10px] opacity-80 font-mono">
                    {auditRecord.isCorrect ? '✓ 正解 (適切な審査)' : '✗ 不正解 (判定ミス)'}
                  </div>
                </div>
              </div>

              {onShowVerdictDetails && (
                <button
                  onClick={onShowVerdictDetails}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  解説を表示
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
