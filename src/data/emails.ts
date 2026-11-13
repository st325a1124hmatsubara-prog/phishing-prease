import { EmailItem, Difficulty } from '../types/game';

export const EMAILS_DATABASE: EmailItem[] = [
  // ================= DAY 1: EASY & NORMAL BASICS =================
  {
    id: 'd1-01',
    day: 1,
    difficulty: 'EASY',
    isThreat: true,
    category: 'TYPOSQUATTING',
    categoryTitle: '三井住友カード (Vpass) 不正利用検知フィッシング',
    senderDisplayName: '三井住友カード',
    senderEmail: 'mail@smbc-card.co-jp.xyz',
    senderDomain: 'smbc-card.co-jp.xyz',
    officialDomain: 'smbc-card.co.jp',
    recipient: 'finance-staff@company.co.jp',
    subject: '【重要】三井住友カードご利用確認のお願い（第三者不正利用検知）',
    receivedAt: '2026-10-28 09:14:22',
    body: `いつも三井住友カードをご利用いただき、誠にありがとうございます。

弊社セキュリティシステムによるモニタリングの結果、お客様のクレジットカード（カード番号末尾: ****-****-****-8812）において、通常とは異なる環境（海外IPアドレスからの高額決済試行）が検知されました。

つきましては、カード犯罪防止および会員規約に基づき、カードのご利用を一時的に制限させていただいております。

ご本人様のご利用であることを確認させていただくため、大変お手数ではございますが、以下の公式リンクよりVpassへログインいただき、ご利用確認の手続きを完了してください。

■ ご利用確認・利用制限解除のお手続き
https://www.smbc-card.co.jp/vpass/login-verify.html

※ご回答がない場合、安全のためカードの再発行または全決済機能が停止されます。
※本メールはシステムによる自動送信です。

--------------------------------------------------
三井住友カード株式会社
登録番号：関東財務局長(13)第00149号
日本貸金業協会会員 第005623号
〒135-0061 東京都江東区豊洲2-2-31
--------------------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'カード番号末尾: ****-****-****-8812',
        reason: '実在感を演出するために適当な末尾4桁をマスク表示していますが、実際の社内契約コーポレートカード番号とは一致しません。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'smbc-card.co-jp.xyz',
        reason: '正規ドメインは「smbc-card.co.jp」です。「.co-jp.xyz」というハイフン入りの安価な使い捨てTLDドメインが使用されています。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://www.smbc-card.co.jp/vpass/login-verify.html',
        targetUrl: 'https://www.smbc-card.co-jp.xyz/vpass/security/verify',
        domain: 'smbc-card.co-jp.xyz',
        isMismatch: true,
        isSuspicious: true,
        suspicionReason: '本文の表示文字列は正規の「smbc-card.co.jp」ですが、実際のリンク先は「smbc-card.co-jp.xyz」です。クラシックな表示URL偽装です。',
        destinationPreview: '三井住友カード Vpass偽ログイン画面（ID・パスワード・カード番号・セキュリティコード入力フォーム）',
        sslCert: {
          issuer: "Let's Encrypt Authority X3",
          isValid: true,
          daysOld: 2
        },
        whoisAgeDays: 3
      }
    ],
    attachments: [],
    headers: {
      from: '"三井住友カード" <mail@smbc-card.co-jp.xyz>',
      fromDisplayName: '三井住友カード',
      returnPath: 'bounce@smbc-card.co-jp.xyz',
      replyTo: 'security-notify@proton.me',
      to: 'finance-staff@company.co.jp',
      subject: '【重要】三井住友カードご利用確認のお願い（第三者不正利用検知）',
      date: 'Wed, 28 Oct 2026 09:14:22 +0900',
      messageId: '<smbc-vpass-sec-88120@smbc-card.co-jp.xyz>',
      spf: {
        status: 'PASS',
        clientIp: '185.220.101.45',
        details: '攻撃者の専用サーバーから発信されています。'
      },
      dkim: {
        status: 'NONE',
        domain: '',
        details: '三井住友カード正規のDKIM署名が存在しません。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'DMARCポリシー未設定'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'host.smbc-card.co-jp.xyz', timestamp: '09:14:22', country: 'Lithuania' }
      ]
    },
    domainAnalysis: {
      domainName: 'smbc-card.co-jp.xyz',
      isTyposquat: true,
      officialEquivalent: 'smbc-card.co.jp',
      domainAge: '3日前',
      registrar: 'NameSilo, LLC',
      notes: '三井住友カード公式の「smbc-card.co.jp」に酷似させた「.co-jp.xyz」が3日前に登録されています。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '公式ドメイン(@smbc-card.co.jp)ではなく、偽ドメイン(@smbc-card.co-jp.xyz)から送信されています。'
    },
    explanation: {
      summary: '実社会で最も被害件数が多い「三井住友カード(Vpass)不正利用検知」を騙るフィッシング詐欺です。',
      keyPoints: [
        '表示されているリンクは本物のURLに見せかけていますが、実際の飛び先は「.xyz」の偽サイトです。',
        '差出人ドメインが「smbc-card.co.jp」ではなく「smbc-card.co-jp.xyz」となっています。',
        '「カード機能停止」と恐怖を煽り、VpassのID・PWとクレジットカード番号一式を盗み取る手口です。'
      ],
      threatIndicators: [
        '表示URLと実リンク先URL(href)の完全な不一致',
        '「.co-jp.xyz」という安価な類似ドメインの悪用',
        '三井住友カード公式DKIM署名の欠如',
        '取得後3日の新設ドメイン'
      ],
      safeIndicators: [],
      bestPractice: 'クレジットカード会社から利用制限のメールが届いた場合は、メール内のリンクを絶対にクリックせず、公式アプリまたはブラウザの公式ブックマークからVpassにログインして確認してください。'
    }
  },

  {
    id: 'd1-02',
    day: 1,
    difficulty: 'EASY',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Legitimate Business Mail)',
    senderDisplayName: '総務部 佐藤 健一',
    senderEmail: 'k-sato@company.co.jp',
    senderDomain: 'company.co.jp',
    officialDomain: 'company.co.jp',
    recipient: 'all-tokyo@company.co.jp',
    subject: '【案内】来週火曜日の本社オフィス防災避難訓練について',
    receivedAt: '2026-10-28 10:30:15',
    body: `社員の皆様
お疲れ様です。総務部の佐藤です。

消防法に基づく秋季防災避難訓練を以下の日時にて実施いたします。
当日は非常ベルが鳴動しますが、館内放送の指示に従って速やかに避難階段へ移動してください。

■ 日時：2026年11月4日（火）14:00〜14:40
■ 対象：東京本社オフィス全フロア勤務者
■ 避難場所：ビル第2南側防災広場

訓練計画書の詳細および各フロア誘導担当者一覧は、社内ポータル掲示板（総務連絡 No.2026-104）にてご確認ください。

以上、よろしくお願いいたします。

-----------------------------------------
株式会社フロンティア 総務部 ファシリティ管理課
佐藤 健一 (Kenichi Sato)
Email: k-sato@company.co.jp
内線番号: 3105 / 外線: 03-5555-0199
-----------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '社内ポータル掲示板（総務連絡 No.2026-104）にてご確認ください。',
        reason: '外部URLへのリンクを貼らず、既存の社内掲示板を参照する安全な運用です。',
        isSuspicious: false
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '2026秋季避難訓練実施要綱.pdf',
        fileSize: '420 KB',
        fileType: 'Adobe Acrobat PDF Document',
        isSuspicious: false,
        staticScan: {
          trueMimeType: 'application/pdf',
          hasMacros: false,
          hasHiddenExtension: false,
          entropyScore: 3.2,
          antivirusDetection: 'Clean (脅威は検出されませんでした)'
        }
      }
    ],
    headers: {
      from: '"総務部 佐藤 健一" <k-sato@company.co.jp>',
      fromDisplayName: '総務部 佐藤 健一',
      returnPath: 'k-sato@company.co.jp',
      to: 'all-tokyo@company.co.jp',
      subject: '【案内】来週火曜日の本社オフィス防災避難訓練について',
      date: 'Wed, 28 Oct 2026 10:30:15 +0900',
      messageId: '<msg-7721-company-internal@mail.company.co.jp>',
      spf: {
        status: 'PASS',
        clientIp: '192.168.10.12',
        details: '社内Exchangeサーバーの正当な送信元IPから発信されています。'
      },
      dkim: {
        status: 'PASS',
        domain: 'company.co.jp',
        details: '自社ドメインの正規電子署名が有効です。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'reject',
        details: '自社DMARCポリシーに完全に準拠しています。'
      },
      hops: [
        { by: 'internal-hub.company.co.jp', from: 'desktop-pc-sato.internal', timestamp: '10:30:15', country: 'Japan (Internal)' }
      ]
    },
    domainAnalysis: {
      domainName: 'company.co.jp',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'JPRS (Japan Registry Services)',
      notes: '自社の正規ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: false,
      notes: '社内アドレス帳に登録されている正規の佐藤社員のアドレスです。'
    },
    explanation: {
      summary: '自社総務部から全社員へ向けた正規の防災訓練連絡です。不審な点は一切ありません。',
      keyPoints: [
        '自社の正規ドメイン(company.co.jp)から発信され、SPF/DKIMともにPASS。',
        '添付ファイルは正規のPDF文書で、悪性マクロやスクリプトは含まれていません。',
        '外部への誘導リンクがなく、不自然な文言や要求もありません。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '正規の社内ドメイン・正規アドレス',
        'SPF/DKIM/DMARCがすべて正常にPASS',
        'クリーンな添付PDF（マクロなし・正規MIMEタイプ）',
        '社内掲示板への適切な参照案内'
      ],
      bestPractice: '日常の業務連絡メールです。正しく「安全なメール」として通過させましょう。'
    }
  },

  {
    id: 'd1-03',
    day: 1,
    difficulty: 'EASY',
    isThreat: true,
    category: 'TYPOSQUATTING',
    categoryTitle: 'タイポスクワッティング (類似ドメイン)',
    senderDisplayName: 'アマゾン カスタマーサービス',
    senderEmail: 'account-alert@amaz0n-jp-service.com',
    senderDomain: 'amaz0n-jp-service.com',
    officialDomain: 'amazon.co.jp',
    recipient: 'buyer-dept@company.co.jp',
    subject: '【重要】Amazonアカウントのセキュリティ警告：異常なログインが検出されました',
    receivedAt: '2026-10-28 11:45:00',
    body: `Amazonお客様

平素はAmazon.co.jpをご利用いただき誠にありがとうございます。
お客様のアカウントにおいて、通常とは異なる地域（ロシア・モスクワ）からのログイン試行を検知したため、セキュリティ保護の観点から一時的にアカウントのご利用を制限いたしました。

アカウントの復旧およびクレジットカード情報の再確認を行うには、直ちに下記の公式リンクより認証を完了してください。

認証URL:
https://www.amaz0n-jp-service.com/signin/verify-identity

※本メール受信後24時間以内に認証が行われない場合、アカウントおよび未発送の注文はすべて削除されます。

Amazon Japan合同会社
カスタマーサポートセキュリティチーム`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'Amazonお客様',
        reason: '正規のAmazon通知では、登録している氏名（宛名）が明確に記載されます。「Amazonお客様」という無機質な呼びかけは一斉送信スパムの証拠です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '24時間以内に認証が行われない場合、アカウントおよび未発送の注文はすべて削除されます。',
        reason: 'ユーザーを恐怖でパニックに陥れ、冷静な判断をさせないための古典的フィッシング脅迫手法です。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://www.amaz0n-jp-service.com/signin/verify-identity',
        targetUrl: 'https://www.amaz0n-jp-service.com/signin/verify-identity',
        domain: 'amaz0n-jp-service.com',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: '「amazon」の「o(オー)」が数字の「0(ゼロ)」に置き換わっており、末尾に「-jp-service.com」が付加された悪質なタイポスクワッティングドメインです。',
        destinationPreview: 'Amazonそっくりの偽ログイン画面＋クレジットカード入力フォーム',
        sslCert: {
          issuer: 'cPanel, Inc. Certification Authority',
          isValid: true,
          daysOld: 2
        },
        whoisAgeDays: 4
      }
    ],
    attachments: [],
    headers: {
      from: '"アマゾン カスタマーサービス" <account-alert@amaz0n-jp-service.com>',
      fromDisplayName: 'アマゾン カスタマーサービス',
      returnPath: 'bounce@amaz0n-jp-service.com',
      to: 'buyer-dept@company.co.jp',
      subject: '【重要】Amazonアカウントのセキュリティ警告：異常なログインが検出されました',
      date: 'Wed, 28 Oct 2026 11:45:00 +0900',
      messageId: '<amz-alert-991032@amaz0n-jp-service.com>',
      spf: {
        status: 'PASS',
        clientIp: '194.87.12.98',
        details: '攻撃者が自身で登録したドメイン「amaz0n-jp-service.com」のSPFは自作サーバーでPASSしますが、Amazon公式ドメインではありません。'
      },
      dkim: {
        status: 'PASS',
        domain: 'amaz0n-jp-service.com',
        details: '攻撃者自身のドメインの鍵で署名されています（正規Amazonの署名ではない）。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: '正規AmazonのDMARCポリシーとは無関係です。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'vps98.hosting-russia.net', timestamp: '11:45:00', country: 'Russian Federation' }
      ]
    },
    domainAnalysis: {
      domainName: 'amaz0n-jp-service.com',
      isTyposquat: true,
      officialEquivalent: 'amazon.co.jp',
      domainAge: 'わずか4日前 (新規取得)',
      registrar: 'NameCheap, Inc.',
      notes: '「amazon」の「o」が「0」に偽装されたタイポスクワッティングです。正規ドメイン(amazon.co.jp)と全く異なります。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: 'アマゾン公式は通常「@amazon.co.jp」から配信されます。「amaz0n-jp-service.com」は詐欺師が用意した偽ドメインです。'
    },
    explanation: {
      summary: 'Amazonを装ったタイポスクワッティングによるクレジットカード情報窃取フィッシングです。',
      keyPoints: [
        'ドメインが「amazon」ではなく「amaz0n-jp-service.com」（数字の0が混入）。',
        '宛名が氏名ではなく「Amazonお客様」となっている。',
        'WHOISで調べるとわずか4日前に取得された使い捨てドメインである。'
      ],
      threatIndicators: [
        '「amaz0n」(oがゼロ)のタイポスクワッティング類似ドメイン',
        '4日前に取得されたばかりの使い捨て新興ドメイン',
        '24時間以内の削除を予告する脅迫的な文面',
        '宛名に個人名がない'
      ],
      safeIndicators: [],
      bestPractice: '類似ドメイン攻撃は文字を凝視するかドメイン比較ツールを使わないと見落としがちです。通販サイトの警告はメール内のリンクを押さず、公式アプリの通知欄から確認しましょう。'
    }
  },

  {
    id: 'd1-04',
    day: 1,
    difficulty: 'EASY',
    isThreat: true,
    category: 'DOUBLE_EXTENSION',
    categoryTitle: '二重拡張子マルウェア (Double Extension)',
    senderDisplayName: 'ヤマダ商事 経理部',
    senderEmail: 'keiri@yamada-shoji-group.jp',
    senderDomain: 'yamada-shoji-group.jp',
    officialDomain: 'yamada-shoji.co.jp',
    recipient: 'accounting@company.co.jp',
    subject: '【至急ご確認】10月度ご請求書のお送りにつきまして',
    receivedAt: '2026-10-28 13:10:04',
    body: `株式会社フロンティア
経理部 御中

いつも大変お世話になっております。ヤマダ商事の経理部です。
本日締め日の10月度のお取引分請求書を発行いたしましたので、添付ファイルにてお送りいたします。

お手数ですが内容をご確認の上、今月末までにお振込手続きをお願い申し上げます。

添付ファイル：
・202610_御請求書原本.pdf.exe

何卒よろしくお願い申し上げます。

ヤマダ商事株式会社
経理部 担当：小林
電話: 03-3456-XXXX`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '202610_御請求書原本.pdf.exe',
        reason: 'PDFファイルに見せかけて末尾に「.exe（実行可能ファイル）」が付与された典型的な二重拡張子型マルウェアです。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '202610_御請求書原本.pdf.exe',
        fileSize: '1.8 MB',
        fileType: 'PE32 executable (Windows GUI) Intel 80386',
        isSuspicious: true,
        suspicionReason: 'Windows実行可能ファイル(.exe)です。開くとPCにバックドアが設置され、社内ネットワークが遠隔操作されます。',
        staticScan: {
          trueMimeType: 'application/x-msdownload',
          hasMacros: false,
          hasHiddenExtension: true,
          entropyScore: 7.9,
          antivirusDetection: 'Trojan.Win32.AgentTesla (情報窃取トロイの木馬)'
        }
      }
    ],
    headers: {
      from: '"ヤマダ商事 経理部" <keiri@yamada-shoji-group.jp>',
      fromDisplayName: 'ヤマダ商事 経理部',
      returnPath: 'bounces@yamada-shoji-group.jp',
      to: 'accounting@company.co.jp',
      subject: '【至急ご確認】10月度ご請求書のお送りにつきまして',
      date: 'Wed, 28 Oct 2026 13:10:04 +0900',
      messageId: '<inv-98212-yamada@yamada-shoji-group.jp>',
      spf: {
        status: 'PASS',
        clientIp: '103.224.182.11',
        details: '攻撃者の専用サーバーから送信されています。'
      },
      dkim: {
        status: 'NONE',
        domain: '',
        details: '電子署名はありません。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'DMARCレコードが存在しません。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'smtp.yamada-shoji-group.jp', timestamp: '13:10:04', country: 'Singapore' }
      ]
    },
    domainAnalysis: {
      domainName: 'yamada-shoji-group.jp',
      isTyposquat: true,
      officialEquivalent: 'yamada-shoji.co.jp',
      domainAge: '12日前',
      registrar: 'GMO Internet Group, Inc.',
      notes: '取引先「ヤマダ商事」の正規ドメインは「yamada-shoji.co.jp」ですが、「-group.jp」という偽ドメインが12日前に取得されています。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '正規取引先のドメインマスターと一致せず、類似ドメインが使用されています。'
    },
    explanation: {
      summary: '取引先の請求書送付を偽装した、危険な二重拡張子型トロイの木馬マルウェアです。',
      keyPoints: [
        'ファイル名が「.pdf.exe」となっており、実体はPDFではなくWindows実行可能ファイル。',
        'アンチウイルススキャンで「Trojan.Win32.AgentTesla」を検出。',
        '取引先ドメインに酷似させた「yamada-shoji-group.jp」を新規取得して送信。'
      ],
      threatIndicators: [
        '二重拡張子 (.pdf.exe)',
        '危険なMIMEタイプ (application/x-msdownload)',
        'アンチウイルスエンジンによる既知トロイの木馬検出',
        '取引先名の類似ドメイン'
      ],
      safeIndicators: [],
      bestPractice: '請求書が「.exe」や「.scr」などの実行形式で送られてくることは絶対にありません。拡張子を確認し、即座に隔離・破棄する必要があります。'
    }
  },

  {
    id: 'd1-05',
    day: 1,
    difficulty: 'EASY',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Service Notification)',
    senderDisplayName: 'Slack Technologies',
    senderEmail: 'notifications@slack.com',
    senderDomain: 'slack.com',
    officialDomain: 'slack.com',
    recipient: 'dev-team@company.co.jp',
    subject: '田中 太郎 さんがワークスペース #project-alpha に参加しました',
    receivedAt: '2026-10-28 14:22:10',
    body: `Slackワークスペースからの通知です。

田中 太郎 (t-tanaka@company.co.jp) さんがパブリックチャンネル #project-alpha に参加しました。

ワークスペース名: Frontier Corp Workspace
チームメンバー数: 148名

Slackを開く:
https://slack.com/app_redirect?channel=C048281AB

このメールは通知設定に基づき自動送信されています。
通知設定の変更はSlackアプリのアカウント設定から行えます。

Slack Technologies, LLC
500 Howard Street, San Francisco, CA 94105`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '田中 太郎 (t-tanaka@company.co.jp) さんがパブリックチャンネル #project-alpha に参加しました。',
        reason: '社内実在社員の所属チャンネル参加に関する通常の自動通知です。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://slack.com/app_redirect?channel=C048281AB',
        targetUrl: 'https://slack.com/app_redirect?channel=C048281AB',
        domain: 'slack.com',
        isMismatch: false,
        isSuspicious: false,
        suspicionReason: undefined,
        destinationPreview: 'Slack公式デスクトップアプリ起動・チャンネル遷移',
        sslCert: {
          issuer: 'DigiCert Global Root G2',
          isValid: true,
          daysOld: 580
        },
        whoisAgeDays: 5200
      }
    ],
    attachments: [],
    headers: {
      from: '"Slack Technologies" <notifications@slack.com>',
      fromDisplayName: 'Slack Technologies',
      returnPath: 'bounces+9981-slack@notifications.slack.com',
      to: 'dev-team@company.co.jp',
      subject: '田中 太郎 さんがワークスペース #project-alpha に参加しました',
      date: 'Wed, 28 Oct 2026 14:22:10 +0900',
      messageId: '<slack-auto-notif-998822@mail.slack.com>',
      spf: {
        status: 'PASS',
        clientIp: '54.240.11.23',
        details: 'Slack公式のAmazon SES送信IPから配信されPASSしています。'
      },
      dkim: {
        status: 'PASS',
        domain: 'slack.com',
        details: 'Slack公式の暗号署名が検証されました。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'reject',
        details: 'SlackのDMARCポリシー(p=reject)に完全一致しています。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'a11-23.smtp-out.amazonses.com', timestamp: '14:22:10', country: 'United States' }
      ]
    },
    domainAnalysis: {
      domainName: 'slack.com',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'MarkMonitor Inc.',
      notes: 'Slack Technologiesの正規ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: false,
      notes: '正規のSlack通知送信用メールアドレスです。'
    },
    explanation: {
      summary: 'Slack公式ワークスペースからの正規のチャンネル参加通知です。',
      keyPoints: [
        '送信元ドメインが正当な「slack.com」であり、SPF/DKIM/DMARCがすべてPASS。',
        'リンク先も正規の「slack.com」アプリリダイレクトURL。',
        '機密情報の入力や振込を求めるような怪しい指示はありません。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '公式ドメインからの送信',
        '完全なSPF/DKIM/DMARC認証PASS',
        'URLの偽装やミスマッチなし',
        '一般的な業務ツールの自動通知仕様に適合'
      ],
      bestPractice: '正規のSaaSツールからの通知です。無用にブロックすると社員の業務連絡が滞るため「安全」と判定してください。'
    }
  },

  // ================= DAY 2: NORMAL LEVEL - EXPANDING ATTACK VECTORS =================
  {
    id: 'd2-01',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'SUBDOMAIN_TRICK',
    categoryTitle: 'サブドメイン偽装の罠 (Subdomain Deception)',
    senderDisplayName: 'Microsoft 365 セキュリティチーム',
    senderEmail: 'no-reply@microsoft.com.account-protection-hub.net',
    senderDomain: 'microsoft.com.account-protection-hub.net',
    officialDomain: 'microsoft.com',
    recipient: 'security-admin@company.co.jp',
    subject: '【警告】ご利用の組織アカウントでストレージ容量が上限(99%)に達しました',
    receivedAt: '2026-10-29 08:30:11',
    body: `Microsoft 365 管理者センター

お客様のMicrosoft 365組織テナントにおいて、クラウドストレージの容量が上限（99.4%）に到達いたしました。
このまま上限を超過した場合、全ユーザーのOutlookメール送受信およびOneDrive同期機能が直ちに遮断されます。

業務影響を防ぐため、下記のリンクよりストレージ拡張申請（無料ボーナス25GB付与）を完了してください。

管理者ポータルログイン:
https://admin.microsoft.com.account-protection-hub.net/storage/expand

※48時間以内に申請が確認できない場合、古いメールアーカイブから順次自動消去されます。

Microsoft Operations Pte. Ltd.
One Marina Boulevard, Singapore`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'no-reply@microsoft.com.account-protection-hub.net',
        reason: '「microsoft.com」で始まるように見えますが、ドメインの本体は末尾の「account-protection-hub.net」です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '古いメールアーカイブから順次自動消去されます。',
        reason: '企業の過去メールが消えるという恐怖を煽り、管理者を焦らせて偽ポータルにサインインさせようとしています。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://admin.microsoft.com.account-protection-hub.net/storage/expand',
        targetUrl: 'https://admin.microsoft.com.account-protection-hub.net/storage/expand',
        domain: 'account-protection-hub.net',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: 'URLのホスト名「admin.microsoft.com.account-protection-hub.net」の真のドメインは「account-protection-hub.net」です。Microsoftの公式ドメインではありません。',
        destinationPreview: 'Microsoft 365管理者サインイン偽装画面 (社内管理者認証情報窃取用)',
        sslCert: {
          issuer: 'Google Trust Services LLC',
          isValid: true,
          daysOld: 5
        },
        whoisAgeDays: 5
      }
    ],
    attachments: [],
    headers: {
      from: '"Microsoft 365 セキュリティチーム" <no-reply@microsoft.com.account-protection-hub.net>',
      fromDisplayName: 'Microsoft 365 セキュリティチーム',
      returnPath: 'bounce@account-protection-hub.net',
      to: 'security-admin@company.co.jp',
      subject: '【警告】ご利用の組織アカウントでストレージ容量が上限(99%)に達しました',
      date: 'Thu, 29 Oct 2026 08:30:11 +0900',
      messageId: '<m365-storage-full-9921@account-protection-hub.net>',
      spf: {
        status: 'PASS',
        clientIp: '45.142.214.88',
        details: '攻撃者のサーバーIPです。ドメイン所有者の一致は見かけ上PASSします。'
      },
      dkim: {
        status: 'PASS',
        domain: 'account-protection-hub.net',
        details: '攻撃者ドメインの秘密鍵で署名されています（Microsoftの鍵ではない）。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'Microsoftの正規DMARCとは無関係です。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'relay.account-protection-hub.net', timestamp: '08:30:11', country: 'Bulgaria' }
      ]
    },
    domainAnalysis: {
      domainName: 'account-protection-hub.net',
      isTyposquat: true,
      officialEquivalent: 'microsoft.com',
      domainAge: '5日前',
      registrar: 'PublicDomainRegistry',
      notes: 'サブドメインに「admin.microsoft.com」を配置して偽装していますが、ベースドメインは東欧のホスティングで5日前に取得された「account-protection-hub.net」です。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: 'サブドメイン偽装トリックを用いており、正規のMicrosoft(@microsoft.com)ではありません。'
    },
    explanation: {
      summary: 'サブドメインに「microsoft.com」を含めて本物に見せかける、巧妙なM365管理者アカウント乗っ取りフィッシングです。',
      keyPoints: [
        'ドメイン名は「右側のTLD側から読む」のが鉄則。本物のドメインは「account-protection-hub.net」。',
        '管理者パスワードを入力すると組織全体のクラウドが侵害される極めて危険な攻撃。',
        '5日前に取得されたばかりの不正ドメイン。'
      ],
      threatIndicators: [
        'サブドメイン偽装 (〜.microsoft.com.attacker.net)',
        '取得後5日の新興不審ドメイン',
        'メール消去を盾にした期限圧力',
        'Microsoft公式DMARCの不適合'
      ],
      safeIndicators: [],
      bestPractice: 'ドメインをチェックする際は、最初の部分ではなく最後の「ドメイン名.com/net」を確認してください。M365管理者はブックマークした正規ポータル(admin.microsoft.com)から容量を確認すべきです。'
    }
  },

  {
    id: 'd2-02',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'MACRO_MALWARE',
    categoryTitle: 'マクロ内蔵悪性文書 (Macro Malware)',
    senderDisplayName: '人事労務課 渡辺',
    senderEmail: 'watanabe-hr@frontier-group-portal.com',
    senderDomain: 'frontier-group-portal.com',
    officialDomain: 'company.co.jp',
    recipient: 'all-employees@company.co.jp',
    subject: '【極秘・親展】2026年冬季賞与（ボーナス）個別査定一覧の送付',
    receivedAt: '2026-10-29 09:40:00',
    body: `社員各位

人事労務課の渡辺です。
役員会にて今期の冬季賞与および個人別評価係数が確定いたしましたので、個別明細シートをお送りいたします。

極秘文書のため、開封時にセキュリティマクロ保護がかかっております。
ファイルを開いたら上部に表示される「編集を有効にする」および「コンテンツの有効化」を必ずクリックして、暗号化を解除してください。

添付ファイル：
2026_冬季賞与個別査定明細_v3.xlsm

※他言無用でお願いいたします。

株式会社フロンティア 人事労務統括部
渡辺 麻美`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '「編集を有効にする」および「コンテンツの有効化」を必ずクリックして、暗号化を解除してください。',
        reason: 'Officeの保護ビューを解除させ、悪意のあるVBAマクロコードを実行させるための定番の攻撃口実です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '2026_冬季賞与個別査定明細_v3.xlsm',
        reason: '拡張子「.xlsm」はマクロ有効化Excelファイルです。社内配布用文書としては極めてリスクが高い形式です。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '2026_冬季賞与個別査定明細_v3.xlsm',
        fileSize: '840 KB',
        fileType: 'Microsoft Excel Macro-Enabled Worksheet',
        isSuspicious: true,
        suspicionReason: '内部に難読化されたAuto_Open VBAマクロが含まれています。実行すると外部C2サーバーからマルウェアをダウンロードします。',
        staticScan: {
          trueMimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
          hasMacros: true,
          hasHiddenExtension: false,
          entropyScore: 8.4,
          antivirusDetection: 'VBA.TrojanDownloader.Agent.Gen (悪意あるマクロを検出)'
        }
      }
    ],
    headers: {
      from: '"人事労務課 渡辺" <watanabe-hr@frontier-group-portal.com>',
      fromDisplayName: '人事労務課 渡辺',
      returnPath: 'bounce-hr@frontier-group-portal.com',
      to: 'all-employees@company.co.jp',
      subject: '【極秘・親展】2026年冬季賞与（ボーナス）個別査定一覧の送付',
      date: 'Thu, 29 Oct 2026 09:40:00 +0900',
      messageId: '<hr-bonus-confidential-2026@frontier-group-portal.com>',
      spf: {
        status: 'PASS',
        clientIp: '185.193.64.22',
        details: '外部ホスティングサーバーから送信されています。'
      },
      dkim: {
        status: 'NONE',
        domain: '',
        details: '未署名です。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'DMARCなし'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'mail.frontier-group-portal.com', timestamp: '09:40:00', country: 'Germany' }
      ]
    },
    domainAnalysis: {
      domainName: 'frontier-group-portal.com',
      isTyposquat: true,
      officialEquivalent: 'company.co.jp',
      domainAge: '3日前',
      registrar: 'Tucows Domains Inc.',
      notes: '自社名（フロンティア）を冠した「frontier-group-portal.com」という偽ドメインが3日前に海外で取得されています。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '自社の公式ドメイン(company.co.jp)ではなく、外部の偽ドメインから送られています。'
    },
    explanation: {
      summary: '社員の「ボーナス金額を知りたい」という好奇心につけこみ、マクロウイルスを実行させようとする標的型攻撃です。',
      keyPoints: [
        '「コンテンツの有効化」を押させようとする典型的なマクロ感染誘導文。',
        '添付ファイルはマクロ有効形式(.xlsm)で、内部に不正ダウンローダーを検知。',
        '自社名に似せた新設ドメイン(frontier-group-portal.com)から送信されている。'
      ],
      threatIndicators: [
        '悪意あるVBAマクロ(.xlsm)の添付',
        '「コンテンツの有効化」を強制する心理誘導',
        '自社ドメインを装う類似ドメイン',
        'アンチウイルスによるTrojanDownloader検出'
      ],
      safeIndicators: [],
      bestPractice: '賞与明細などの極秘情報がExcelマクロファイルで全社員に一斉送信されることはありません。添付ファイル付きメールで「マクロ有効化」を要求されたら即座に危険と判定してください。'
    }
  },

  {
    id: 'd2-03',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Internal Accounting)',
    senderDisplayName: '経理部 経費精算窓口',
    senderEmail: 'keihi-reception@company.co.jp',
    senderDomain: 'company.co.jp',
    officialDomain: 'company.co.jp',
    recipient: 'all-employees@company.co.jp',
    subject: '【経費精算】10月度立替経費・交通費 申請締切（今週金曜18時）のご案内',
    receivedAt: '2026-10-29 11:15:20',
    body: `社員の皆様
お疲れ様です。経理部 経費精算窓口です。

今月度の経費精算スケジュールについてご案内いたします。
月末処理に伴い、10月度の立替経費および出張旅費の社内ワークフロー申請締切は【10月31日（金）18:00】となります。

期日を過ぎますと当月振込処理ができなくなりますので、領収書の電子化および申請をお早めにお願いいたします。

■ 経費精算システムへのアクセス:
社内イントラネットの「社内システム一覧 > らくらく経費精算」よりログインしてください。

ご不明な点がございましたら、経理部内線(3320)までお問い合わせください。

-------------------------------------
株式会社フロンティア 財務経理部
Email: keihi-reception@company.co.jp
内線: 3320 / 3321
-------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '社内イントラネットの「社内システム一覧 > らくらく経費精算」よりログインしてください。',
        reason: '外部URLへのリンクを貼らず、イントラネット内からの通常経路を指定している極めて安全な運用です。',
        isSuspicious: false
      }
    ],
    urls: [],
    attachments: [],
    headers: {
      from: '"経理部 経費精算窓口" <keihi-reception@company.co.jp>',
      fromDisplayName: '経理部 経費精算窓口',
      returnPath: 'keihi-reception@company.co.jp',
      to: 'all-employees@company.co.jp',
      subject: '【経費精算】10月度立替経費・交通費 申請締切（今週金曜18時）のご案内',
      date: 'Thu, 29 Oct 2026 11:15:20 +0900',
      messageId: '<internal-keihi-202610-8812@mail.company.co.jp>',
      spf: {
        status: 'PASS',
        clientIp: '192.168.10.15',
        details: '社内Exchangeメールサーバーからの正規発信です。'
      },
      dkim: {
        status: 'PASS',
        domain: 'company.co.jp',
        details: '正規の自社ドメイン署名が確認されました。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'reject',
        details: 'DMARCポリシーに完全に合致しています。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'exchange-hub-01.company.local', timestamp: '11:15:20', country: 'Japan (Internal)' }
      ]
    },
    domainAnalysis: {
      domainName: 'company.co.jp',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'JPRS',
      notes: '自社ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: false,
      notes: '社内Exchangeアドレス帳に登録されている正規の経理部連絡先です。'
    },
    explanation: {
      summary: '自社経理部からの毎月定例の経費精算締め切り案内です。',
      keyPoints: [
        '社内正規ドメイン(company.co.jp)から発信され、SPF/DKIM/DMARCがすべて完全PASS。',
        '本文中に不審なURLリンクや添付ファイルがなく、社内規定に沿った周知文言。',
        '金銭の個人的な送金要求ではなく、通常の立替経費提出の案内。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '自社正規ドメイン発信',
        '内部IPおよび自社DKIM署名PASS',
        '外部URL・添付ファイルが存在しない',
        '通常の業務ルールに沿った文面'
      ],
      bestPractice: '毎月のルーチン業務連絡です。誤ってブロックすると社員が経費精算できず不満が出るため、確実に「安全なメール」として通してください。'
    }
  },

  {
    id: 'd2-04',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'SHORT_URL',
    categoryTitle: 'ETC利用照会サービス 解約予告フィッシング',
    senderDisplayName: 'ETC利用照会サービス事務局',
    senderEmail: 'admin@etc-meisai.jp.client-update.top',
    senderDomain: 'etc-meisai.jp.client-update.top',
    officialDomain: 'etc-meisai.jp',
    recipient: 'fleet-admin@company.co.jp',
    subject: '【重要なお知らせ】解約予告：ETC利用照会サービスのアカウントが長期間利用されていません',
    receivedAt: '2026-10-29 13:05:44',
    body: `ETC利用照会サービスをご利用いただき、誠にありがとうございます。

