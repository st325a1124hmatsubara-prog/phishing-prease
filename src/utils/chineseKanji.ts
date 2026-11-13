import { EmailItem, Difficulty, ChineseKanjiAnomaly } from '../types/game';

export interface KanjiGlitchRule {
  jp: string;
  zh: string;
  subtlety: 'OBVIOUS' | 'MODERATE' | 'SUBTLE';
  charExplanation: string;
  securityReason: string;
  unicodeHex: string;
  jpUnicodeHex: string;
}

export const KANJI_GLITCH_DICTIONARY: KanjiGlitchRule[] = [
  // 1. 認証 → 认证 (Prominent / Obvious)
  {
    jp: '認証',
    zh: '认证',
    subtlety: 'OBVIOUS',
    charExplanation: '「认证」は中国語簡体字（zh-Hans）特有の表記です。言偏（ごんべん）が簡略化された「讠」になり、「証」の字形も「证」に置き換わっています。日本のJIS常用漢字「認証」とは字形が完全に異なります。',
    securityReason: '海外の攻撃組織がフィッシング用ログイン誘導メールを作成する際、中国語OS環境の文字セットや入力ソフトで生成された文字がそのまま残存した典型的なフィッシングサインです。',
    unicodeHex: 'U+8BA4 U+8BC1',
    jpUnicodeHex: 'U+8A8D U+8A3C'
  },
  // 2. 確認 → 确认 (Obvious / Moderate)
  {
    jp: '確認',
    zh: '确认',
    subtlety: 'MODERATE',
    charExplanation: '「确认」の「认」は「認」の中国語簡体字です。言偏が「讠」に略されており、日本の常用漢字「確認」とは明確に異なります。',
    securityReason: '「アカウント確認のお願い」などの件名や本文で頻出するミスです。正規の日本国内サービスや金融機関が公式メールで「确认」と誤用することは一切ありません。',
    unicodeHex: 'U+786E U+8BA4',
    jpUnicodeHex: 'U+78BA U+8A8D'
  },
  // 3. 銀行 → 银行 (Obvious)
  {
    jp: '銀行',
    zh: '银行',
    subtlety: 'OBVIOUS',
    charExplanation: '「银行」の「银」は金偏（かねへん）が中国語簡体字特有の「钅」に簡略化された字体です。日本の漢字「銀行」とは明確に区別されます。',
    securityReason: '金融機関を騙るフィッシングメールにおいて、攻撃者が中国語ベースのフィッシングキットを転用した際に混入する代表的な兆候です。',
    unicodeHex: 'U+94F6 U+884C',
    jpUnicodeHex: 'U+9280 U+884C'
  },
  // 4. 情報 → 信息 (Obvious lexical difference)
  {
    jp: '情報',
    zh: '信息',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語では「情報（Information）」を「信息」と表記します。単なる字体の違いにとどまらず、語彙自体が中国語特有の単語に置き換わっています。',
    securityReason: '海外の犯罪グループが機械翻訳や自国の用語をそのまま流用した際に見られる典型的な不自然な日本語表記です。日本の正規企業が公式案内で「お客様の個人信息」等と表記することはありません。',
    unicodeHex: 'U+4FE1 U+606F',
    jpUnicodeHex: 'U+60C5 U+5831'
  },
  // 5. 無効 → 无效 (Obvious / Moderate)
  {
    jp: '無効',
    zh: '无效',
    subtlety: 'OBVIOUS',
    charExplanation: '「无效」の「无」および「效」は中国語簡体字です。日本の「無」のれっか（灬）がなくなり「无」となり、「効」のつくりの「力」が「攵」系統の簡体「效」となっています。',
    securityReason: '「パスワードが無効になりました」「カードが無効化されます」といった不安を煽るフィッシング文面で出現する重大な手掛かりです。',
    unicodeHex: 'U+65E0 U+6548',
    jpUnicodeHex: 'U+7121 U+52B9'
  },
  // 6. 発送 → 发货 (Obvious lexical & glyph difference)
  {
    jp: '発送',
    zh: '发货',
    subtlety: 'OBVIOUS',
    charExplanation: '「发货」は中国語で商品の出荷・発送を意味する語彙であり、「発」の簡体字「发」が使われています。日本語の「発送」とは字形も語彙も異なります。',
    securityReason: 'ECサイトや配送業者（佐川急便・ヤマト・Amazon等）を装う配達通知フィッシングで、海外詐欺グループがテンプレートを流用した際に漏れ出る特徴です。',
    unicodeHex: 'U+53D1 U+8D27',
    jpUnicodeHex: 'U+767A U+9001'
  },
  // 7. 関連 → 关联 (Subtle / Moderate)
  {
    jp: '関連',
    zh: '关联',
    subtlety: 'SUBTLE',
    charExplanation: '「关联」の「关」は「関」の門構えを完全に省略した中国語簡体字（门も省略）であり、「联」は「聯/連」の簡体表記です。パッと見で「美」や「送」に見誤りやすいですが、日本の常用漢字には存在しない字体です。',
    securityReason: '「規約に関連するご案内」や「関連口座の保護」などの自然な日本語文章の中に1語だけ紛れ込む、見落としやすい攻撃者の残留サインです。',
    unicodeHex: 'U+5173 U+8054',
    jpUnicodeHex: 'U+95A2 U+9023'
  },
  // 8. 登録 → 注册 (Obvious lexical)
  {
    jp: '登録',
    zh: '注册',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語でユーザー登録・サインアップを意味する「注册（zhu ce）」の表記です。「注」は同じですが「册」は「冊」の簡体字であり、日本語の「登録」とは完全に異なる中国語固有の表現です。',
    securityReason: '「会員登録の更新」などを装うフィッシングメールで海外製ボットや攻撃ツールが直訳に失敗した痕跡です。',
    unicodeHex: 'U+6CE8 U+518C',
    jpUnicodeHex: 'U+767B U+9332'
  },
  // 9. 国際 → 国际 (Moderate)
  {
    jp: '国際',
    zh: '国际',
    subtlety: 'MODERATE',
    charExplanation: '「国际」の「国」は「国」の簡体字、「际」は「際」のこざとへん（阝）＋「示」に簡略化された簡体字です。日本の漢字「国際」とは旁（つくり）が異なります。',
    securityReason: '海外送金や国際郵便、セキュリティ警告の権威づけのために「国际セキュリティ基準」などと記載される不審点です。',
    unicodeHex: 'U+56FD U+9645',
    jpUnicodeHex: 'U+56FD U+969B'
  },
  // 10. 支払 → 支付 (Obvious lexical / glyph)
  {
    jp: '支払',
    zh: '支付',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語で決済・支払いを表す「支付（zhifu）」という単語です。日本語の送り仮名「支払い」や「お支払い」ではなく、「支付」と漢語のまま配置されています。',
    securityReason: 'Alipay（支付宝）をはじめとする中国語圏決済システムの用語がそのまま日本向けフィッシング詐欺メールに混入した決定的な証拠です。',
    unicodeHex: 'U+652F U+4ED8',
    jpUnicodeHex: 'U+652F U+6255'
  },
  // 11. 会社 → 公司 (Obvious lexical)
  {
    jp: '会社',
    zh: '公司',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語で企業・法人を指す「公司（gongsi）」の表記です。日本語の「株式会社」「貴社」「弊社」ではなく「本公司」「公司の指示」などと誤用されます。',
    securityReason: '海外詐欺グループのビジネスメール詐欺（BEC）や偽請求書で、日本の商習慣（株式会社）を知らない攻撃者が誤用する顕著な手掛かりです。',
    unicodeHex: 'U+516C U+53F8',
    jpUnicodeHex: 'U+4F1A U+793E'
  },
  // 12. アカウント / 口座 → 账户 (Moderate / Subtle)
  {
    jp: 'アカウント',
    zh: '账户',
    subtlety: 'MODERATE',
    charExplanation: '「账户（zhànghù）」は中国語でアカウントまたは銀行口座を指す標準単語です。「账」は「帳」の簡体字、「户」は「戸」の異体・簡体字です。カタカナの「アカウント」ではなく漢字で「账户」と書かれています。',
    securityReason: '「お客様の账户が一時凍結されました」のように、日本のサービスでは絶対に使われない中国語のアカウント呼称が混入する典型例です。',
    unicodeHex: 'U+8D26 U+6237',
    jpUnicodeHex: 'U+30A2 U+30AB'
  },
  // 13. 口座 → 账户 (Moderate)
  {
    jp: '口座',
    zh: '账户',
    subtlety: 'MODERATE',
    charExplanation: '「账户」の「账」は「帳」の簡体字、「户」は「戸」の簡体字で、中国語で銀行口座やアカウントを意味します。日本の銀行が「お客様の口座」を「账户」と表記することは絶対にありません。',
    securityReason: '金融機関フィッシングで口座番号や指定振込先を指定する際、海外テンプレートの用語がそのまま露出した兆候です。',
    unicodeHex: 'U+8D26 U+6237',
    jpUnicodeHex: 'U+53E3 U+5EA7'
  },
  // 14. 設定 → 设置 (Subtle / Moderate)
  {
    jp: '設定',
    zh: '设置',
    subtlety: 'SUBTLE',
    charExplanation: '「设置」の「设」は「設」の言偏が簡体「讠」になった文字、「置」は共通ですが、単語として中国語の「設置/設定（Settings）」を意味します。日本語の文章中では「設定」と書くべき文脈で「设置」と表示されます。',
    securityReason: 'セキュリティ設定や多要素認証の設定変更を促す偽メールで、一見すると漢字が並んでいて見過ごしやすいですが、JIS規格外の簡体字「设」が含まれる重大な不審点です。',
    unicodeHex: 'U+8BBE U+7F6E',
    jpUnicodeHex: 'U+8A2D U+5B9A'
  },
  // 15. 処理 → 处理 (Subtle)
  {
    jp: '処理',
    zh: '处理',
    subtlety: 'SUBTLE',
    charExplanation: '「处理」の「处」は「処」の中国語簡体字です。日本語常用漢字の「処」は「几」の中に「夂」が入りますが、簡体字「处」は「夂」に「卜」が合わさった略体です。極めて小さく見落としやすい文字です。',
    securityReason: '「決済の処理が中断されました」「至急処理をお願いします」という文面で、注意深く文字の形を見ないと通過してしまいがちな巧妙な混入例です。',
    unicodeHex: 'U+5904 U+7406',
    jpUnicodeHex: 'U+51E6 U+7406'
  },
  // 16. 点検 / 検査 → 检查 (Subtle)
  {
    jp: '点検',
    zh: '点检',
    subtlety: 'SUBTLE',
    charExplanation: '「点检」の「检」は「検」の中国語簡体字です。木偏の右側「僉」が「佥」に簡略化されています。日本の新字体「検」とも旧字体「檢」とも異なる中国固有のグリフです。',
    securityReason: '「定期セキュリティ点検」を騙るフィッシングメールで、日本の文字セットには含まれない簡体字グリフ「检」がフォントによって表示される不審兆候です。',
    unicodeHex: 'U+70B9 U+68C0',
    jpUnicodeHex: 'U+70B9 U+691C'
  },
  // 17. 顧客 → 客户 (Obvious lexical)
  {
    jp: 'お客様',
    zh: '客户',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語でクライアント・顧客・利用者を指す単語「客户（kehu）」です。日本語ビジネスメールの「お客様各位」「会員の皆様」に対して、唐突に「尊敬する客户」などと現れます。',
    securityReason: '日本の敬語・ビジネスメール文化に不慣れな海外フィッシング犯が自国語の「客户」をそのまま差し込んで作成した典型的なスパム・フィッシングの特徴です。',
    unicodeHex: 'U+5BA2 U+6237',
    jpUnicodeHex: 'U+304A U+5BA2'
  },
  // 18. 電話 → 电话 (Moderate)
  {
    jp: '電話',
    zh: '电话',
    subtlety: 'MODERATE',
    charExplanation: '「电话」の「话」は「話」の中国語簡体字です。言偏が「讠」に置き換わっており、日本の常用漢字「電話」とは字形が異なります。',
    securityReason: '偽のサポート窓口や問い合わせ先電話番号を記載する際、攻撃者の端末フォント設定のまま入力された痕跡です。',
    unicodeHex: 'U+7535 U+8BDD',
    jpUnicodeHex: 'U+96FB U+8A71'
  },
  // 19. ログイン → 登录 (Obvious lexical / glyph)
  {
    jp: 'ログイン',
    zh: '登录',
    subtlety: 'OBVIOUS',
    charExplanation: '中国語でログイン・サインインを意味する「登录（denglu）」です。「登」は共通ですが「录」は「録」の金偏を排した簡体字です。カタカナで「ログイン」と書くべき箇所に「登录」と漢字表記されます。',
    securityReason: '偽ログインページへの誘導ボタンやリンクテキストに「今すぐ登录」と書かれるなど、海外発信のフィッシングサイト誘導メールで頻出します。',
    unicodeHex: 'U+767B U+5F55',
    jpUnicodeHex: 'U+30ED U+30B0'
  },
  // 20. 異常 → 异常 (Subtle / Moderate)
  {
    jp: '異常',
    zh: '异常',
    subtlety: 'SUBTLE',
    charExplanation: '「异常」の「异」は「異」の中国語簡体字です。「異」の田と共が簡略化され「巳」の下に「廾」の形になっています。日本の漢字「異常」とは明らかに上部と下部の構造が異なります。',
    securityReason: '「異常なログインを検知しました」というセキュリティ警告詐欺で出現しやすい、非常に重要な検知ポイントです。',
    unicodeHex: 'U+5F02 U+5E38',
    jpUnicodeHex: 'U+7570 U+5E38'
  }
];

