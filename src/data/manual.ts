export interface ManualArticle {
  id: string;
  category: string;
  title: string;
  threatLevel: 'INFO' | 'CAUTION' | 'CRITICAL';
  summary: string;
  mechanism: string;
  detectionChecklist: string[];
  countermeasure: string;
  realWorldExample: string;
}

export const MANUAL_ARTICLES: ManualArticle[] = [
  {
    id: 'display-name-spoof',
    category: 'SENDER_VERIFICATION',
    title: '表示名なりすまし (Display Name Spoofing)',
    threatLevel: 'CAUTION',
    summary: 'メールの「表示名」だけを信頼できる上司や企業名に偽装し、実際のアドレスは全く無関係なフリーメール等を使う手口。',
    mechanism: 'メールヘッダーの「From」行は「"表示名" <実メールアドレス>」の形式です。スマートフォンや一般的なメーラーは画面スペース節約のため「表示名」しか表示しないことが多く、攻撃者はこれを利用します。',
    detectionChecklist: [
      '「山田社長」と表示されていても、タップして「@gmail.com」や見知らぬドメインでないか確認する',
      '社内の人間を名乗っているのに社内ドメイン(@company.co.jp等)以外から届いていないか',
      '差出人名とメールアドレスのスペルが一致しているか'
    ],
    countermeasure: '常に送信元アドレスの「@以降のドメイン」を展開して確認する癖をつける。社内ポリシーで外部メールに[外部受信]タグを付与する運用を徹底する。',
    realWorldExample: '「代表取締役 山田太郎 <ceo-urgent-office992@gmail.com>」から「至急LINEプリペイドカードを購入してコードを送ってくれ」と指示が届く。'
  },
  {
    id: 'typosquatting',
    category: 'DOMAIN_ATTACKS',
    title: '類似ドメイン / タイポスクワッティング',
    threatLevel: 'CRITICAL',
    summary: '有名企業や取引先の正規ドメインと一文字違い、または酷似した文字列のドメインを取得して本物と錯覚させる攻撃。',
    mechanism: '人間の目視認識の隙を突き、「o」を「0」(ゼロ)、「l」(エル)を「1」(イチ)、「m」を「rn」に置き換えたり、末尾に「-jp」や「-support」などを追加して登録します。',
    detectionChecklist: [
      '文字の置き換え（例: paypa1.com, micros0ft.com, marnazon.co.jp）',
      '無関係な接尾語やハイフン（例: company-secure.com, support-office365.net）',
      'ドメインのWHOIS情報を確認し、取得日が数日前〜数ヶ月前の新興ドメインでないか調べる'
    ],
    countermeasure: '取引先の正式なドメインマスターと照合する。新規取得されたばかりの使い捨てドメインは遮断対象とする。',
    realWorldExample: '取引先「partner-tech.co.jp」の請求書が「partner-tech.com」や「partner-teck.co.jp」から届く。'
  },
  {
    id: 'url-mismatch',
    category: 'URL_SECURITY',
    title: 'リンク偽装 (URL Mismatch & Subdomain Trap)',
    threatLevel: 'CRITICAL',
    summary: 'メール本文に青字で書かれたURLと、実際にクリックしたときのリンク先(href属性)が全く異なっている典型的なフィッシング手法。',
    mechanism: 'HTMLメールでは、リンクの「見た目テキスト」と「リンク先URL」を自由に別々に設定できます。「https://www.mybank.co.jp」と表示しておきながら、リンク先は「https://phish-login.cc/bank」へ飛ばします。またサブドメインを悪用して「https://mybank.co.jp.attacker-domain.com」のように見せかける手法も横行しています。',
    detectionChecklist: [
      'リンクの上にカーソルを乗せ（ホバー）、ブラウザのステータスバーや調査ツールで真のURLを確認する',
      'ドメインの階層を右から読む（「login.mybank.co.jp.attacker.xyz」の真のドメインは「attacker.xyz」）',
      '正規サービスに酷似させた無料ホスティング(firebaseapp, github.io, vercel.app等)上のページに注意'
    ],
    countermeasure: 'メール内のリンクは安易にクリックせず、ブラウザのブックマークや公式アプリからログインする。調査ツールでリンク先ホストを分解して評価する。',
    realWorldExample: '「アカウント安全確認はこちら: https://service.amazon.co.jp」と書かれているが、リンク先は「https://bit.ly/3x8AbCd」や「https://amz-login-jp.shop」。'
  },
  {
    id: 'double-extension',
    category: 'ATTACHMENTS',
    title: '二重拡張子 & 偽装ファイル (Double Extension)',
    threatLevel: 'CRITICAL',
    summary: 'Windowsの「登録されている拡張子は表示しない」設定を悪用し、「請求書.pdf.exe」を「請求書.pdf」に見せかける手口。',
    mechanism: 'ファイル名の末尾に「.exe」「.scr」「.vbs」「.iso」「.js」などの実行可能ファイルを隠し、アイコンをPDFやExcelそっくりに偽装してユーザーにダブルクリックさせます。',
    detectionChecklist: [
      '拡張子が「.pdf.exe」「.xlsx.vbs」など2つ重なっていないか',
      '添付ファイルの真のMIMEタイプ（application/x-msdownload 等）を確認する',
      '圧縮ファイル（.zip, .iso）の中に実行ファイルやスクリプトが隠されていないか'
    ],
    countermeasure: '拡張子の表示を有効にする。サンドボックス検査でファイルタイプと悪性シグネチャを必ず確認する。',
    realWorldExample: '「10月度請求書_原本.pdf.exe」という添付ファイル。開くとバックドアトロイの木馬がインストールされる。'
  },
  {
    id: 'macro-malware',
    category: 'ATTACHMENTS',
    title: 'マクロウイルス (VBA Macro Malware)',
    threatLevel: 'CRITICAL',
    summary: 'ExcelやWordファイルに埋め込まれたVBAマクロを悪用し、ファイルを開いた際に外部からマルウェアをダウンロードさせる攻撃。',
    mechanism: '文書を開いた際に「コンテンツの有効化」や「編集を有効にする」ボタンを押すよう促す偽のメッセージ（セキュリティ警告に見せかけた画像）を表示し、マクロを実行させます。',
    detectionChecklist: [
      '拡張子が「.xlsm」「.docm」などのマクロ有効化形式である',
      '本文で「文字化けを直すためにコンテンツを有効化してください」と執拗に指示している',
      '静的解析でマクロコード(VBA)が含まれているか調べる'
    ],
    countermeasure: '組織のグループポリシーで信頼できない発信元のマクロ自動実行を禁止する。サンドボックスでマクロの有無を検出する。',
    realWorldExample: '「賞与明細.xlsm」を開き「コンテンツの有効化」を押した瞬間にEmotet等の情報窃取マルウェアがダウンロードされる。'
  },
  {
    id: 'bec-wire-fraud',
    category: 'SOCIAL_ENGINEERING',
    title: 'ビジネスメール詐欺 (BEC - Business Email Compromise)',
    threatLevel: 'CRITICAL',
    summary: '取引先や経営陣になりすまし、巧妙な口実で指定の偽銀行口座へ多額の資金を振り込ませる詐欺。',
    mechanism: '事前に取引先との過去のメールやり取りを傍受（または類似アドレスを作成）し、「監査のため振込先口座が変更になった」「秘密裏の買収資金が必要」などの緊急かつ機密のストーリーで財務担当者を騙します。',
    detectionChecklist: [
      '普段と異なる銀行口座や海外口座への振込依頼',
      '「至急」「秘密の案件」「電話での確認は不要」など外部への確認を遮断しようとする文言',
      'メールアドレスのスペルが正規取引先と1文字だけ違っていないか（タイポスクワッティングとの併用）'
    ],
    countermeasure: '振込先の変更依頼があった場合、メールに記載された電話番号ではなく「あらかじめ登録されている取引先電話番号」へ別経路（電話・対面）で必ず二重確認する。',
    realWorldExample: '「【重要】弊社会計監査に伴う10月分請求書振込先銀行口座変更のお願い」というメールが届き、確認せず振り込んで数千万円の被害。'
  },
  {
    id: 'email-authentication',
    category: 'TECHNICAL_HEADERS',
    title: '送信ドメイン認証 (SPF / DKIM / DMARC)',
    threatLevel: 'INFO',
    summary: '送信元のIPアドレスや電子署名を検証し、差出人が本当にそのドメインの所有者であるかを数学的・技術的に証明する仕組み。',
    mechanism: '・SPF: 送信サーバーのIPアドレスがドメインのDNSレコードに許可されているか確認。\n・DKIM: 送信元がメール本文に付与した秘密鍵署名を、公開鍵で検証し改ざんがないことを確認。\n・DMARC: SPF/DKIM両方の認証結果とFromヘッダーの一致(アライメント)を検証し、失敗時のポリシー(none/quarantine/reject)を指示。',
    detectionChecklist: [
      'SPF判定が「FAIL」または「SOFTFAIL」になっていないか',
      'DKIM判定が「FAIL」または未署名（NONE）になっていないか',
      'Return-PathのアドレスとFromヘッダーのアドレスが乖離していないか'
    ],
    countermeasure: '3つの認証すべてがPASSしているかヘッダー解析ツールで確認する。大手企業を騙るメールでSPF/DKIMがFAILの場合は即座に隔離対象。',
    realWorldExample: '「service@amazon.co.jp」を名乗っているのに、SPF認証IPが海外の無関係なボットネットPCで「SPF: FAIL」と判定される。'
  },
  {
    id: 'urgent-psychology',
    category: 'SOCIAL_ENGINEERING',
    title: '緊急性と恐怖を煽る心理誘導 (Social Engineering)',
    threatLevel: 'CAUTION',
    summary: '「24時間以内に更新しないと凍結」「不正アクセス検知」「裁判を起こします」など、受取人を焦らせて正常な判断力を奪う文脈。',
    mechanism: '人間は恐怖やタイムリミットを突きつけられると、慎重な確認を怠って反射的にクリックや情報入力をしてしまう心理的弱点（アフェクト・ヒューリスティック）があります。',
    detectionChecklist: [
      '「至急」「直ちに」「法的措置」「24時間以内」などの強い脅迫的文言',
      '日本語の文法や言い回しが不自然（機械翻訳の痕跡やフォント・漢字の簡体字混じり）',
      '一般的な企業がメールで直接パスワードやクレジットカード情報を求めることは原則ない'
    ],
    countermeasure: '緊急性を煽るメールほど「一度深呼吸して疑う」。公式サポート窓口の既知のURLから直接ステータスを確認する。',
    realWorldExample: '「警告: あなたのMicrosoftアカウントは不正ログインが確認されました。24時間以内に下記URLでパスワードを再設定しない場合、完全に削除されます。」'
  },
  {
    id: 'delivery-phish',
    category: 'IMPERSONATION',
    title: '配達通知・不在連絡偽装型 (Delivery Notification Phishing)',
    threatLevel: 'CRITICAL',
    summary: '佐川急便・ヤマト運輸・日本郵便等を装い、「宛先不明で保管中」「住所を確認してください」と偽り不正サイトへ誘導する手口。',
    mechanism: '日常的に宅配便を利用する心理の隙を突きます。リンク先で偽の再配達受付ポータル（Apple IDやGoogleアカウント、クレジットカード情報、あるいは不正なAndroid APKアプリをダウンロードさせるサイト）に誘導します。',
    detectionChecklist: [
      '送信元ドメインが運送会社公式（sagawa-exp.co.jp, kuronekoyamato.co.jp, post.japanpost.jp）と一致しているか',
      '第三者短縮URL（bit.ly, tinyurl）や不審なTLD（.top, .xyz, .cc）が使用されていないか',
      '荷物の不在通知なのに、なぜかApple IDやMicrosoftアカウント、クレジットカード番号の入力を求められないか'
    ],
    countermeasure: 'メール内のリンクは絶対にクリックせず、公式アプリまたは既知の公式荷物追跡ページから伝票番号を直接入力して確認する。',
    realWorldExample: '「【佐川急便】お客様宛てのお荷物をお届けにあがりましたが、宛先不明のため持ち帰りました。下記より住所をご確認ください: http://sagawa-tracking.duckdns.org」'
  },
  {
    id: 'spear-phishing',
    category: 'TARGETED_ATTACK',
    title: '標的型攻撃（スピアフィッシング / Spear Phishing）',
    threatLevel: 'CRITICAL',
    summary: '特定の部署・担当者を事前にSNSや企業サイトから綿密に調査し、業務内容や実名・プロジェクト名を引用して騙す高度な攻撃。',
    mechanism: '不特定多数向けのばら撒き型とは異なり、攻撃者は標的の氏名、役職、進行中の製品開発名（プロジェクト名）や直近の展示会・カンファレンス参加情報を調査した上で、極めて自然な業務連絡を装います。',
    detectionChecklist: [
      '業務内容やプロジェクト名は本物でも、送信元ドメイン（@以降）が実在の取引先と完全一致しているか',
      '「社外秘・NDA締結済み資料」などの口実で、マクロ有効化ファイルや外部クラウドストレージのログインを要求していないか',
      'SPF/DKIM/DMARCがすべて正当に合格しているか'
    ],
    countermeasure: '心当たりのあるプロジェクト名であっても、外部から送られてきたファイルを開く際は、既知の取引先連絡先へ別経路で事前確認を行う。',
    realWorldExample: '「フロンティア社 技術開発部 佐々木様: 先日のCEATECでお話しした新世代AIチップ仕様書（Project-Horizon）のドラフトをお送りします。パスワードは別送します。」'
  },
  {
    id: 'sextortion-blackmail',
    category: 'BLACKMAIL_FRAUD',
    title: '恐喝・脅迫型（セクストーション / Sextortion & Blackmail）',
    threatLevel: 'CAUTION',
    summary: '「あなたのPCをハッキングしWebカメラを録画した」「恥ずかしい動画を公開されたくなければ仮想通貨を送金しろ」と脅す詐欺。',
    mechanism: '過去に漏洩した古いパスワードなどをメール本文に記載して「本当にハッキングされた」と信じ込ませ、パニックに陥れてビットコイン等の暗号資産を指定ウォレットへ送金させようとします。実際にはハッキングも録画もされておらず、完全なブラフ（ハッタリ）です。',
    detectionChecklist: [
      '「48時間以内にBitcoinを送金しろ」「警察に言えば動画を社内全員に送信する」などの脅迫文',
      '過去に他サービスで使っていた古いパスワードが記載されている（ダークウェブ流出リストからの転載）',
      '送金先として仮想通貨ウォレットアドレス（BTC / XMR）が指定されている'
    ],
    countermeasure: '要求には一切応じず、お金を払わない。記載されたパスワードが現在も使用中であれば直ちに変更し、管理部門・警察のサイバー犯罪相談窓口へ通報・破棄する。',
    realWorldExample: '「私はプロのハッカーです。あなたのPCにトロイの木馬を仕込み、カメラで成人向けサイト閲覧中の姿を録画しました。50万円相当のビットコインを下記アドレスに送金してください。」'
  },
  {
    id: 'thread-hijack-clone',
    category: 'ADVANCED_MALWARE',
    title: '会話スレッド乗っ取り・返信偽装型（Thread Hijacking / Clone Phishing）',
    threatLevel: 'CRITICAL',
    summary: '過去に実際にやり取りしたメールの返信（Re:）を装い、文脈を引用した上でマルウェアや不正URLを送りつける最難関の手口。',
    mechanism: 'マルウェア（Emotet等）に感染した取引先の端末から過去の送受信メール本文や件名を窃取。その引用（Quoted text）をそのまま付けた上で「先ほどの件ですが、修正版の資料を添付します」と返信を装って送信するため、受取人が不審に思わずファイルを開いてしまいます。',
    detectionChecklist: [
      '「Re: お打ち合わせの件」と実在のメールが引用されていても、送信元のメールアドレスが過去のやり取りと完全に一致しているか',
      '過去の同僚や取引先からの返信なのに、送信元サーバーが海外の不審なIPやフリーメールになっていないか（SPF/DKIM検証）',
      '添付ファイルがパスワード付きZIPやOneNote、ショートカット（.lnk）ファイルになっていないか'
    ],
    countermeasure: 'どんなに過去のメールの続きに見えても、添付ファイルやリンクがある場合は送信元アドレスのドメインを拡大確認し、不審なら電話等の別経路で「先ほどメール送られましたか？」と確認する。',
    realWorldExample: '先週取引先とやり取りした「Re: 2026年第4四半期納入スケジュールについて」というスレッドに、突然「上記件、追加の更新ファイルをお送りします」とパスワード付きZIPが返信される。'
  },
  {
    id: 'chinese-simplified-phish',
    category: 'LINGUISTIC_SECURITY',
    title: '中国語簡体字・非標準漢字混入の見分け方 (Simplified Chinese & Glyph Anomaly)',
    threatLevel: 'CAUTION',
    summary: '海外攻撃グループがフィッシングメールを作成・翻訳する際、中国語OS環境の文字コードや入力ミスによって混入する簡体字や中国語特有の単語を見抜く技術。',
    mechanism: '多くの海外フィッシング攻撃インフラや多言語フィッシングキットは、中国語フォント環境（zh-Hans）でテンプレートが編集・生成されています。その際、日本語JIS規格には存在しない「认（認）」「银（銀）」「关（関）」「发（発）」「无（無）」などの字形や、「信息（情報）」「账户（アカウント）」「登录（ログイン）」などの中国語単語が件名や本文に残留します。',
    detectionChecklist: [
      '言偏（ごんべん）が「讠」に略されていないか（例: 认证、确认、设置、电话）',
      '金偏（かねへん）が「钅」に略されていないか（例: 银行）',
      '日本語ビジネスメールでは使用しない中国語の語彙が混入していないか（例: 個人「信息」、商品の「发货」、サービス「公司」、口座「账户」、今すぐ「登录」）',
      '門構えや構えが簡略化されていないか（例: 关联、国际、点检、处理、异常）',
      '※重要: 日本語と中国語で共通する正当な漢字（例: 安全、警告、更新、案内等）もあるため、単に共通する漢字というだけで判断せず、JIS規格外の簡体字グリフや不自然な語彙を特定すること'
    ],
    countermeasure: '日本国内の正規企業や金融機関が、公式メールの件名や重要なお知らせで中国語簡体字を用いることは一切ありません。1箇所でも明らかな簡体字が混入している場合、海外発のフィッシングメールである可能性が極めて濃厚です。ただし近年は自然な日本語のスピアフィッシングも多いため、「簡体字がないから安全」と即断せず、ドメイン・ヘッダー・URLを総合審査してください。',
    realWorldExample: '「【重要】三井住友カードご利用确认のお願い」「お客様の个人账户に异常なアクセスが検知されました。至急登录して设置を確認してください。」'
  }
];