ETC利用照会サービスでは、セキュリティ保護および会員規約に基づき、420日間以上ログインがないお客様のアカウントにつきまして、自動解約（アカウント削除）の手続きを順次進めております。

お客様のアカウント（登録ID: corp-fleet-992）は、前回のログインから長期間が経過しており、このままですと【2026年10月31日】をもちまして自動解約となります。

解約後は、過去の走行明細の照会や利用証明書の発行ができなくなります。
アカウントの継続利用をご希望の場合は、誠にお手数ですが、以下の公式リンクよりログインを行ってください。

■ ETC利用照会サービス ログイン（自動解約の解除）
https://www.etc-meisai.jp.client-update.top/login/verify.html

※ログインが完了した時点で、自動解約の手続きは直ちにキャンセルされます。

--------------------------------------------------
ETC利用照会サービス事務局
東日本高速道路株式会社 / 中日本高速道路株式会社 / 西日本高速道路株式会社
首都高速道路株式会社 / 阪神高速道路株式会社 / 本州四国連絡高速道路株式会社
--------------------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '420日間以上ログインがないお客様のアカウントにつきまして、自動解約（アカウント削除）の手続きを順次進めております。',
        reason: '実在のETC利用照会サービス規約文言をそっくりそのまま盗用し、アカウント削除の恐怖で利用者をパニックに陥れる手口です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'etc-meisai.jp.client-update.top',
        reason: '公式ドメイン「etc-meisai.jp」をサブドメインに見せかけ、実体は末尾「client-update.top」という典型的な悪質フィッシングドメインです。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://www.etc-meisai.jp.client-update.top/login/verify.html',
        targetUrl: 'https://www.etc-meisai.jp.client-update.top/login/verify.html',
        domain: 'client-update.top',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: '「etc-meisai.jp」で始まりますが、本質ドメインは「.top」です。ETCカード番号とクレジットカード情報を同時に詐取する偽サイトへ接続されます。',
        destinationPreview: 'ETC利用照会サービス偽ログイン画面（ETCカード番号・クレジットカード番号・有効期限・CVV入力）',
        sslCert: {
          issuer: 'ZeroSSL CA',
          isValid: true,
          daysOld: 2
        },
        whoisAgeDays: 2
      }
    ],
    attachments: [],
    headers: {
      from: '"ETC利用照会サービス事務局" <admin@etc-meisai.jp.client-update.top>',
      fromDisplayName: 'ETC利用照会サービス事務局',
      returnPath: 'bounce@client-update.top',
      to: 'fleet-admin@company.co.jp',
      subject: '【重要なお知らせ】解約予告：ETC利用照会サービスのアカウントが長期間利用されていません',
      date: 'Thu, 29 Oct 2026 13:05:44 +0900',
      messageId: '<etc-meisai-alert-9941@client-update.top>',
      spf: {
        status: 'PASS',
        clientIp: '198.54.117.200',
        details: '攻撃者サーバーから発信。'
      },
      dkim: {
        status: 'NONE',
        domain: '',
        details: '未署名'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'ETC利用照会サービス正規DMARCとは無関係'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'host.client-update.top', timestamp: '13:05:44', country: 'United States' }
      ]
    },
    domainAnalysis: {
      domainName: 'etc-meisai.jp.client-update.top',
      isTyposquat: true,
      officialEquivalent: 'etc-meisai.jp',
      domainAge: '2日前 (新規取得)',
      registrar: 'Nicenic International Group Co., Ltd.',
      notes: '「etc-meisai.jp」をホスト名の前方に配置したサブドメイン詐欺です。正規ドメイン(etc-meisai.jp)ではなく使い捨ての「.top」ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: 'ETC公式メールアドレスではありません。'
    },
    explanation: {
      summary: '国内で年間数百万件単位でばら撒かれている、ETC利用照会サービスの自動解約予告を装った最も危険なフィッシング攻撃です。',
      keyPoints: [
        'サブドメインに「www.etc-meisai.jp」を組み込み、末尾の真のドメイン「client-update.top」を隠蔽。',
        '「420日以上ログインなしで解約」という公式規約を模倣し、信憑性を高めている。',
        'ログイン画面でETCカード番号のみならずクレジットカード番号や暗証番号を窃取。'
      ],
      threatIndicators: [
        'サブドメイン偽装 (.etc-meisai.jp.client-update.top)',
        '安価な使い捨て「.top」ドメインの悪用',
        '取得後2日の不正ドメイン',
        'ETC公式DKIM/DMARCの不適合'
      ],
      safeIndicators: [],
      bestPractice: 'ETC利用照会サービスに関するメールは、末尾が「etc-meisai.jp」で終わる正規ドメインであるかブラウザのURLバーを必ず確認してください。'
    }
  },

  {
    id: 'd2-05',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'BEC_WIRE_FRAUD',
    categoryTitle: 'ビジネスメール詐欺 (BEC - 振込先変更)',
    senderDisplayName: '大和マテリアル株式会社 財務部 高橋',
    senderEmail: 'takahashi.finance@yamato-materia1.co.jp',
    senderDomain: 'yamato-materia1.co.jp',
    officialDomain: 'yamato-material.co.jp',
    recipient: 'accounting-dept@company.co.jp',
    subject: '【極めて重要】10月度定期買掛金 お振込先銀行口座変更のご案内とお詫び',
    receivedAt: '2026-10-29 15:40:12',
    body: `株式会社フロンティア
経理財務部 御中

平素は格別のお引き立てを賜り、厚く御礼申し上げます。
大和マテリアル株式会社 財務部の高橋です。

急なご連絡となり大変恐縮でございますが、弊社にて進行中の銀行システム統合作業および定期会計監査に伴い、
貴社より今月末日にお振込み予定の定期買掛金（請求書No.YM-202610-449）のお振込先口座につきまして、
一時的に下記の新指定口座へご変更いただきたく存じます。

■ 新振込先指定口座
銀行名：みずほ銀行
支店名：丸の内中央支店（普）
口座番号：＊＊＊＊＊＊＊
口座名義：大和マテリアル管理口（ダイワマテリアルカンリグチ）

※会計監査上の制約により、本件に関する電話でのお問い合わせは担当の私までメールのみでご対応くださいますようお願い申し上げます。

添付ファイル：
・口座変更依頼書_代表印捺印済.pdf

ご多忙の折、大変お手数をおかけいたしますが、何卒ご協力のほどよろしくお願い申し上げます。

大和マテリアル株式会社
財務統括部 資金管理課
高橋 慎一郎
Direct: takahashi.finance@yamato-materia1.co.jp`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '本件に関する電話でのお問い合わせは担当の私までメールのみでご対応くださいますようお願い申し上げます。',
        reason: '正規取引先への電話確認（別経路確認）を阻害し、メールだけで騙し切ろうとする典型的なBEC詐欺の行動制御フレーズです。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'yamato-materia1.co.jp',
        reason: '取引先の正式ドメイン「yamato-material.co.jp」の「l(エル)」が数字の「1(イチ)」に巧妙に置き換わっています。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '口座変更依頼書_代表印捺印済.pdf',
        fileSize: '650 KB',
        fileType: 'Adobe Acrobat PDF Document',
        isSuspicious: true,
        suspicionReason: 'PDF自体にはマルウェアはありませんが、正規取引先の印鑑画像が切り貼り合成された偽造書類です。詐欺の信用付けに使用されています。',
        staticScan: {
          trueMimeType: 'application/pdf',
          hasMacros: false,
          hasHiddenExtension: false,
          entropyScore: 4.1,
          antivirusDetection: 'Clean (実行ファイルではありませんが偽造文書です)'
        }
      }
    ],
    headers: {
      from: '"大和マテリアル株式会社 財務部 高橋" <takahashi.finance@yamato-materia1.co.jp>',
      fromDisplayName: '大和マテリアル株式会社 財務部 高橋',
      returnPath: 'takahashi.finance@yamato-materia1.co.jp',
      to: 'accounting-dept@company.co.jp',
      subject: '【極めて重要】10月度定期買掛金 お振込先銀行口座変更のご案内とお詫び',
      date: 'Thu, 29 Oct 2026 15:40:12 +0900',
      messageId: '<bec-wire-4491-yamato@yamato-materia1.co.jp>',
      spf: {
        status: 'PASS',
        clientIp: '154.21.88.9',
        details: '攻撃者が登録した類似ドメインのSPFはPASSします。'
      },
      dkim: {
        status: 'PASS',
        domain: 'yamato-materia1.co.jp',
        details: '攻撃者ドメインの署名です。'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: '大和マテリアル本社のDMARCとは無関係です。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'vps-jp-tokyo02.hosting.com', timestamp: '15:40:12', country: 'Japan (VPS)' }
      ]
    },
    domainAnalysis: {
      domainName: 'yamato-materia1.co.jp',
      isTyposquat: true,
      officialEquivalent: 'yamato-material.co.jp',
      domainAge: '8日前',
      registrar: 'GMO Internet Group, Inc.',
      notes: '「material」の「l（小文字のエル）」を「1（数字のイチ）」にすり替えた極めて悪質なタイポスクワッティングです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '正規取引先のメールアドレス帳のスペルと1文字異なっています。'
    },
    explanation: {
      summary: '企業に数千万円規模の送金被害を与える最凶の脅威「ビジネスメール詐欺（BEC）」です。',
      keyPoints: [
        '取引先ドメイン「yamato-material.co.jp」の「l」を「1」にした類似ドメインを使用。',
        '「振込先口座の変更」という典型的な送金先詐取手口。',
        '「電話確認は不要、メールで」と、真の取引先に発覚するのを防ぐ誘導を行っている。'
      ],
      threatIndicators: [
        '取引先名と1文字違いの類似ドメイン (l -> 1)',
        '突然の振込先口座変更依頼',
        '電話確認を避けメール連絡を強制する文面',
        '最近取得されたばかりのドメイン (8日前)'
      ],
      safeIndicators: [],
      bestPractice: '振込先変更の依頼が届いた場合は、メール内の番号ではなく「過去の既知の電話番号」に別経路で連絡し、担当上長と二重確認を行うのが社内会計ルールの鉄則です。'
    }
  },

  // ================= DAY 3: HARD LEVEL - SOPHISTICATED ATTACKS =================
  {
    id: 'd3-01',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'HOMOGLYPH_PUNYCODE',
    categoryTitle: '国際化ドメイン偽装 (Punycode / Homoglyph)',
    senderDisplayName: 'Google Cloud Billing',
    senderEmail: 'billing-alert@xn--gogle-pqa.com',
    senderDomain: 'xn--gogle-pqa.com (góogle.com)',
    officialDomain: 'google.com',
    recipient: 'infra-lead@company.co.jp',
    subject: '【緊急】Google Cloud Platform お支払いカード有効期限切れによるサービス一時停止通知',
    receivedAt: '2026-10-30 08:02:19',
    body: `Google Cloud 管理者様

プロジェクト ID: frontier-corp-prod-01

平素より Google Cloud をご利用いただきありがとうございます。
お客様の請求先アカウントに登録されているクレジットカードへの月額利用料金（$3,840.50）の請求がカード会社より承認されませんでした。

つきましては、24時間以内に新しいお支払い方法をご登録いただけない場合、すべての仮想マシンインスタンス(GCE)およびKubernetesクラスタがシャットダウンされます。

お支払い情報の更新:
https://console.cloud.xn--gogle-pqa.com/billing/update

Google Cloud Platform Support
1600 Amphitheatre Parkway, Mountain View, CA`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'xn--gogle-pqa.com (góogle.com)',
        reason: 'キリル文字やアクセント記号付き文字「ó」を使用したホモグラフ攻撃（Punycode）です。ブラウザでは「google.com」そっくりにレンダリングされますが、正体は全く別のドメインです。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'すべての仮想マシンインスタンス(GCE)およびKubernetesクラスタがシャットダウンされます。',
        reason: '本番環境停止をちらつかせてインフラエンジニアを極度のパニックに陥れる標的型誘導です。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://console.cloud.google.com/billing/update',
        targetUrl: 'https://console.cloud.xn--gogle-pqa.com/billing/update',
        domain: 'xn--gogle-pqa.com',
        isMismatch: true,
        isSuspicious: true,
        suspicionReason: '表示テキストは正規の「console.cloud.google.com」ですが、実際のリンク先はPunycodeドメイン「xn--gogle-pqa.com」です。',
        destinationPreview: 'Google Cloudコンソール偽ログイン・クレジットカード入力画面',
        sslCert: {
          issuer: "Let's Encrypt Authority X3",
          isValid: true,
          daysOld: 2
        },
        whoisAgeDays: 3
      }
    ],
    attachments: [],
    headers: {
      from: '"Google Cloud Billing" <billing-alert@xn--gogle-pqa.com>',
      fromDisplayName: 'Google Cloud Billing',
      returnPath: 'billing@xn--gogle-pqa.com',
      to: 'infra-lead@company.co.jp',
      subject: '【緊急】Google Cloud Platform お支払いカード有効期限切れによるサービス一時停止通知',
      date: 'Fri, 30 Oct 2026 08:02:19 +0900',
      messageId: '<gcp-billing-alert-99120@xn--gogle-pqa.com>',
      spf: {
        status: 'SOFTFAIL',
        clientIp: '193.106.191.5',
        details: 'Googleの公式送信IPプールと一致しません。'
      },
      dkim: {
        status: 'FAIL',
        domain: 'google.com',
        details: 'google.comの正当な署名ではありません。'
      },
      dmarc: {
        status: 'FAIL',
        policy: 'reject',
        details: 'GoogleのDMARCポリシー(p=reject)により拒否されるべきメールです。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'hosted-by.worldstream.net', timestamp: '08:02:19', country: 'Netherlands' }
      ]
    },
    domainAnalysis: {
      domainName: 'xn--gogle-pqa.com',
      isTyposquat: true,
      officialEquivalent: 'google.com',
      domainAge: '3日前',
      registrar: 'Regtime Ltd.',
      notes: 'Punycode記法で変換すると「góogle.com」となるホモグラフ攻撃ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '見た目はGoogleに見えますが内部文字コードが異文字に置換されています。'
    },
    explanation: {
      summary: '極めて巧妙な国際化ドメイン（Punycode/ホモグラフ）を悪用したGCP請求情報窃取攻撃です。',
      keyPoints: [
        '「o」の文字にアキュートアクセント「ó」が使われており、Punycode表記「xn--gogle-pqa.com」。',
        '表示URLはGoogleに見せかけ、リンク先で偽ドメインへ飛ばすURL偽装も併用。',
        'Google公式のDKIM署名とDMARC認証が完全にFAIL。'
      ],
      threatIndicators: [
        'Punycodeホモグラフ偽装 (xn--gogle-pqa.com)',
        '表示テキストとhrefの相違',
        'SPF/DKIM/DMARCのFAIL判定',
        'インフラ停止を盾にした緊急脅迫'
      ],
      safeIndicators: [],
      bestPractice: 'ホモグラフ攻撃は肉眼での判別が困難なため、調査ツールでPunycode(xn--)表記やSPF/DKIMヘッダーを機械的に確認することが極めて重要です。'
    }
  },

  {
    id: 'd3-02',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'CEO_FRAUD',
    categoryTitle: '経営陣なりすまし詐欺 (CEO Fraud / Whaling)',
    senderDisplayName: '代表取締役社長 山田 太郎',
    senderEmail: 'yamada-ceo-frontier@gmail.com',
    senderDomain: 'gmail.com',
    officialDomain: 'company.co.jp',
    recipient: 'sec-staff@company.co.jp',
    subject: '【至急対応依頼】社外秘・緊急の顧客贈答品手配について',
    receivedAt: '2026-10-30 10:14:55',
    body: `審査担当君

急な連絡で済まない。
現在、社外の重要な極秘商談に出席しているのだが、先方の役員陣へ緊急で御礼のオンラインギフトカード（Apple Gift Card もしくは Amazonギフト券）を贈呈する必要が生じた。

私は今クライアントとの会議中で席を外せないため、君の方で至急、社費立替として【50,000円分×6枚（計30万円分）】を購入してくれないだろうか。
購入でき次第、裏面のスクラッチを削ったコードの写真をこのメール宛てに返信してほしい。

費用は月曜日に経理へ私から指示して直ちに全額立替精算させる。
なお、商談相手へのサプライズのため、本件は社内の他の誰にも口外せず、電話も控えてくれ。

頼んだぞ。

山田 太郎
代表取締役社長`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '社費立替として【50,000円分×6枚（計30万円分）】を購入してくれないだろうか。コードの写真をこのメール宛てに返信してほしい。',
        reason: '足がつかない電子ギフト券を購入させ、番号写真を送らせて換金する典型的なCEO詐欺の要求です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '本件は社内の他の誰にも口外せず、電話も控えてくれ。',
        reason: '社長本人や上司への確認を防ぐため、社内での相談や電話を固く口止めしています。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [],
    headers: {
      from: '"代表取締役社長 山田 太郎" <yamada-ceo-frontier@gmail.com>',
      fromDisplayName: '代表取締役社長 山田 太郎',
      returnPath: 'yamada-ceo-frontier@gmail.com',
      replyTo: 'yamada-ceo-frontier@gmail.com',
      to: 'sec-staff@company.co.jp',
      subject: '【至急対応依頼】社外秘・緊急の顧客贈答品手配について',
      date: 'Fri, 30 Oct 2026 10:14:55 +0900',
      messageId: '<ceo-mobile-urgent-9812@gmail.com>',
      spf: {
        status: 'PASS',
        clientIp: '209.85.220.41',
        details: 'Gmailの正規サーバーから送信されています（アカウント自体が攻撃者のGmail）。'
      },
      dkim: {
        status: 'PASS',
        domain: 'gmail.com',
        details: 'GmailのDKIMです。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'none',
        details: 'GmailのDMARCです。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'mail-sor-f41.google.com', timestamp: '10:14:55', country: 'United States' }
      ]
    },
    domainAnalysis: {
      domainName: 'gmail.com',
      isTyposquat: false,
      domainAge: '22年',
      registrar: 'Google LLC',
      notes: 'Gmailのフリーメールです。自社社長が社外秘の指示に個人の使い捨てGmailを使うことは社内情報管理規定に違反します。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '表示名は代表取締役ですが、アドレスは誰でも作れるフリーの「@gmail.com」です。'
    },
    explanation: {
      summary: '代表取締役の名を語り、新入社員や若手社員に電子ギフトカードを購入させる典型的なホエーリング（経営陣なりすまし詐欺）です。',
      keyPoints: [
        '社長の公式社内アドレスではなく、フリーのGmail(yamada-ceo-frontier@gmail.com)を使用。',
        '「ギフトカードのコード写真を送れ」という典型的な換金型詐欺手口。',
        '「社内の誰にも言うな」「電話するな」と外部相談を封じるソーシャルエンジニアリング。'
      ],
      threatIndicators: [
        '社長表示名とフリーメールアドレスの乖離',
        '電子ギフトカード（プリペイド）購入の要求',
        '社内相談や電話確認の禁止',
        '極秘・緊急を装った心理的圧力'
      ],
      safeIndicators: [],
      bestPractice: '役員や上司から「至急ギフトカードを買って番号を送れ」という指示があった場合は100%詐欺です。指示に従わず直ちに社内セキュリティ窓口へ通報してください。'
    }
  },

  {
    id: 'd3-03',
    day: 3,
    difficulty: 'HARD',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Third-Party Security Vendor)',
    senderDisplayName: 'クラウドストライク サポートセンター',
    senderEmail: 'support@crowdstrike.com',
    senderDomain: 'crowdstrike.com',
    officialDomain: 'crowdstrike.com',
    recipient: 'sec-admin@company.co.jp',
    subject: '【月次レポート】Falcon Endpoint Protection 10月度脅威検知・ブロック実績報告書',
    receivedAt: '2026-10-30 11:30:40',
    body: `セキュリティ管理者様

いつも CrowdStrike Falcon をご利用いただき、誠にありがとうございます。
貴社テナント（CID: 7B92A-CORP-FRONTIER）における2026年10月度のエンドポイントセキュリティ脅威検知サマリーをお届けします。

■ 今月の検知ハイライト:
・検知インシデント総数: 3件（すべて自動隔離・駆除完了）
・不審なPowerShellスクリプト遮断: 2件
・エージェント稼働端末数: 420台（健全率 99.8%）

詳細な分析レポート（PDF形式）は添付ファイルまたはFalcon管理コンソールよりご確認いただけます。

添付ファイル：
・CrowdStrike_Monthly_Threat_Report_202610.pdf

本メールは契約テナントの通知対象管理者様へ自動送信されています。

CrowdStrike, Inc.
Global Support & Intelligence Team`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'CID: 7B92A-CORP-FRONTIER',
        reason: '自社の正規FalconテナントIDと正確に一致しています。',
        isSuspicious: false
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: 'CrowdStrike_Monthly_Threat_Report_202610.pdf',
        fileSize: '1.2 MB',
        fileType: 'Adobe Acrobat PDF Document',
        isSuspicious: false,
        suspicionReason: undefined,
        staticScan: {
          trueMimeType: 'application/pdf',
          hasMacros: false,
          hasHiddenExtension: false,
          entropyScore: 3.5,
          antivirusDetection: 'Clean (脅威なし・正規のデジタル署名付きPDF)'
        }
      }
    ],
    headers: {
      from: '"クラウドストライク サポートセンター" <support@crowdstrike.com>',
      fromDisplayName: 'クラウドストライク サポートセンター',
      returnPath: 'bounces@notifications.crowdstrike.com',
      to: 'sec-admin@company.co.jp',
      subject: '【月次レポート】Falcon Endpoint Protection 10月度脅威検知・ブロック実績報告書',
      date: 'Fri, 30 Oct 2026 11:30:40 +0900',
      messageId: '<cs-rep-202610-88419@crowdstrike.com>',
      spf: {
        status: 'PASS',
        clientIp: '198.2.138.45',
        details: 'CrowdStrikeの公式SendGrid送信IPから配信されPASSしています。'
      },
      dkim: {
        status: 'PASS',
        domain: 'crowdstrike.com',
        details: 'CrowdStrike正規ドメインの暗号鍵で署名されています。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'reject',
        details: 'DMARC(p=reject)に完全に適合しています。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'o45.notifications.crowdstrike.com', timestamp: '11:30:40', country: 'United States' }
      ]
    },
    domainAnalysis: {
      domainName: 'crowdstrike.com',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'MarkMonitor Inc.',
      notes: 'セキュリティベンダー大手の正規公式ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: false,
      notes: '正規サポートメールアドレスです。'
    },
    explanation: {
      summary: '契約している大手セキュリティベンダーからの正規の月次脅威レポートです。',
      keyPoints: [
        '送信元ドメイン「crowdstrike.com」から送信され、SPF/DKIM/DMARCがすべて完全PASS。',
        '自社の正規顧客ID（CID）が正しく記載されている。',
        '添付ファイルはクリーンな正規PDFであり、不審なリンクや要求は存在しない。'
      ],
      threatIndicators: [],
      safeIndicators: [
        'ベンダー公式ドメインからの送信',
        '厳格なDMARC rejectポリシーの完全合格',
        '正確な社内テナントCIDの記載',
        '悪性コードを含まない正規レポートPDF'
      ],
      bestPractice: 'セキュリティ関連のメールだからといって何でも危険と判定せず、送信ドメイン認証やテナントIDの整合性を確認して正当な通知を通すことがプロの審査担当者として求められます。'
    }
  },

  {
    id: 'd3-04',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'CREDENTIAL_PHISH',
    categoryTitle: 'クラウド署名偽装 (DocuSign Credential Phishing)',
    senderDisplayName: 'DocuSign 電子署名サービス',
    senderEmail: 'dse@docusign-envelope-review.net',
    senderDomain: 'docusign-envelope-review.net',
    officialDomain: 'docusign.net',
    recipient: 'sales-legal@company.co.jp',
    subject: '【要署名】秘密保持契約書（NDA）の締結依頼が届いています',
    receivedAt: '2026-10-30 14:10:00',
    body: `DocuSign 電子署名

取引先企業様より、以下のドキュメントへの電子署名依頼が送信されました。

文書名：2026年度 業務委託秘密保持契約書 (NDA)_確定版.pdf
署名期限：本日中（2026年10月30日 23:59）

内容をご確認のうえ、以下のリンクをクリックして電子署名手続きを完了してください。

文書の確認と署名：
https://docusign-envelope-review.net/signing/document/view?id=8f92a10

※本リンクはセキュリティ保護のため、貴社のMicrosoft 365アカウントでのシングルサインオン認証が必要です。

DocuSign, Inc.
221 Main St., Suite 1000, San Francisco, CA 94105`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '本リンクはセキュリティ保護のため、貴社のMicrosoft 365アカウントでのシングルサインオン認証が必要です。',
        reason: '電子署名閲覧に見せかけて社内M365の認証情報を窃取する「リバースプロキシ型フィッシング（AiTM）」の典型的な導入文です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'docusign-envelope-review.net',
        reason: 'DocuSignの正規署名システムドメインは「docusign.net」です。「-envelope-review.net」は攻撃者が用意した偽ドメインです。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://docusign-envelope-review.net/signing/document/view?id=8f92a10',
        targetUrl: 'https://docusign-envelope-review.net/signing/document/view?id=8f92a10',
        domain: 'docusign-envelope-review.net',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: 'DocuSign公式ドメインではありません。リバースプロキシ(Evilginx)が稼働しており、MFA（多要素認証）セッショントークンを中間で盗み取ります。',
        destinationPreview: '本物そっくりのM365認証プロキシ画面 (ID/PW/ワンタイムコード盗取)',
        sslCert: {
          issuer: 'ZeroSSL CA',
          isValid: true,
          daysOld: 1
        },
        whoisAgeDays: 2
      }
    ],
    attachments: [],
    headers: {
      from: '"DocuSign 電子署名サービス" <dse@docusign-envelope-review.net>',
      fromDisplayName: 'DocuSign 電子署名サービス',
      returnPath: 'bounce@docusign-envelope-review.net',
      to: 'sales-legal@company.co.jp',
      subject: '【要署名】秘密保持契約書（NDA）の締結依頼が届いています',
      date: 'Fri, 30 Oct 2026 14:10:00 +0900',
      messageId: '<docusign-env-88991@docusign-envelope-review.net>',
      spf: {
        status: 'PASS',
        clientIp: '162.241.115.82',
        details: '攻撃者のBluehostサーバーから送信。自作ドメインのSPFはPASS。'
      },
      dkim: {
        status: 'NONE',
        domain: '',
        details: 'DocuSignの署名はなし'
      },
      dmarc: {
        status: 'NONE',
        policy: 'none',
        details: 'DocuSign正規DMARCとは無関係'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'box82.bluehost.com', timestamp: '14:10:00', country: 'United States' }
      ]
    },
    domainAnalysis: {
      domainName: 'docusign-envelope-review.net',
      isTyposquat: true,
      officialEquivalent: 'docusign.net',
      domainAge: '2日前',
      registrar: 'NameSilo, LLC',
      notes: 'DocuSignの正規ドメイン(docusign.net / docusign.com)とは無関係な2日前に取得された偽装ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: false,
      anomalyDetected: true,
      notes: '公式のDocuSignアドレスではありません。'
    },
    explanation: {
      summary: '電子署名（DocuSign）の通知を装い、社内M365のセッション情報を奪うAiTM（中間者型）フィッシングです。',
      keyPoints: [
        'DocuSignの正規通知ドメインは「docusign.net」。偽物は「docusign-envelope-review.net」。',
        '「閲覧にMicrosoft 365のログインが必要」と誘導し、認証情報とMFAトークンを奪う。',
        'DocuSign正規のDKIM署名が存在しない。'
      ],
      threatIndicators: [
        'DocuSign類似偽ドメイン',
        '電子署名に無関係なM365ログインの要求',
        '取得後2日の使い捨て新設ドメイン',
        '公式DKIM署名の欠如'
      ],
      safeIndicators: [],
      bestPractice: '電子署名依頼のメールは、送信元のドメインが「@docusign.net」であることを必ず確認してください。署名閲覧時に自社M365のパスワードを要求されることはありません。'
    }
  },

  {
    id: 'd3-05',
    day: 3,
    difficulty: 'HARD',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Internal Human Resources)',
    senderDisplayName: 'フロンティア 人事労務部 健康管理室',
    senderEmail: 'health-check@company.co.jp',
    senderDomain: 'company.co.jp',
    officialDomain: 'company.co.jp',
    recipient: 'all-employees@company.co.jp',
    subject: '【重要】2026年度 定期健康診断・人間ドック 予約受付開始のご案内',
    receivedAt: '2026-10-30 16:20:00',
    body: `社員各位

人事労務部 健康管理室です。
労働安全衛生法に基づき、本年度の定期健康診断および人間ドックの受診予約受付を開始いたします。

今年度より提携健診機関のWeb予約システムが導入されました。
以下の社内指定URLより個人マイページにログインし、受診希望日・受診会場を選択してください。

■ 健診予約ポータル（社内SSO連携）:
https://portal.company.co.jp/welfare/health2026

■ 予約期間：2026年11月1日（日）〜 11月20日（金）
■ 受診対象期間：2026年12月1日 〜 2027年2月28日

※ログインには普段の社内IDおよびシングルサインオンをご利用いただけます。
ご不明な点は健康管理室（内線: 2190）までお気軽にお問い合わせください。

-------------------------------------
株式会社フロンティア 人事労務統括部 健康管理室
保健師：高橋、中島
Email: health-check@company.co.jp
内線: 2190
-------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://portal.company.co.jp/welfare/health2026',
        reason: '自社ドメイン「company.co.jp」配下の正規サブドメインかつ自社内部ポータルURLです。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://portal.company.co.jp/welfare/health2026',
        targetUrl: 'https://portal.company.co.jp/welfare/health2026',
        domain: 'portal.company.co.jp',
        isMismatch: false,
        isSuspicious: false,
        suspicionReason: undefined,
        destinationPreview: '社内健診Web予約システム (自社SSO認証)',
        sslCert: {
          issuer: 'GlobalSign Extended Validation CA',
          isValid: true,
          daysOld: 410
        },
        whoisAgeDays: 5200
      }
    ],
    attachments: [],
    headers: {
      from: '"フロンティア 人事労務部 健康管理室" <health-check@company.co.jp>',
      fromDisplayName: 'フロンティア 人事労務部 健康管理室',
      returnPath: 'health-check@company.co.jp',
      to: 'all-employees@company.co.jp',
      subject: '【重要】2026年度 定期健康診断・人間ドック 予約受付開始のご案内',
      date: 'Fri, 30 Oct 2026 16:20:00 +0900',
      messageId: '<health-check-2026-9918@mail.company.co.jp>',
      spf: {
        status: 'PASS',
        clientIp: '192.168.10.10',
        details: '社内Exchangeサーバーの正規IPから発信。'
      },
      dkim: {
        status: 'PASS',
        domain: 'company.co.jp',
        details: '自社正規DKIM署名が有効です。'
      },
      dmarc: {
        status: 'PASS',
        policy: 'reject',
        details: 'DMARCポリシーに完全適合。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'pc-health-room.company.local', timestamp: '16:20:00', country: 'Japan (Internal)' }
      ]
    },
    domainAnalysis: {
      domainName: 'company.co.jp',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'JPRS',
      notes: '自社の正規ドメインです。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: false,
      notes: '自社人事部の公式内部アドレスです。'
    },
    explanation: {
      summary: '自社健康管理室からの年次定期健康診断予約の正規案内です。',
      keyPoints: [
        '送信元は自社正規ドメイン(company.co.jp)で、SPF/DKIM/DMARCがすべて完全PASS。',
        'リンク先は自社公式サブドメイン(portal.company.co.jp)でありURL偽装もなし。',
        '社員の福利厚生・法定健診の手続きとして極めて正当な内容。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '完全な自社正規アドレスおよびドメイン',
        'SPF/DKIM/DMARCの完全PASS',
        '自社ポータル正規リンク (portal.company.co.jp)',
        '法定業務手続きに則った内容'
      ],
      bestPractice: '全社向けの「【重要】」やリンク付きの案内であっても、自社ドメインや認証ヘッダーが真正であれば正しく安全と判定しましょう。'
    }
  },

  // ===== DAY 1 ADDITIONAL EMAILS =====
  {
    id: 'd1-06',
    day: 1,
    difficulty: 'EASY',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Web Conference Invite)',
    senderDisplayName: 'Zoom Video Communications',
    senderEmail: 'no-reply@zoom.us',
    senderDomain: 'zoom.us',
    officialDomain: 'zoom.us',
    recipient: 'project-team@company.co.jp',
    subject: '佐藤部長 がミーティング「第3四半期 事業戦略定例会」をスケジュールしました',
    receivedAt: '2026-10-28 15:00:12',
    body: `Zoom ミーティングの招待状