/**
 * Injects Chinese Simplified / Non-standard Kanji into a phishing email based on difficulty.
 * If email is legitimate (isThreat === false), returns the unmodified email (ensuring natural Japanese).
 * For phishing emails, injects 0 to 5 anomalies with difficulty-tuned subtlety and counts.
 */
export function applyChineseKanjiInjection(email: EmailItem, difficulty: Difficulty): EmailItem {
  // RULE: Legitimate emails must ALWAYS remain natural standard Japanese.
  if (!email.isThreat) {
    return {
      ...email,
      chineseAnomalies: []
    };
  }

  // RULE: Do not inject into ALL phishing emails (random natural distribution).
  // Some threats (e.g. domestic spear-phishing or CEO gift card fraud) should have 0 kanji glitches
  // to teach users that "clean Japanese does not automatically mean safe".
  const deterministicSeed = email.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shouldSkipInjection = (deterministicSeed % 10) < 3; // ~30% clean Japanese phishing
  if (shouldSkipInjection) {
    return {
      ...email,
      chineseAnomalies: []
    };
  }

  // Determine target count & subtlety based on difficulty:
  // - EASY: Clearly obvious simplified characters (3 to 5 places)
  // - NORMAL: Moderate simplified characters (1 to 2 places)
  // - HARD: Subtle, easy-to-overlook single glyphs (0 to 1 place)
  let targetCount = 2;
  let allowedSubtleties: ('OBVIOUS' | 'MODERATE' | 'SUBTLE')[] = ['OBVIOUS', 'MODERATE'];

  if (difficulty === 'EASY') {
    targetCount = Math.floor(Math.random() * 3) + 3; // 3 to 5
    allowedSubtleties = ['OBVIOUS', 'MODERATE'];
  } else if (difficulty === 'NORMAL') {
    targetCount = Math.floor(Math.random() * 2) + 1; // 1 to 2
    allowedSubtleties = ['MODERATE', 'SUBTLE', 'OBVIOUS'];
  } else if (difficulty === 'HARD') {
    targetCount = Math.random() > 0.35 ? 1 : 0; // 0 or 1
    allowedSubtleties = ['SUBTLE', 'MODERATE'];
  }

  if (targetCount === 0) {
    return {
      ...email,
      chineseAnomalies: []
    };
  }

  // Filter dictionary to applicable subtleties
  const filteredDict = KANJI_GLITCH_DICTIONARY.filter(rule => 
    allowedSubtleties.includes(rule.subtlety)
  );

  // Shuffle dictionary for variety ("毎回同じ漢字や組み合わせを使用しない")
  const shuffledDict = [...filteredDict].sort(() => Math.random() - 0.5);

  let newSubject = email.subject;
  let newBody = email.body;
  const anomalies: ChineseKanjiAnomaly[] = [];

  for (const rule of shuffledDict) {
    if (anomalies.length >= targetCount) break;

    let injectedInThisRule = false;

    // Check subject first
    if (newSubject.includes(rule.jp) && !newSubject.includes(rule.zh)) {
      newSubject = newSubject.replace(rule.jp, rule.zh);
      anomalies.push({
        id: `kanji-${email.id}-subj-${anomalies.length + 1}`,
        injectedText: rule.zh,
        originalJpText: rule.jp,
        location: 'SUBJECT',
        subtlety: rule.subtlety,
        charExplanation: rule.charExplanation,
        securityReason: rule.securityReason,
        unicodeHex: rule.unicodeHex,
        jpUnicodeHex: rule.jpUnicodeHex
      });
      injectedInThisRule = true;
    }

    if (anomalies.length >= targetCount) break;

    // Check body
    if (newBody.includes(rule.jp) && !newBody.includes(rule.zh)) {
      // Replace only first occurrence of this word to keep it believable
      newBody = newBody.replace(rule.jp, rule.zh);
      anomalies.push({
        id: `kanji-${email.id}-body-${anomalies.length + 1}`,
        injectedText: rule.zh,
        originalJpText: rule.jp,
        location: 'BODY',
        subtlety: rule.subtlety,
        charExplanation: rule.charExplanation,
        securityReason: rule.securityReason,
        unicodeHex: rule.unicodeHex,
        jpUnicodeHex: rule.jpUnicodeHex
      });
      injectedInThisRule = true;
    }
  }

  return {
    ...email,
    subject: newSubject,
    body: newBody,
    chineseAnomalies: anomalies
  };
}