佐藤 健一 さんがスケジュールした Zoom ミーティングにご参加ください。

トピック: 第3四半期 事業戦略定例会
時間: 2026年10月29日 10:00 AM 大阪、札幌、東京

Zoom ミーティングに参加する:
https://company-jp.zoom.us/j/84920192831?pwd=V1hNZjN4T0lXbENmU1FwOUc3Z3VqUT09

ミーティングID: 849 2019 2831
パスコード: 492019

Zoom Video Communications, Inc.
55 Almaden Blvd, Suite 600, San Jose, CA 95113`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://company-jp.zoom.us/j/84920192831?pwd=...',
        reason: '正規のZoom法人バニティドメイン（company-jp.zoom.us）配下の安全な会議リンクです。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://company-jp.zoom.us/j/84920192831?pwd=V1hNZjN4T0lXbENmU1FwOUc3Z3VqUT09',
        targetUrl: 'https://company-jp.zoom.us/j/84920192831?pwd=V1hNZjN4T0lXbENmU1FwOUc3Z3VqUT09',
        domain: 'company-jp.zoom.us',
        isMismatch: false,
        isSuspicious: false,
        destinationPreview: 'Zoom公式クライアント起動画面 (正規Web会議)',
        sslCert: {
          issuer: 'DigiCert Global Root CA',
          isValid: true,
          daysOld: 720
        },
        whoisAgeDays: 4500
      }
    ],
    attachments: [],
    headers: {
      from: '"Zoom Video Communications" <no-reply@zoom.us>',
      fromDisplayName: 'Zoom Video Communications',
      returnPath: 'bounce-zoom@notifications.zoom.us',
      to: 'project-team@company.co.jp',
      subject: '佐藤部長 がミーティング「第3四半期 事業戦略定例会」をスケジュールしました',
      date: 'Wed, 28 Oct 2026 15:00:12 +0900',
      messageId: '<zoom-notif-8841@zoom.us>',
      spf: { status: 'PASS', clientIp: '198.2.179.12', details: 'Zoom公式SendGrid送信IPからPASS。' },
      dkim: { status: 'PASS', domain: 'zoom.us', details: 'Zoom公式電子署名が有効です。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARCに適合しています。' },
      hops: [{ by: 'mail.company.co.jp', from: 'mail.zoom.us', timestamp: '15:00:12', country: 'United States' }]
    },
    domainAnalysis: {
      domainName: 'zoom.us',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'MarkMonitor Inc.',
      notes: 'Zoom公式ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '公式のZoom配信元アドレスです。' },
    explanation: {
      summary: '社内社員が主催した正規のZoom定例ミーティングの招待通知です。',
      keyPoints: [
        '正規の「zoom.us」ドメインから発信され、SPF/DKIM/DMARCがすべて完全PASS。',
        'リンク先は自社契約のZoomバニティURLで不審なリダイレクトなし。',
        '日常の一般的な社内Web会議連絡。'
      ],
      threatIndicators: [],
      safeIndicators: ['公式Zoomドメイン', '完全なSPF/DKIM PASS', '正規会議URL'],
      bestPractice: '正規の会議招待メールです。誤検知でブロックしないよう「安全」として通過させましょう。'
    }
  },

  {
    id: 'd1-07',
    day: 1,
    difficulty: 'EASY',
    isThreat: true,
    category: 'CREDENTIAL_PHISH',
    categoryTitle: 'Apple ID 偽装フィッシング',
    senderDisplayName: 'Apple サポート',
    senderEmail: 'support-appleid@icloud-security-center.top',
    senderDomain: 'icloud-security-center.top',
    officialDomain: 'apple.com',
    recipient: 'staff-01@company.co.jp',
    subject: '【警告】お客様のApple IDがロックされました（不審なサインインの試行）',
    receivedAt: '2026-10-28 16:40:00',
    body: `お客様

ご利用のApple IDにおいて、未承認のデバイスからのサインインが試行されたため、お客様のセキュリティを保護する目的でアカウントを一時的にロックいたしました。

デバイス: iPhone 13 Pro
場所: 中華人民共和国・北京
IPアドレス: 114.249.21.80

アカウントのロックを解除し、パスワードを更新するには下記のボタンをクリックしてください。

アカウントのロック解除:
https://appleid.apple.com.icloud-security-center.top/manage

24時間以内にロック解除が完了しない場合、お客様のApple IDおよびiCloudバックアップは完全に削除されます。

Apple Support
Apple Distribution International Ltd.`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'お客様',
        reason: 'Appleからの正規通知には必ず登録された氏名が冒頭に記載されます。単なる「お客様」はフィッシングの典型です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'icloud-security-center.top',
        reason: '「.top」などの安価な使い捨てTLDを使用した悪意のあるフィッシングドメインです。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://appleid.apple.com.icloud-security-center.top/manage',
        targetUrl: 'https://appleid.apple.com.icloud-security-center.top/manage',
        domain: 'icloud-security-center.top',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: '「appleid.apple.com」で始まりますが、本質ドメインは「icloud-security-center.top」です。',
        destinationPreview: 'Apple IDそっくりの偽装サインイン画面 (パスワード・クレカ入力)',
        sslCert: { issuer: "Let's Encrypt", isValid: true, daysOld: 1 },
        whoisAgeDays: 1
      }
    ],
    attachments: [],
    headers: {
      from: '"Apple サポート" <support-appleid@icloud-security-center.top>',
      fromDisplayName: 'Apple サポート',
      returnPath: 'bounce@icloud-security-center.top',
      to: 'staff-01@company.co.jp',
      subject: '【警告】お客様のApple IDがロックされました（不審なサインインの試行）',
      date: 'Wed, 28 Oct 2026 16:40:00 +0900',
      messageId: '<appleid-alert-99120@icloud-security-center.top>',
      spf: { status: 'PASS', clientIp: '185.196.220.15', details: '攻撃者サーバーから発信。' },
      dkim: { status: 'NONE', domain: '', details: '未署名' },
      dmarc: { status: 'NONE', policy: 'none', details: 'DMARCなし' },
      hops: [{ by: 'mail.company.co.jp', from: 'host.icloud-security-center.top', timestamp: '16:40:00', country: 'Russia' }]
    },
    domainAnalysis: {
      domainName: 'icloud-security-center.top',
      isTyposquat: true,
      officialEquivalent: 'apple.com',
      domainAge: '昨日登録 (1日前)',
      registrar: 'Nicenic International Group Co., Ltd.',
      notes: '昨日登録されたばかりの「.top」フィッシングドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: 'Apple公式(@apple.com)とは全く無関係です。' },
    explanation: {
      summary: 'Apple IDのロックを口実に、IDとパスワードおよびクレジットカード情報を盗もうとする詐欺です。',
      keyPoints: [
        'ドメインが公式の「apple.com」ではなく「icloud-security-center.top」。',
        '宛名が氏名ではなく「お客様」。',
        '「24時間以内に削除」と根拠のない脅迫を行っている。'
      ],
      threatIndicators: ['使い捨て.topドメイン', 'サブドメイン偽装', '名指しのない宛名', '脅迫的文言'],
      safeIndicators: [],
      bestPractice: 'アカウントロック通知が届いた場合はメール内のリンクを押さず、公式の「appleid.apple.com」に直接アクセスして状況を確認しましょう。'
    }
  },

  // ===== DAY 2 ADDITIONAL EMAILS =====
  {
    id: 'd2-06',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Developer Notification)',
    senderDisplayName: 'GitHub',
    senderEmail: 'notifications@github.com',
    senderDomain: 'github.com',
    officialDomain: 'github.com',
    recipient: 'dev-team@company.co.jp',
    subject: '[GitHub] Pull Request #142 opened in frontier-corp/core-api',
    receivedAt: '2026-10-29 16:30:11',
    body: `GitHub Notification

鈴木 健太 (k-suzuki) がプルリクエストを作成し、レビューを依頼しました。

リポジトリ: frontier-corp/core-api
プルリクエスト: #142 - "Fix payment gateway timeout retry logic"
ブランチ: feature/retry-handler -> main

変更内容:
+148行 / -22行 (4ファイル変更)

プルリクエストを確認する:
https://github.com/frontier-corp/core-api/pull/142

--
この通知を停止するには通知設定を変更してください。
GitHub, Inc. 88 Colin P Kelly Jr St, San Francisco, CA 94107`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'frontier-corp/core-api',
        reason: '自社社内GitHub Enterprise/Organizationの正確なリポジトリ名です。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://github.com/frontier-corp/core-api/pull/142',
        targetUrl: 'https://github.com/frontier-corp/core-api/pull/142',
        domain: 'github.com',
        isMismatch: false,
        isSuspicious: false,
        destinationPreview: 'GitHub公式リポジトリ Pull Request ページ',
        sslCert: { issuer: 'DigiCert High Assurance TLS Hybrid ECC SHA256 2020 CA1', isValid: true, daysOld: 600 },
        whoisAgeDays: 6000
      }
    ],
    attachments: [],
    headers: {
      from: '"GitHub" <notifications@github.com>',
      fromDisplayName: 'GitHub',
      returnPath: 'noreply@github.com',
      to: 'dev-team@company.co.jp',
      subject: '[GitHub] Pull Request #142 opened in frontier-corp/core-api',
      date: 'Thu, 29 Oct 2026 16:30:11 +0900',
      messageId: '<frontier-corp/core-api/pull/142/notif@github.com>',
      spf: { status: 'PASS', clientIp: '192.30.252.204', details: 'GitHub公式送信サーバーからPASS。' },
      dkim: { status: 'PASS', domain: 'github.com', details: 'GitHub公式のRSA署名が検証されました。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARC(p=reject)に完全合致。' },
      hops: [{ by: 'mail.company.co.jp', from: 'smtp.github.com', timestamp: '16:30:11', country: 'United States' }]
    },
    domainAnalysis: {
      domainName: 'github.com',
      isTyposquat: false,
      domainAge: '16年',
      registrar: 'MarkMonitor Inc.',
      notes: 'GitHub, Inc.の正規ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '公式GitHub通知アドレスです。' },
    explanation: {
      summary: '社内開発リポジトリにおける正規のプルリクエスト通知メールです。',
      keyPoints: [
        '送信元ドメイン「github.com」で、SPF/DKIM/DMARCがすべて完全PASS。',
        '自社の正規リポジトリ名と社内開発者のアカウントが正しく記載されている。',
        'リンク先も正規の「github.com」URL。'
      ],
      threatIndicators: [],
      safeIndicators: ['GitHub公式ドメイン', '完全な送信ドメイン認証PASS', '正規リポジトリリンク'],
      bestPractice: '日常の開発ワークフローにおける重要な通知です。安全なメールとして承認してください。'
    }
  },

  {
    id: 'd2-07',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'CREDENTIAL_PHISH',
    categoryTitle: 'クラウドストレージ共有偽装フィッシング',
    senderDisplayName: 'OneDrive クラウド共有',
    senderEmail: 'share-notification@onedrive-secure-sharing.com',
    senderDomain: 'onedrive-secure-sharing.com',
    officialDomain: 'onedrive.com',
    recipient: 'planning-dept@company.co.jp',
    subject: '【共有ドキュメント】外部パートナー様より「2027年事業計画書_ドラフト.pdf」が共有されました',
    receivedAt: '2026-10-29 17:15:30',
    body: `Microsoft OneDrive

外部パートナー企業（三菱商事株式会社）の担当者様が、あなたとファイルを共有しました。

ファイル名: 2027年事業計画書_ドラフト.pdf
サイズ: 4.8 MB
有効期限: 2026年10月31日

ドキュメントを閲覧するには、下記のセキュアリンクをクリックしてください。

ファイルを開く:
https://onedrive.live.com.onedrive-secure-sharing.com/view/doc?id=99281a

※社外秘文書のため、閲覧には組織アカウント（Microsoft 365）でのサインインが必要です。

Microsoft Corporation
One Microsoft Way, Redmond, WA 98052`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'onedrive.live.com.onedrive-secure-sharing.com',
        reason: 'サブドメインに「onedrive.live.com」を並べた典型的なドメイン偽装です。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://onedrive.live.com.onedrive-secure-sharing.com/view/doc?id=99281a',
        targetUrl: 'https://onedrive.live.com.onedrive-secure-sharing.com/view/doc?id=99281a',
        domain: 'onedrive-secure-sharing.com',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: 'Microsoftの公式OneDriveではなく、4日前に取得された偽装ドメインです。',
        destinationPreview: 'OneDrive偽ログイン画面 (M365認証情報窃取)',
        sslCert: { issuer: "Let's Encrypt", isValid: true, daysOld: 4 },
        whoisAgeDays: 4
      }
    ],
    attachments: [],
    headers: {
      from: '"OneDrive クラウド共有" <share-notification@onedrive-secure-sharing.com>',
      fromDisplayName: 'OneDrive クラウド共有',
      returnPath: 'bounce@onedrive-secure-sharing.com',
      to: 'planning-dept@company.co.jp',
      subject: '【共有ドキュメント】外部パートナー様より「2027年事業計画書_ドラフト.pdf」が共有されました',
      date: 'Thu, 29 Oct 2026 17:15:30 +0900',
      messageId: '<onedrive-share-8891@onedrive-secure-sharing.com>',
      spf: { status: 'PASS', clientIp: '185.220.101.99', details: '攻撃者の専用サーバーから発信。' },
      dkim: { status: 'NONE', domain: '', details: '未署名' },
      dmarc: { status: 'NONE', policy: 'none', details: 'Microsoft正規DMARCとは無関係' },
      hops: [{ by: 'mail.company.co.jp', from: 'host.onedrive-secure-sharing.com', timestamp: '17:15:30', country: 'Lithuania' }]
    },
    domainAnalysis: {
      domainName: 'onedrive-secure-sharing.com',
      isTyposquat: true,
      officialEquivalent: 'onedrive.com',
      domainAge: '4日前',
      registrar: 'PublicDomainRegistry',
      notes: 'OneDrive公式ではなく、4日前に新設された類似ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: 'Microsoft正規アドレスではありません。' },
    explanation: {
      summary: '有名取引先からのファイル共有を偽装した、Microsoft 365アカウント乗っ取りフィッシングです。',
      keyPoints: [
        '「onedrive-secure-sharing.com」という4日前に新設された偽ドメインを使用。',
        'サブドメインに「onedrive.live.com」を配置して利用者を騙している。',
        'M365の認証情報を入力させ、社内メールやTeamsを乗っ取る狙い。'
      ],
      threatIndicators: ['サブドメイン偽装', '新設類似ドメイン', 'M365サインイン誘導', 'DKIM未設定'],
      safeIndicators: [],
      bestPractice: 'ファイル共有通知を受け取った際は、送信元ドメインが本物の「@sharepointonline.com」または「@onedrive.com」であることを確認してください。'
    }
  },

  // ===== DAY 3 ADDITIONAL EMAILS =====
  {
    id: 'd3-06',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'SPF_DKIM_FAIL',
    categoryTitle: '送信ドメイン認証失敗 (Direct From Spoofing)',
    senderDisplayName: 'アマゾン ウェブ サービス (AWS)',
    senderEmail: 'no-reply-aws@amazon.com',
    senderDomain: 'amazon.com',
    officialDomain: 'amazon.com',
    recipient: 'cloud-ops@company.co.jp',
    subject: '【緊急警告】AWS ルートアカウントへの不正アクセス検知とアカウント凍結について',
    receivedAt: '2026-10-30 17:05:14',
    body: `Amazon Web Services お客様

AWSアカウント (ID: 9482-1092-3310)

弊社のセキュリティ自動監視システムにより、お客様のAWSルートアカウントに対して海外IP（北朝鮮・平壌）からのブルートフォース（総当たり）ログイン試行が検知されました。

アカウントの完全凍結およびホスト中のEC2/RDSインスタンスの強制削除を防ぐため、6時間以内に下記のリンクからMFA（多要素認証）デバイスの緊急再同期を行ってください。

MFA緊急再同期ポータル:
https://signin.aws.amazon.com-security-mfa-sync.cc/oauth/v2

Amazon Web Services, Inc.
410 Terry Avenue North, Seattle, WA 98109`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'no-reply-aws@amazon.com',
        reason: '差出人アドレスに本物の「amazon.com」を直接詐称（Direct Spoofing）しています。しかしヘッダーのSPF/DKIM/DMARCがすべてFAILしているため完全な偽装です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'signin.aws.amazon.com-security-mfa-sync.cc',
        reason: '真のドメインは「amazon.com-security-mfa-sync.cc」です。末尾が「.cc」の攻撃者ドメインです。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://signin.aws.amazon.com/mfa-sync',
        targetUrl: 'https://signin.aws.amazon.com-security-mfa-sync.cc/oauth/v2',
        domain: 'amazon.com-security-mfa-sync.cc',
        isMismatch: true,
        isSuspicious: true,
        suspicionReason: '表示URLは「signin.aws.amazon.com」ですが、実際のリンク先は「.cc」の偽装サーバーです。',
        destinationPreview: 'AWSマネジメントコンソール偽サインイン画面 (Rootパスワード・MFAコード窃取)',
        sslCert: { issuer: "Let's Encrypt", isValid: true, daysOld: 2 },
        whoisAgeDays: 2
      }
    ],
    attachments: [],
    headers: {
      from: '"アマゾン ウェブ サービス (AWS)" <no-reply-aws@amazon.com>',
      fromDisplayName: 'アマゾン ウェブ サービス (AWS)',
      returnPath: 'spoofed-bounce@botnet-relays.su',
      to: 'cloud-ops@company.co.jp',
      subject: '【緊急警告】AWS ルートアカウントへの不正アクセス検知とアカウント凍結について',
      date: 'Fri, 30 Oct 2026 17:05:14 +0900',
      messageId: '<aws-sec-breach-88124@relay-09.su>',
      spf: {
        status: 'FAIL',
        clientIp: '91.240.118.23',
        details: '送信元IPはamazon.comのSPF許可レコード(SPF -all)に含まれておらず、完全なFAILです。'
      },
      dkim: {
        status: 'FAIL',
        domain: 'amazon.com',
        details: 'DKIM公開鍵とメール本文の署名ハッシュが一致しません（改ざん検知）。'
      },
      dmarc: {
        status: 'FAIL',
        policy: 'reject',
        details: 'DMARCポリシー(p=reject)違反。即座に破棄されるべき偽装メールです。'
      },
      hops: [
        { by: 'mail.company.co.jp', from: 'botnet-relay-09.su', timestamp: '17:05:14', country: 'Russia' }
      ]
    },
    domainAnalysis: {
      domainName: 'amazon.com',
      isTyposquat: false,
      domainAge: '30年',
      registrar: 'MarkMonitor Inc.',
      notes: '表示アドレス自体はAmazon正規ですが、ヘッダー検査で完全ななりすまし（Direct Spoofing）と判明。'
    },
    addressAnalysis: {
      displayNameVsEmailMatch: true,
      anomalyDetected: true,
      notes: 'アドレス表記は「@amazon.com」ですが、送信サーバーが全く無関係な海外ボットネットです（ヘッダーSPF/DKIM/DMARCがすべてFAIL）。'
    },
    explanation: {
      summary: '送信元アドレスのヘッダーを直接偽装（Direct From Spoofing）した高度なAWSアカウント奪取攻撃です。',
      keyPoints: [
        'メールアドレスは「amazon.com」に見えますが、SPF/DKIM/DMARCがすべてFAIL。',
        '表示URLと実際のリンク先(amazon.com-security-mfa-sync.cc)が異なるURL偽装。',
        '「6時間以内の凍結」と極端なカウントダウンでパニックを誘う。'
      ],
      threatIndicators: [
        'SPF/DKIM/DMARCのすべてが完全FAIL',
        'Return-PathとFromヘッダーの不一致',
        'リンク先URLの偽装 (.cc ドメイン)',
        'インフラ強制停止を盾にした緊急脅迫'
      ],
      safeIndicators: [],
      bestPractice: '差出人アドレスの文字だけでは見抜けない攻撃です。必ず調査ツールで「SPF/DKIM/DMARCヘッダー」を確認し、FAILしている場合はどれほど本物らしく見えても危険と判定してください。'
    }
  },

  {
    id: 'd3-07',
    day: 3,
    difficulty: 'HARD',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (Internal CSIRT Security Drill)',
    senderDisplayName: '社内情報セキュリティ推進室 (CSIRT)',
    senderEmail: 'csirt-team@company.co.jp',
    senderDomain: 'company.co.jp',
    officialDomain: 'company.co.jp',
    recipient: 'all-employees@company.co.jp',
    subject: '【お知らせ】2026年度 下期 標的型攻撃メール訓練の実施完了と結果フィードバック',
    receivedAt: '2026-10-30 18:00:00',
    body: `全社員の皆様

お疲れ様です。情報セキュリティ推進室（CSIRT）の松原です。

先週実施いたしました「2026年度 下期 標的型攻撃メール模擬訓練」にご協力いただき、誠にありがとうございました。
全社集計結果および振り返り学習コンテンツを社内セキュリティポータルに公開いたしました。

■ 訓練実施結果サマリー:
・訓練メール開封率: 4.2%（前年比 -2.8pt 改善）
・不審メール報告件数: 382件（過去最高）

日頃より皆様が不審なメールに警戒し、速やかな報告を行っていただいている成果が数字として表れております。

訓練の詳細解説および見抜くためのポイント動画は、下記社内ポータルよりご覧いただけます。

社内ポータル（CSIRT活動報告）:
https://portal.company.co.jp/csirt/training-2026-h2

引き続き、安全な業務環境の維持にご協力をお願い申し上げます。

-------------------------------------
株式会社フロンティア 情報セキュリティ推進室 (CSIRT)
室長：松原 一樹
Email: csirt-team@company.co.jp
緊急連絡先（内線）: 9911
-------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://portal.company.co.jp/csirt/training-2026-h2',
        reason: '自社の正規ポータルURL(portal.company.co.jp)です。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://portal.company.co.jp/csirt/training-2026-h2',
        targetUrl: 'https://portal.company.co.jp/csirt/training-2026-h2',
        domain: 'portal.company.co.jp',
        isMismatch: false,
        isSuspicious: false,
        destinationPreview: '社内CSIRTポータル 訓練結果解説ページ',
        sslCert: { issuer: 'GlobalSign Extended Validation CA', isValid: true, daysOld: 410 },
        whoisAgeDays: 5200
      }
    ],
    attachments: [],
    headers: {
      from: '"社内情報セキュリティ推進室 (CSIRT)" <csirt-team@company.co.jp>',
      fromDisplayName: '社内情報セキュリティ推進室 (CSIRT)',
      returnPath: 'csirt-team@company.co.jp',
      to: 'all-employees@company.co.jp',
      subject: '【お知らせ】2026年度 下期 標的型攻撃メール訓練の実施完了と結果フィードバック',
      date: 'Fri, 30 Oct 2026 18:00:00 +0900',
      messageId: '<csirt-training-feedback-2026@mail.company.co.jp>',
      spf: { status: 'PASS', clientIp: '192.168.10.8', details: '社内メールサーバーから送信。' },
      dkim: { status: 'PASS', domain: 'company.co.jp', details: '自社正規DKIM署名PASS。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARC PASS。' },
      hops: [{ by: 'mail.company.co.jp', from: 'csirt-core.company.local', timestamp: '18:00:00', country: 'Japan (Internal)' }]
    },
    domainAnalysis: {
      domainName: 'company.co.jp',
      isTyposquat: false,
      domainAge: '14年',
      registrar: 'JPRS',
      notes: '自社ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '自社CSIRT室の正規アドレスです。' },
    explanation: {
      summary: '自社CSIRT室からの標的型攻撃メール訓練の正規フィードバック報告です。',
      keyPoints: [
        '送信元は自社正規ドメイン(company.co.jp)で、SPF/DKIM/DMARCがすべて完全PASS。',
        'リンク先は自社内部ポータルの社内ネットワーク限定URL。',
        '個人情報の要求や怪しい添付ファイルはなく、訓練の講評と感謝の連絡。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '自社正規ドメイン・正規アドレス',
        '送信ドメイン認証(SPF/DKIM/DMARC)の完全PASS',
        '自社ポータル正規リンク',
        '業務に即した正当な報告文'
      ],
      bestPractice: 'CSIRTやセキュリティに関するメールであっても、内容とヘッダーが正常であれば業務に必要な正規メールです。「安全」と判定してください。'
    }
  },

  // ===== DAY 1 ADDITIONAL LEGITIMATE EMAILS =====
  {
    id: 'd1-08',
    day: 1,
    difficulty: 'EASY',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (日本郵便 EMS配達完了通知)',
    senderDisplayName: '日本郵便 配達完了通知サービス',
    senderEmail: 'ems-delivery-notice@post.japanpost.jp',
    senderDomain: 'post.japanpost.jp',
    officialDomain: 'post.japanpost.jp',
    recipient: 'logistics@company.co.jp',
    subject: '【郵便局】国際スピード郵便（EMS）お届け完了のお知らせ（お問合せ番号: EJ-9921-8841-JP）',
    receivedAt: '2026-10-28 17:10:05',
    body: `日本郵便をご利用いただき、ありがとうございます。

お客様よりご依頼いただきました下記郵便物のお届けが完了いたしましたのでお知らせいたします。

■ お問い合わせ番号：EJ-9921-8841-JP
■ 郵便物種別：EMS（国際スピード郵便）
■ お届け日時：2026年10月28日 16:45
■ 配達先：フロンティア 海外事業部 ロサンゼルス支社
■ 受領者サイン：J. Smith（署名受領済）

詳細な配達履歴につきましては、郵便追跡サービスよりご確認いただけます。

日本郵便 郵便追跡サービス:
https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=EJ99218841JP

※本メールは送信専用です。心当たりのない場合は最寄りの郵便局までお問い合わせください。

日本郵便株式会社
〒100-8792 東京都千代田区大手町二丁目3番1号`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://trackings.post.japanpost.jp/services/...',
        reason: '日本郵便の正規追跡サブドメイン(post.japanpost.jp)であり、表示とリンク先も一致しています。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=EJ99218841JP',
        targetUrl: 'https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=EJ99218841JP',
        domain: 'post.japanpost.jp',
        isMismatch: false,
        isSuspicious: false,
        destinationPreview: '日本郵便 郵便追跡システム（配達完了履歴表示）',
        sslCert: { issuer: 'DigiCert Global Root G2', isValid: true, daysOld: 980 },
        whoisAgeDays: 6200
      }
    ],
    attachments: [],
    headers: {
      from: '"日本郵便 配達完了通知サービス" <ems-delivery-notice@post.japanpost.jp>',
      fromDisplayName: '日本郵便 配達完了通知サービス',
      returnPath: 'bounce-ems@post.japanpost.jp',
      to: 'logistics@company.co.jp',
      subject: '【郵便局】国際スピード郵便（EMS）お届け完了のお知らせ（お問合せ番号: EJ-9921-8841-JP）',
      date: 'Wed, 28 Oct 2026 17:10:05 +0900',
      messageId: '<japanpost-ems-20261028-99120@post.japanpost.jp>',
      spf: { status: 'PASS', clientIp: '133.162.240.12', details: '日本郵便公式メールサーバーからの配信でPASS。' },
      dkim: { status: 'PASS', domain: 'post.japanpost.jp', details: '日本郵便のRSA署名が検証されました。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARC(p=reject)に完全合致。' },
      hops: [{ by: 'mail.company.co.jp', from: 'mail.post.japanpost.jp', timestamp: '17:10:05', country: 'Japan' }]
    },
    domainAnalysis: {
      domainName: 'post.japanpost.jp',
      isTyposquat: false,
      domainAge: '18年',
      registrar: 'JPRS',
      notes: '日本郵便株式会社の正規ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '公式日本郵便配信アドレスです。' },
    explanation: {
      summary: '日本郵便からのEMS国際郵便配達完了に関する正規の自動通知です。',
      keyPoints: [
        '公式ドメイン「post.japanpost.jp」から発信され、SPF/DKIM/DMARCがすべて完全PASS。',
        '表示URLとリンク先が一致し、個人情報やカード番号の入力を促す不審なフォームはありません。',
        '正当な業務の荷物受領通知です。'
      ],
      threatIndicators: [],
      safeIndicators: ['日本郵便公式ドメイン', '完全な送信ドメイン認証PASS', '正規追跡URL'],
      bestPractice: '運送・配達通知であっても、正規ドメインと電子署名が適合していれば業務に必要な正常メールです。正しく「安全なメール」として承認してください。'
    }
  },

  // ===== DAY 2 ADDITIONAL LEGITIMATE EMAILS =====
  {
    id: 'd2-08',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (銀行公式定期メンテナンス告知)',
    senderDisplayName: '三菱UFJ銀行 法人サービス窓口',
    senderEmail: 'biz-info@mufg.jp',
    senderDomain: 'mufg.jp',
    officialDomain: 'mufg.jp',
    recipient: 'accounting-team@company.co.jp',
    subject: '【重要】BizSTATION 法人向けインターネットバンキング システムメンテナンスのお知らせ',
    receivedAt: '2026-10-29 14:15:00',
    body: `株式会社フロンティア
経理財務部 ご担当者様

いつも三菱UFJ銀行をご利用いただき、誠にありがとうございます。

弊社法人向けインターネットバンキングサービス「BizSTATION」におきまして、安定稼働およびセキュリティ機能強化を目的とした定期システムメンテナンスを下記日時にて実施いたします。

メンテナンス期間中は、すべてのオンライン取引（送金・照会・外国為替・一括伝送）が一時的にご利用いただけなくなります。

■ メンテナンス実施日時:
2026年11月8日（日）00:00 〜 06:00（予定）

※本メールにはログイン画面への直接リンクは掲載しておりません。
日常のお取引は、あらかじめブラウザに登録された公式ブックマーク、または当行公式ホームページ（https://www.bk.mufg.jp）よりお進みください。

株式会社三菱UFJ銀行
東京都千代田区丸の内2-7-1`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '本メールにはログイン画面への直接リンクは掲載しておりません。あらかじめブラウザに登録された公式ブックマークよりお進みください。',
        reason: '金融機関の最高水準のセキュリティ運用基準に沿っており、メール内にログイン用リンクを置かない安全設計です。',
        isSuspicious: false
      }
    ],
    urls: [],
    attachments: [],
    headers: {
      from: '"三菱UFJ銀行 法人サービス窓口" <biz-info@mufg.jp>',
      fromDisplayName: '三菱UFJ銀行 法人サービス窓口',
      returnPath: 'bounce-biz@mufg.jp',
      to: 'accounting-team@company.co.jp',
      subject: '【重要】BizSTATION 法人向けインターネットバンキング システムメンテナンスのお知らせ',
      date: 'Thu, 29 Oct 2026 14:15:00 +0900',
      messageId: '<mufg-bizstation-notif-202610-8812@mail.mufg.jp>',
      spf: { status: 'PASS', clientIp: '150.249.200.15', details: '三菱UFJ銀行公式データセンターIPから発信。' },
      dkim: { status: 'PASS', domain: 'mufg.jp', details: '三菱UFJ銀行の正規暗号鍵で署名されています。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARC(p=reject)に完全合致。' },
      hops: [{ by: 'mail.company.co.jp', from: 'gateway.mufg.jp', timestamp: '14:15:00', country: 'Japan' }]
    },
    domainAnalysis: {
      domainName: 'mufg.jp',
      isTyposquat: false,
      domainAge: '20年',
      registrar: 'JPRS',
      notes: '三菱UFJフィナンシャル・グループの正規ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '公式の銀行ドメインです。' },
    explanation: {
      summary: '三菱UFJ銀行からの法人向けインターネットバンキング計画メンテナンスの正規通知です。',
      keyPoints: [
        '「mufg.jp」正規ドメインから発信され、SPF/DKIM/DMARCがすべて完全PASS。',
        'メール内にログインリンクを一切置かず、公式ブックマークの利用を促す最高安全基準の運用。',
        'パスワードや口座暗証番号、ワンタイムトークンの入力要求は一切なし。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '銀行公式ドメインからの送信',
        '完全なSPF/DKIM/DMARC PASS',
        '外部リンクを貼らない安全な案内方針',
        '金融取引の通常告知'
      ],
      bestPractice: '銀行名がついたメールを無条件に危険と誤判定してはいけません。本メールのようにログインリンクを貼らず公式ドメイン認証がPASSしているものは「安全なメール」として承認してください。'
    }
  },

  // ===== DAY 3 ADDITIONAL LEGITIMATE EMAILS =====
  {
    id: 'd3-08',
    day: 3,
    difficulty: 'HARD',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (取引先月次正規請求書送付)',
    senderDisplayName: 'ヤマダ商事株式会社 営業部 佐々木',
    senderEmail: 'm-sasaki@yamada-shoji.co.jp',
    senderDomain: 'yamada-shoji.co.jp',
    officialDomain: 'yamada-shoji.co.jp',
    recipient: 'purchasing-team@company.co.jp',
    subject: '【請求書送付】10月分Webマーケティング保守運用費用のご請求書（ヤマダ商事）',
    receivedAt: '2026-10-30 15:30:00',
    body: `株式会社フロンティア
購買部 御中

いつも大変お世話になっております。ヤマダ商事の佐々木です。

2026年10月分のWebマーケティング保守運用業務が完了いたしましたので、
当月度のご請求書（PDF）を添付にてお送りいたします。

■ ご請求件名: 2026年10月度 Web運用保守およびSEO対策支援費用
■ ご請求金額: ¥1,320,000-（税込）
■ お振込期日: 2026年11月30日（月）
■ お振込先: 貴社登録済みの弊社三井住友銀行口座（※口座変更はございません）

内容をご確認いただき、お支払いのお手続きをお願い申し上げます。
ご不明な点がございましたら、担当の佐々木まで内線またはメールにてご連絡ください。

添付ファイル：
・請求書_YM202610_フロンティア様御中.pdf

何卒よろしくお願い申し上げます。

--------------------------------------------------
ヤマダ商事株式会社 デジタルソリューション事業部
佐々木 昌宏 (Masahiro Sasaki)
Email: m-sasaki@yamada-shoji.co.jp
電話: 03-3456-7890 / FAX: 03-3456-7891
〒108-0075 東京都港区港南2-16-1 品川イーストビル12F
--------------------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'お振込先: 貴社登録済みの弊社三井住友銀行口座（※口座変更はございません）',
        reason: 'BEC(振込先変更詐欺)と異なり、登録済み既存口座への入金を明記し、口座変更がないことを明言しています。',
        isSuspicious: false
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '請求書_YM202610_フロンティア様御中.pdf',
        fileSize: '380 KB',
        fileType: 'Adobe Acrobat PDF Document',
        isSuspicious: false,
        suspicionReason: undefined,
        staticScan: {
          trueMimeType: 'application/pdf',
          hasMacros: false,
          hasHiddenExtension: false,
          entropyScore: 3.4,
          antivirusDetection: 'Clean (脅威なし・正規のデジタル印鑑付きPDF)'
        }
      }
    ],
    headers: {
      from: '"ヤマダ商事株式会社 営業部 佐々木" <m-sasaki@yamada-shoji.co.jp>',
      fromDisplayName: 'ヤマダ商事株式会社 営業部 佐々木',
      returnPath: 'm-sasaki@yamada-shoji.co.jp',
      to: 'purchasing-team@company.co.jp',
      subject: '【請求書送付】10月分Webマーケティング保守運用費用のご請求書（ヤマダ商事）',
      date: 'Fri, 30 Oct 2026 15:30:00 +0900',
      messageId: '<yamada-shoji-inv-202610-88124@mail.yamada-shoji.co.jp>',
      spf: { status: 'PASS', clientIp: '210.140.88.19', details: '取引先「yamada-shoji.co.jp」の正規SPF許可IPから発信。' },
      dkim: { status: 'PASS', domain: 'yamada-shoji.co.jp', details: 'ヤマダ商事の正規DKIM公開鍵で署名検証済み。' },
      dmarc: { status: 'PASS', policy: 'quarantine', details: 'DMARCに完全合致。' },
      hops: [{ by: 'mail.company.co.jp', from: 'mail.yamada-shoji.co.jp', timestamp: '15:30:00', country: 'Japan' }]
    },
    domainAnalysis: {
      domainName: 'yamada-shoji.co.jp',
      isTyposquat: false,
      officialEquivalent: 'yamada-shoji.co.jp',
      domainAge: '12年',
      registrar: 'JPRS',
      notes: '取引先マスターに登録されている正規の「yamada-shoji.co.jp」です。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '正規取引先アドレス帳の担当者と完全に一致。' },
    explanation: {
      summary: '長年取引のある正規パートナー企業からの月次請求書送付メールです。',
      keyPoints: [
        '送信元ドメインは正規の「yamada-shoji.co.jp」で、SPF/DKIM/DMARCがすべて完全PASS。',
        '振込先口座の変更はなく、登録済みの口座情報と一致。',
        '添付ファイルはクリーンな正規PDF（マクロなし・二重拡張子なし）。'
      ],
      threatIndicators: [],
      safeIndicators: [
        '取引先マスター登録ドメイン・アドレス',
        'SPF/DKIMの完全PASS',
        '振込先口座変更なしの明記',
        'クリーンな正規PDF請求書'
      ],
      bestPractice: 'Day 1で登場した「yamada-shoji-group.jp」の二重拡張子偽物と対比される、本物の取引先請求書です。正当な請求書を誤ってブロックすると取引先との信頼関係を毀損するため、「安全なメール」として承認してください。'
    }
  },

  // ===== DAY 1 NEW SCENARIOS (DELIVERY PHISHING & COUNTERPART) =====
  {
    id: 'd1-09',
    day: 1,
    difficulty: 'EASY',
    isThreat: true,
    category: 'DELIVERY_PHISH',
    categoryTitle: '配達通知型フィッシング (佐川急便 不在連絡偽装)',
    senderDisplayName: '佐川急便 お荷物お届け通知',
    senderEmail: 'notice@sagawa-exp.co.jp.package-query.top',
    senderDomain: 'sagawa-exp.co.jp.package-query.top',
    officialDomain: 'sagawa-exp.co.jp',
    recipient: 'general-affairs@company.co.jp',
    subject: '【佐川急便】お客様宛てのお荷物をお届けにあがりましたが、宛先不明のため保管しております',
    receivedAt: '2026-10-28 17:35:10',
    body: `佐川急便をご利用いただき、誠にありがとうございます。

本日、お客様宛てにお荷物（伝票番号: 4892-1082-9901）をお届けに上がりましたが、ご不在またはお届け先住所の一部に不備があったため、最寄りの配送センターにて一時保管しております。

荷物の保管期限は【本日より3日間】となっております。
再配達のご希望、またはお届け先住所の確認・訂正につきましては、誠に恐れ入りますが下記ポータルより直ちにお手続きをお願い申し上げます。

■ 佐川急便 お荷物お届け状況の確認・再配達依頼
https://www.sagawa-exp.co.jp.package-query.top/delivery/confirm.html

※期限を過ぎますとお荷物は送り主様へ返送となりますのでご注意ください。

佐川急便株式会社
京都府京都市南区上鳥羽角田町68番地`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://www.sagawa-exp.co.jp.package-query.top/...',
        reason: '佐川急便の正規ドメイン「sagawa-exp.co.jp」をホスト名に含ませていますが、真のドメインは「package-query.top」です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '宛先不明のため保管しております',
        reason: '宅配便不在通知を装い、住所入力と称してApple IDやクレジットカード番号を詐取する典型的な不在通知フィッシング文面です。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://www.sagawa-exp.co.jp.package-query.top/delivery/confirm.html',
        targetUrl: 'https://www.sagawa-exp.co.jp.package-query.top/delivery/confirm.html',
        domain: 'package-query.top',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: '佐川急便公式サイトではありません。Apple IDやGoogleアカウントの認証情報、またはクレジットカード番号を入力させる偽画面です。',
        destinationPreview: '佐川急便そっくりの偽再配達画面（Apple ID/クレジットカード入力フォーム）',
        sslCert: { issuer: "Let's Encrypt Authority X3", isValid: true, daysOld: 1 },
        whoisAgeDays: 1
      }
    ],
    attachments: [],
    headers: {
      from: '"佐川急便 お荷物お届け通知" <notice@sagawa-exp.co.jp.package-query.top>',
      fromDisplayName: '佐川急便 お荷物お届け通知',
      returnPath: 'bounce@package-query.top',
      to: 'general-affairs@company.co.jp',
      subject: '【佐川急便】お客様宛てのお荷物をお届けにあがりましたが、宛先不明のため保管しております',
      date: 'Wed, 28 Oct 2026 17:35:10 +0900',
      messageId: '<sagawa-delivery-88192@package-query.top>',
      spf: { status: 'PASS', clientIp: '185.196.220.18', details: '攻撃者の専用VPSサーバーから発信。' },
      dkim: { status: 'NONE', domain: '', details: '未署名' },
      dmarc: { status: 'NONE', policy: 'none', details: '佐川急便正規DMARCとは無関係' },
      hops: [{ by: 'mail.company.co.jp', from: 'host.package-query.top', timestamp: '17:35:10', country: 'Lithuania' }]
    },
    domainAnalysis: {
      domainName: 'package-query.top',
      isTyposquat: true,
      officialEquivalent: 'sagawa-exp.co.jp',
      domainAge: '昨日取得 (1日前)',
      registrar: 'Nicenic International Group Co., Ltd.',
      notes: '佐川急便公式ドメイン(sagawa-exp.co.jp)ではなく、前日に取得された安価な「.top」フィッシングドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: '公式の佐川急便アドレスではありません。' },
    explanation: {
      summary: '国内でSMSおよびメールで最も被害の多い、宅配業者（佐川急便）を騙る配達通知型フィッシングです。',
      keyPoints: [
        'サブドメインに「sagawa-exp.co.jp」を配置していますが、本質ドメインは末尾「package-query.top」。',
        '「宛先不明」「3日以内に返送」と焦らせ、偽画面でApple IDやクレカ情報を盗み取ります。',
        '佐川急便公式のDKIM署名やDMARCレコードが存在しません。'
      ],
      threatIndicators: [
        'サブドメイン偽装 (.sagawa-exp.co.jp.package-query.top)',
        '安価な使い捨て「.top」ドメイン',
        '荷物受け取りに無関係な認証情報・決済情報の要求',
        'DKIM/DMARCの欠如'
      ],
      safeIndicators: [],
      bestPractice: '不在連絡やお届け通知が届いた場合は、メール内のリンクを開かず、公式アプリまたはブックマークした公式サイトから伝票番号を直接入力して確認しましょう。'
    }
  },

  {
    id: 'd1-10',
    day: 1,
    difficulty: 'EASY',
    isThreat: false,
    category: 'LEGITIMATE',
    categoryTitle: '正規メール (佐川急便 公式法人集荷完了通知)',
    senderDisplayName: '佐川急便 スマートクラブ',
    senderEmail: 'pickup-notice@sagawa-exp.co.jp',
    senderDomain: 'sagawa-exp.co.jp',
    officialDomain: 'sagawa-exp.co.jp',
    recipient: 'logistics@company.co.jp',
    subject: '【佐川急便】Web集荷受付サービス 集荷完了のお知らせ（受付番号: SG-20261028-4412）',
    receivedAt: '2026-10-28 18:00:15',
    body: `株式会社フロンティア
物流管理課 御中

いつも佐川急便をご利用いただき、誠にありがとうございます。
本日ご依頼いただきました集荷業務が正常に完了いたしましたのでお知らせいたします。

■ 受付番号：SG-20261028-4412
■ 集荷日時：2026年10月28日 17:30
■ 集荷個数：飛脚宅配便 14個
■ 担当営業所：品川営業所（担当ドライバー：小林）

お荷物の詳細な輸送状況につきましては、佐川急便公式お荷物問い合わせサービスよりご確認いただけます。

佐川急便 お荷物問い合わせサービス:
https://k2k.sagawa-exp.co.jp/p/sagawa/web/okurijoinput.jsp

※本メールは送信専用です。お問い合わせは担当営業所までご連絡ください。

佐川急便株式会社
お客様サービス相談窓口`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'https://k2k.sagawa-exp.co.jp/p/sagawa/web/okurijoinput.jsp',
        reason: '佐川急便の公式貨物追跡サブドメイン(k2k.sagawa-exp.co.jp)です。',
        isSuspicious: false
      }
    ],
    urls: [
      {
        displayText: 'https://k2k.sagawa-exp.co.jp/p/sagawa/web/okurijoinput.jsp',
        targetUrl: 'https://k2k.sagawa-exp.co.jp/p/sagawa/web/okurijoinput.jsp',
        domain: 'sagawa-exp.co.jp',
        isMismatch: false,
        isSuspicious: false,
        destinationPreview: '佐川急便公式 お荷物問い合わせサービス画面',
        sslCert: { issuer: 'Cybertrust Japan SureServer CA G4', isValid: true, daysOld: 600 },
        whoisAgeDays: 8500
      }
    ],
    attachments: [],
    headers: {
      from: '"佐川急便 スマートクラブ" <pickup-notice@sagawa-exp.co.jp>',
      fromDisplayName: '佐川急便 スマートクラブ',
      returnPath: 'bounce-pickup@sagawa-exp.co.jp',
      to: 'logistics@company.co.jp',
      subject: '【佐川急便】Web集荷受付サービス 集荷完了のお知らせ（受付番号: SG-20261028-4412）',
      date: 'Wed, 28 Oct 2026 18:00:15 +0900',
      messageId: '<sagawa-pickup-20261028-9901@sagawa-exp.co.jp>',
      spf: { status: 'PASS', clientIp: '210.150.120.45', details: '佐川急便公式送信サーバーからPASS。' },
      dkim: { status: 'PASS', domain: 'sagawa-exp.co.jp', details: '佐川急便の電子署名が有効です。' },
      dmarc: { status: 'PASS', policy: 'reject', details: 'DMARC(p=reject)に完全適合。' },
      hops: [{ by: 'mail.company.co.jp', from: 'mail.sagawa-exp.co.jp', timestamp: '18:00:15', country: 'Japan' }]
    },
    domainAnalysis: {
      domainName: 'sagawa-exp.co.jp',
      isTyposquat: false,
      domainAge: '24年',
      registrar: 'JPRS',
      notes: '佐川急便株式会社の正規公式ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: true, anomalyDetected: false, notes: '公式佐川急便集荷通知アドレスです。' },
    explanation: {
      summary: '佐川急便からの正規の集荷完了通知です。d1-09の偽不在通知と対比される本物の業務メールです。',
      keyPoints: [
        '正規ドメイン「sagawa-exp.co.jp」から発信され、SPF/DKIM/DMARCがすべて完全PASS。',
        '自社が当日依頼した正規の集荷個数と営業所情報が正しく記載されている。',
        'リンク先は佐川公式の送り状追跡システムで不審なリダイレクトなし。'
      ],
      threatIndicators: [],
      safeIndicators: ['佐川急便正規ドメイン', '完全なSPF/DKIM/DMARC PASS', '正規荷物追跡URL'],
      bestPractice: '運送会社のメールであっても、公式ドメイン認証がすべてPASSしていれば安全な正規業務連絡です。正しく承認してください。'
    }
  },

  // ===== DAY 2 NEW SCENARIOS (SEXTORTION BLACKMAIL & GOOGLE LOGIN PHISHING) =====
  {
    id: 'd2-09',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'SEXTORTION_BLACKMAIL',
    categoryTitle: '恐喝・脅迫型詐欺 (セクストーション / Sextortion & Blackmail)',
    senderDisplayName: 'Cyber Sec Alert Team',
    senderEmail: 'blackhat-ops@dark-recon.net',
    senderDomain: 'dark-recon.net',
    officialDomain: undefined,
    recipient: 'sec-analyst@company.co.jp',
    subject: '【極秘警告】あなたのシステムは侵害されました。個人データおよびWebカメラ録画の流出について',
    receivedAt: '2026-10-29 18:20:00',
    body: `ご挨拶。

残念ながら、あなたのプライベートな秘密はもはや秘密ではありません。
数週間前、あなたのパソコンにRAT（リモートアクセス型トロイの木馬）を埋め込みました。

あなたがアダルトサイトや機密性の高いウェブサイトを閲覧している間の、画面録画およびフロントWebカメラからの映像を完全に保存しています。
あなたの社内連絡先、メーリングリスト、およびLinkedInの同僚リストもすべて抽出済みです。

この不名誉な動画を会社の全社員および取引先へ一斉送信されたくなければ、
本メール受信後【48時間以内】に下記のビットコインウォレットへ 1,500 USD相当（0.025 BTC）を送金してください。

ビットコイン送金先アドレス (BTC):
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

着金が確認でき次第、録画データおよびあなたのデータはサーバーから完全消去されます。
警察や誰かに相談した場合、その瞬間に動画は即座に公開されます。タイマーは作動しています。`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'ビットコイン送金先アドレス (BTC): 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        reason: '足がつかない仮想通貨（Bitcoin）を指定して金銭を脅し取る典型的なセクストーション（性的脅迫・恐喝型詐欺）の手口です。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: '会社の全社員および取引先へ一斉送信されたくなければ、本メール受信後【48時間以内】に',
        reason: '実際にはカメラのハッキングなど行われておらず、心理的恐怖（羞恥心）でパニックに陥れて送金させる完全なブラフ（偽りの脅し）です。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [],
    headers: {
      from: '"Cyber Sec Alert Team" <blackhat-ops@dark-recon.net>',
      fromDisplayName: 'Cyber Sec Alert Team',
      returnPath: 'bounce@dark-recon.net',
      to: 'sec-analyst@company.co.jp',
      subject: '【極秘警告】あなたのシステムは侵害されました。個人データおよびWebカメラ録画の流出について',
      date: 'Thu, 29 Oct 2026 18:20:00 +0900',
      messageId: '<blackmail-extort-99120@dark-recon.net>',
      spf: { status: 'PASS', clientIp: '193.106.191.88', details: '攻撃者の専用サーバーから発信。' },
      dkim: { status: 'NONE', domain: '', details: '未署名' },
      dmarc: { status: 'NONE', policy: 'none', details: '未設定' },
      hops: [{ by: 'mail.company.co.jp', from: 'relay.dark-recon.net', timestamp: '18:20:00', country: 'Seychelles' }]
    },
    domainAnalysis: {
      domainName: 'dark-recon.net',
      isTyposquat: false,
      domainAge: '6日前',
      registrar: 'NameSilo, LLC',
      notes: '攻撃者が最近取得した使い捨てドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: '脅迫型スパム送信専用アドレスです。' },
    explanation: {
      summary: 'Webカメラのハッキング録画を口実にビットコインを要求する、典型的な恐喝・脅迫型詐欺（セクストーション）です。',
      keyPoints: [
        '実際にはカメラはハッキングされておらず、不特定多数に送りつける心理的ブラフです。',
        '「48時間以内にBitcoin送金」「同僚に動画を送る」と恐怖と羞恥心を煽る。',
        '絶対に要求に応じず（金銭を支払わず）、直ちに隔離・通報すべき悪質メール。'
      ],
      threatIndicators: [
        '仮想通貨（ビットコイン）による身代金要求',
        'Webカメラ録画や秘密暴露を盾にした恐喝',
        '相談の口止めと48時間のタイムリミット',
        'ダークウェブ関連の新設不審ドメイン'
      ],
      safeIndicators: [],
      bestPractice: 'セクストーションメールに書かれている内容は全て嘘（ハッタリ）です。返信したり送金したりせず、直ちに「危険なメール」として隔離・破棄してください。'
    }
  },

  {
    id: 'd2-11',
    day: 2,
    difficulty: 'NORMAL',
    isThreat: true,
    category: 'CREDENTIAL_PHISH',
    categoryTitle: '偽装ログイン型フィッシング (Google Workspace 認証偽装)',
    senderDisplayName: 'Google Workspace セキュリティ管理室',
    senderEmail: 'admin-alert@accounts.google.com.sso-verify-corp.net',
    senderDomain: 'accounts.google.com.sso-verify-corp.net',
    officialDomain: 'google.com',
    recipient: 'all-staff@company.co.jp',
    subject: '【緊急】Google Workspace 組織アカウントの同期エラーによる再認証のお願い',
    receivedAt: '2026-10-29 18:45:00',
    body: `Google Workspace 管理者チーム

お客様の組織アカウント（@company.co.jp）において、Googleクラウドとのセキュリティトークン同期エラーが発生いたしました。

24時間以内に認証情報の同期が確認されない場合、Gmail、Googleドライブ、Googleカレンダーのアクセス権限が一時的に制限されます。

下記のGoogle公式認証ポータルよりサインインを行い、アカウントの再検証を完了してください。

■ Google Workspace サインイン認証
https://accounts.google.com.sso-verify-corp.net/signin/v2/challenge

Google LLC
1600 Amphitheatre Parkway, Mountain View, CA 94043`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'accounts.google.com.sso-verify-corp.net',
        reason: 'サブドメインに「accounts.google.com」を並べた、精巧なGoogle偽装ログインフィッシングです。本質ドメインは「sso-verify-corp.net」です。',
        isSuspicious: true
      }
    ],
    urls: [
      {
        displayText: 'https://accounts.google.com.sso-verify-corp.net/signin/v2/challenge',
        targetUrl: 'https://accounts.google.com.sso-verify-corp.net/signin/v2/challenge',
        domain: 'sso-verify-corp.net',
        isMismatch: false,
        isSuspicious: true,
        suspicionReason: 'Googleの公式ドメイン(google.com)ではありません。Google WorkspaceのID・パスワード・2段階認証コードを中間搾取する偽サイトです。',
        destinationPreview: 'Google公式そっくりの偽ログイン画面（メールアドレス・パスワード入力）',
        sslCert: { issuer: "Let's Encrypt", isValid: true, daysOld: 3 },
        whoisAgeDays: 3
      }
    ],
    attachments: [],
    headers: {
      from: '"Google Workspace セキュリティ管理室" <admin-alert@accounts.google.com.sso-verify-corp.net>',
      fromDisplayName: 'Google Workspace セキュリティ管理室',
      returnPath: 'bounce@sso-verify-corp.net',
      to: 'all-staff@company.co.jp',
      subject: '【緊急】Google Workspace 組織アカウントの同期エラーによる再認証のお願い',
      date: 'Thu, 29 Oct 2026 18:45:00 +0900',
      messageId: '<google-sso-err-99182@sso-verify-corp.net>',
      spf: { status: 'PASS', clientIp: '185.220.101.40', details: '攻撃者サーバーから発信。' },
      dkim: { status: 'NONE', domain: '', details: 'Google公式のDKIM署名なし' },
      dmarc: { status: 'NONE', policy: 'none', details: 'Google正規DMARCとは無関係' },
      hops: [{ by: 'mail.company.co.jp', from: 'host.sso-verify-corp.net', timestamp: '18:45:00', country: 'Germany' }]
    },
    domainAnalysis: {
      domainName: 'sso-verify-corp.net',
      isTyposquat: true,
      officialEquivalent: 'google.com',
      domainAge: '3日前',
      registrar: 'PublicDomainRegistry',
      notes: 'サブドメインに「accounts.google.com」を並べた典型的な偽装ドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: 'Google公式(@google.com)ではありません。' },
    explanation: {
      summary: 'Google Workspaceのアカウント同期停止を口実に、社員のGoogleログイン情報を盗む偽装ログイン型フィッシングです。',
      keyPoints: [
        '「accounts.google.com」で始まるように見えますが、実体ドメインは「sso-verify-corp.net」。',
        'Googleの公式DKIM署名がなく、海外のホスティングから送信。',
        'IDとパスワードを入力すると企業全体のクラウドデータが侵害されます。'
      ],
      threatIndicators: ['サブドメイン偽装', '新設不審ドメイン', 'Google公式DKIMの欠如', '24時間以内の停止圧力'],
      safeIndicators: [],
      bestPractice: 'Googleアカウントへのログイン画面に遷移する際は、ドメインの末尾が「google.com」で終わっているかアドレスバーを厳格に確認してください。'
    }
  },

  // ===== DAY 3 NEW SCENARIOS (SPEAR PHISHING & THREAD HIJACKING CLONE) =====
  {
    id: 'd3-09',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'SPEAR_PHISHING',
    categoryTitle: '標的型攻撃（スピアフィッシング / Spear Phishing）',
    senderDisplayName: '株式会社ネクストテクノロジー 研究開発部 佐久間',
    senderEmail: 'sakuma-r_d@next-tech-innovations.co.jp',
    senderDomain: 'next-tech-innovations.co.jp',
    officialDomain: 'next-tech.co.jp',
    recipient: 'project-lead@company.co.jp',
    subject: '【極秘・技術資料】CEATECでお話しした新世代エッジAI開発「Project Atlas」共同検証仕様書ドラフトの送付',
    receivedAt: '2026-10-30 16:40:00',
    body: `株式会社フロンティア
先端技術開発部 プロジェクトAtlasリーダー様

お疲れ様です。先日のCEATEC 2026展示会にて名刺交換をさせていただきました、
株式会社ネクストテクノロジー 研究開発部の佐久間です。

その節は弊社のエッジAIプロセッサおよび貴社「Project Atlas」との共同検証について有意義なお時間をいただき誠にありがとうございました。

展示会場にてお約束いたしました「Project Atlas向け共同PoC技術検証仕様書（第1版ドラフト）」をまとめましたので、社外秘添付ファイルにてお送りいたします。

添付ファイル：
・ProjectAtlas_PoC_TechnicalSpec_v1.0.zip
（※解凍パスワードは、貴社の標準セキュリティ規則に基づき「frontier2026」に設定しております）

極秘情報を含みますため、プロジェクト関係者のみでご確認いただき、ご意見をいただけますと幸いです。

何卒よろしくお願い申し上げます。

--------------------------------------------------
株式会社ネクストテクノロジー
研究開発統括本部 次世代アーキテクチャ研究課
佐久間 雄介 (Yusuke Sakuma)
Email: sakuma-r_d@next-tech-innovations.co.jp
電話: 03-6890-XXXX / 内線: 4421
--------------------------------------------------`,
    bodyPhrases: [
      {
        id: 'p1',
        text: 'ProjectAtlas_PoC_TechnicalSpec_v1.0.zip',
        reason: '実在の自社極秘プロジェクト名「Project Atlas」と実在の展示会名を引用し、警戒心を解いてパスワード付きZIP内のマルウェアを実行させようとする極めて危険な標的型（スピアフィッシング）メールです。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'next-tech-innovations.co.jp',
        reason: '取引先パートナー「ネクストテクノロジー」の正規ドメインは「next-tech.co.jp」ですが、「-innovations.co.jp」という偽ドメインが海外で取得されています。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: 'ProjectAtlas_PoC_TechnicalSpec_v1.0.zip',
        fileSize: '2.4 MB',
        fileType: 'Compressed ZIP Archive (Password Protected)',
        isSuspicious: true,
        suspicionReason: 'パスワード保護されたZIPアーカイブです。内部を展開すると「ProjectAtlas_Spec.pdf.lnk (悪意あるショートカットファイル)」が格納されており、PowerShell経由でバックドアを設置します。',
        staticScan: {
          trueMimeType: 'application/zip',
          hasMacros: false,
          hasHiddenExtension: true,
          entropyScore: 8.9,
          antivirusDetection: 'LNK.TrojanDownloader.CobaltStrike (極めて危険な標的型攻撃ツールを検出)'
        }
      }
    ],
    headers: {
      from: '"株式会社ネクストテクノロジー 研究開発部 佐久間" <sakuma-r_d@next-tech-innovations.co.jp>',
      fromDisplayName: '株式会社ネクストテクノロジー 研究開発部 佐久間',
      returnPath: 'bounce@next-tech-innovations.co.jp',
      to: 'project-lead@company.co.jp',
      subject: '【極秘・技術資料】CEATECでお話しした新世代エッジAI開発「Project Atlas」共同検証仕様書ドラフトの送付',
      date: 'Fri, 30 Oct 2026 16:40:00 +0900',
      messageId: '<next-tech-spear-202610-8812@next-tech-innovations.co.jp>',
      spf: { status: 'PASS', clientIp: '194.26.29.112', details: '攻撃者の専用ホスティングから発信。' },
      dkim: { status: 'NONE', domain: '', details: '正規ネクストテクノロジーの署名なし' },
      dmarc: { status: 'NONE', policy: 'none', details: 'DMARC未設定' },
      hops: [{ by: 'mail.company.co.jp', from: 'smtp.next-tech-innovations.co.jp', timestamp: '16:40:00', country: 'Bulgaria' }]
    },
    domainAnalysis: {
      domainName: 'next-tech-innovations.co.jp',
      isTyposquat: true,
      officialEquivalent: 'next-tech.co.jp',
      domainAge: '7日前',
      registrar: 'GMO Internet Group, Inc.',
      notes: '正規取引先「next-tech.co.jp」に「-innovations」を付加した偽ドメインが7日前に取得されています。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: '名刺交換相手の正規ドメインと不一致。' },
    explanation: {
      summary: '実在の極秘プロジェクト名と展示会参加情報を事前調査して仕掛けられた、最高危険度の標的型攻撃（スピアフィッシング）です。',
      keyPoints: [
        '本文の内容やプロジェクト名は極めて具体的ですが、送信元ドメインは1週間前に作られた偽ドメイン。',
        'セキュリティフィルターによる検知を逃れるため、パスワード付きZIPで悪性LNKファイルを隠蔽。',
        '開封すると社内ネットワークにCobalt Strike（侵入遠隔操作ツール）が展開される。'
      ],
      threatIndicators: [
        '特定プロジェクト・展示会を騙るスピアフィッシング',
        '取引先の類似偽ドメイン (-innovations)',
        'パスワード付きZIPによる検知回避',
        'CobaltStrikeマルウェアの検出'
      ],
      safeIndicators: [],
      bestPractice: '進行中のプロジェクト名が書かれていても、ドメインが正規取引先マスターと1文字でも違っていれば標的型攻撃です。別経路（電話）で名刺の番号に確認を行ってください。'
    }
  },

  {
    id: 'd3-10',
    day: 3,
    difficulty: 'HARD',
    isThreat: true,
    category: 'THREAD_HIJACK_CLONE',
    categoryTitle: '会話スレッド乗っ取り・返信偽装型 (Thread Hijacking / Clone Phishing)',
    senderDisplayName: '株式会社フロンティア 取締役CSO 伊藤',
    senderEmail: 'ito-cso-frontier@vps-cloud-tokyo.org',
    senderDomain: 'vps-cloud-tokyo.org',
    officialDomain: 'company.co.jp',
    recipient: 'planning-dept@company.co.jp',
    subject: 'Re: 2026年第4四半期 経営戦略会議 検討資料のお伺い',
    receivedAt: '2026-10-30 17:15:20',
    body: `企画部の皆様

先ほどの件ですが、役員会で指摘のあった追加修正部分のファイルを反映いたしました。
パスワード付き圧縮ファイルにてお送りしますので、内容をご確認いただき、月曜日の会議までに反映をお願いいたします。

添付ファイル：
・2026Q4_経営戦略修正資料_確定版.zip
（解凍パスワード: frontier99）

以上、よろしくお願いいたします。

伊藤 敬之
株式会社フロンティア 取締役 最高戦略責任者 (CSO)

--------------------------------------------------
> 2026年10月29日 15:30 伊藤 取締役 <ito@company.co.jp>:
> 企画部各位
> 昨日の戦略会議アジェンダについて、第3項目の市場成長予測データのアップデートをお願いできますでしょうか。
> 今週金曜夕方までに草案をまとめていただけますと幸いです。
> よろしくお願いいたします。
> -----------------------------------------
> 伊藤 敬之 / 株式会社フロンティア 取締役CSO`,
    bodyPhrases: [
      {
        id: 'p1',
        text: '> 2026年10月29日 15:30 伊藤 取締役 <ito@company.co.jp>:',
        reason: '過去に実際に交わされた本物の社内メールスレッドの文面を引用（クローン）し、あたかもその返信であるかのように偽装しています。',
        isSuspicious: true
      },
      {
        id: 'p2',
        text: 'ito-cso-frontier@vps-cloud-tokyo.org',
        reason: '役員の正規社内アドレス(@company.co.jp)ではなく、外部のVPSサーバーアドレスから送信されています。',
        isSuspicious: true
      }
    ],
    urls: [],
    attachments: [
      {
        fileName: '2026Q4_経営戦略修正資料_確定版.zip',
        fileSize: '1.9 MB',
        fileType: 'Compressed ZIP Archive',
        isSuspicious: true,
        suspicionReason: 'Emotet / Qakbot系のスレッドハイジャック型ウイルスです。ZIP内のWord文書(.doc)に不正マクロが仕込まれています。',
        staticScan: {
          trueMimeType: 'application/zip',
          hasMacros: true,
          hasHiddenExtension: false,
          entropyScore: 8.6,
          antivirusDetection: 'Trojan.W97M.Emotet.Gen (スレッド乗っ取りマルウェア)'
        }
      }
    ],
    headers: {
      from: '"株式会社フロンティア 取締役CSO 伊藤" <ito-cso-frontier@vps-cloud-tokyo.org>',
      fromDisplayName: '株式会社フロンティア 取締役CSO 伊藤',
      returnPath: 'bounce@vps-cloud-tokyo.org',
      to: 'planning-dept@company.co.jp',
      subject: 'Re: 2026年第4四半期 経営戦略会議 検討資料のお伺い',
      date: 'Fri, 30 Oct 2026 17:15:20 +0900',
      messageId: '<re-strat-hijack-8891@vps-cloud-tokyo.org>',
      spf: { status: 'PASS', clientIp: '154.21.88.22', details: '外部VPSサーバーから送信。自作ドメインのSPFはPASS。' },
      dkim: { status: 'NONE', domain: '', details: '自社DKIM署名なし' },
      dmarc: { status: 'FAIL', policy: 'reject', details: '自社ドメインcompany.co.jpの署名不一致' },
      hops: [{ by: 'mail.company.co.jp', from: 'vps-cloud-tokyo.org', timestamp: '17:15:20', country: 'Japan (VPS)' }]
    },
    domainAnalysis: {
      domainName: 'vps-cloud-tokyo.org',
      isTyposquat: false,
      domainAge: '10日前',
      registrar: 'GMO Internet Group, Inc.',
      notes: '自社ドメイン(company.co.jp)とは無関係な第三者VPSドメインです。'
    },
    addressAnalysis: { displayNameVsEmailMatch: false, anomalyDetected: true, notes: '役員名を名乗り過去スレッドを引用していますが、実送信アドレスは自社外のVPSアドレスです。' },
    explanation: {
      summary: '実在の過去メールやり取りを盗用・引用し、返信に見せかけてマルウェア（Emotet）を送りつける会話スレッド乗っ取り（クローンフィッシング）です。',
      keyPoints: [
        '「Re:」と過去の本物のやり取りが引用されているため、社員が最も騙されやすい危険な手口。',
        '表示名は役員ですが、送信アドレスは「vps-cloud-tokyo.org」という全く無関係な外部VPS。',
        '添付ZIPファイル内の文書を開くとマクロが作動し、社内全体へ感染が拡大します。'
      ],
      threatIndicators: [
        '過去メールの引用（会話スレッド乗っ取り）',
        '社内役員名と外部VPSアドレスの乖離',
        '自社DKIM/DMARCのFAIL',
        'アンチウイルスによるEmotet検出'
      ],
      safeIndicators: [],
      bestPractice: '過去のメールの続きのように見えても、送信元アドレス（@company.co.jpであるか）を必ず確認してください。不審な外部アドレスからの返信は即座に隔離が必要です。'
    }
  }
];

import { applyChineseKanjiInjection } from '../utils/chineseKanji';

// Helper to get emails for a day and difficulty
export function getEmailsForSession(day: number, difficulty: Difficulty): EmailItem[] {
  // Cycle through available days if player goes beyond day 3
  const effectiveDay = ((day - 1) % 3) + 1;
  const filtered = EMAILS_DATABASE.filter(e => e.day === effectiveDay);
  
  if (filtered.length === 0) {
    return EMAILS_DATABASE.slice(0, 5).map(e => applyChineseKanjiInjection(e, difficulty));
  }

  // Adjust count based on difficulty
  let targetCount = 6;
  if (difficulty === 'EASY') targetCount = Math.min(filtered.length, 6);
  else if (difficulty === 'NORMAL') targetCount = Math.min(filtered.length, 8);
  else if (difficulty === 'HARD') targetCount = Math.min(filtered.length, 10);

  return filtered.slice(0, targetCount).map(e => applyChineseKanjiInjection(e, difficulty));
}
