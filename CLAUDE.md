# 北見の街の電気屋さん — プロジェクト規約

## プロジェクト概要
- **サイト名**: 北見の街の電気屋さん
- **ドメイン**: https://denki-kitami.com/
- **コンセプト**: 気軽に頼みやすい地域密着×スピード対応
- **電話番号**: 070-4080-0965
- **所在地**: 北海道北見市
- **対応エリア**: 北見市全域、網走市、美幌町（半径30km圏内）
- **ホスティング**: GitHub Pages（.nojekyll）

## 重要な制約事項（必ず守ること）
- **虚偽の実績表示は一切行わない**
- **建設業許可は保有していないため表示しない**
- **電気工事士資格保有のみを信頼性の根拠とする**
- 根拠のない最上級表現（No.1、最安値 等）は景品表示法違反のため使用禁止
- 価格表示には必ず「〜」を付けて目安であることを明示

## 技術スタック
- **HTML5**: セマンティック構造 + JSON-LD構造化データ
- **CSS3**: CSS変数、Grid、Flexbox、アニメーション（ビルドツールなし）
- **JavaScript**: バニラJS（script.js 722行）、フレームワーク不使用
- **PHP**: send_mail.php（お問い合わせフォーム処理）
- **外部ライブラリ**: Google Fonts (Noto Sans JP)、Font Awesome 6.4.0 (CDN)
- **サーバー**: Apache (.htaccess でキャッシュ・リダイレクト制御)

## ディレクトリ構造
```
denki-kitami/
├── index.html                    # トップページ（スライドショー付き）
├── ev-charger/                   # EV充電器ページ（Hero型）
│   ├── index.html
│   └── ev-charger.css            # .ev- プレフィックス
├── interphone/                   # インターホンページ（Hero型）
│   ├── index.html
│   └── interphone.css            # .iph- プレフィックス
├── outlet-installation/          # コンセント増設ページ（PageTitle型）
│   └── index.html                # outlet-style.css を使用
├── leakage-repair/               # 漏電修理ページ（PageTitle型）
│   └── index.html                # outlet-style.css を使用
├── privacy-policy/               # プライバシーポリシー
│   └── index.html
├── css/
│   ├── style.css                 # メインCSS（4,532行）
│   └── outlet-style.css          # PageTitle型ページ共通CSS
├── js/
│   └── script.js                 # スライドショー、モバイルメニュー等
├── images/                       # 画像ファイル（.webp, .jpg, .svg）
├── send_mail.php                 # フォーム送信処理
├── .htaccess                     # Apache設定
├── robots.txt                    # クローラー設定
├── sitemap.xml                   # サイトマップ
│
├── seo-research/                 # SEOリサーチ資料
│   ├── keyword-analysis*.md      # キーワード分析
│   ├── keyword-demand-priority-list.md  # KW優先順位
│   ├── compliance-report.md      # コンプライアンス監査（45K）
│   ├── cooccurrence/             # 共起語分析
│   └── user-insight/             # ユーザーインサイト
├── market-research/              # 市場調査
├── content-strategy/             # コンテンツ戦略
├── content-drafts/               # コンテンツドラフト
├── seo-audit/                    # SEO監査レポート
├── compliance-audit/             # 法令監査レポート
└── .claude/
    ├── settings.local.json
    └── skills/                   # Claude Code Skills
```

## CSS設計規約

### カラーパレット（CSS変数）
```css
:root {
    --primary-blue: #4A90E2;        /* 信頼性 */
    --primary-orange: #FF8C42;      /* 親しみやすさ */
    --bg-cream: #FFF8F0;            /* 温かみの背景 */
    --text-dark: #333333;
    --text-light: #666666;
    --emergency-red: #E74C3C;       /* 緊急 */
    --success-green: #27AE60;       /* 成功 */
    --border-light: #E5E5E5;
}
```

### CSSクラス命名規則
| ページ | プレフィックス | CSSファイル | 例 |
|--------|---------------|-------------|-----|
| EV充電器 | `.ev-` | ev-charger.css | `.ev-hero-slideshow`, `.ev-section`, `.ev-faq-item` |
| インターホン | `.iph-` | interphone.css | `.iph-hero`, `.iph-section`, `.iph-faq-question` |
| コンセント/漏電 | なし（汎用） | outlet-style.css | `.page-title-section`, `.intro-section`, `.services-section` |
| **新規Hero型ページ** | **サービス略称-** | 専用CSS | 命名例: `.ac-`(エアコン), `.led-`(LED) |

### レスポンシブブレークポイント
```
デスクトップ:    1025px以上（デフォルト）
大型タブレット:  @media (max-width: 1024px)
中型タブレット:  @media (max-width: 900px)
タブレット:      @media (max-width: 768px)
スマートフォン:  @media (max-width: 480px)
```

## HTMLページ構造テンプレート

### 2つのページパターン

#### パターンA: Hero型（EV充電器、インターホン等の主力ページ）
```
<head> ... メタタグ + JSON-LD + ../css/style.css + 専用CSS </head>
<header class="header"> ... 共通ヘッダー </header>
<section class="{prefix}-hero">           ← ヒーロー（大画像+CTA）
<section class="{prefix}-section">        ← リード/導入
<section class="{prefix}-section {prefix}-section-gray" id="troubles"> ← お悩み
<section class="{prefix}-section" id="types">     ← 製品/タイプ紹介
<section class="{prefix}-section" id="flow">      ← 工事の流れ
<section class="{prefix}-section" id="price">     ← 料金表
<section class="{prefix}-section" id="reason">    ← 選ばれる理由
<section class="{prefix}-section" id="faq">       ← FAQ（構造化データ付き）
<section class="{prefix}-section" id="area">      ← 対応エリア
<section class="{prefix}-cta-section" id="contact"> ← CTA・お問い合わせ
<footer class="footer"> ... 共通フッター </footer>
```

#### パターンB: PageTitle型（コンセント、漏電等の標準ページ）
```
<head> ... メタタグ + JSON-LD + ../css/style.css + outlet-style.css </head>
<header class="header"> ... 共通ヘッダー </header>
<section class="page-title-section">      ← パンくずリスト付きタイトル
<section class="intro-section">           ← 導入・特徴
<section class="services-section">        ← サービス内容/症状
<section class="equipment-section">       ← 設備/自己診断
<section class="pricing-section">         ← 料金表
<section class="cta-section">             ← CTA
<section class="faq-section">             ← FAQ
<section class="service-area">            ← 対応エリア
<section class="contact-section">         ← お問い合わせ
<footer class="footer"> ... 共通フッター </footer>
```

### 共通ヘッダー構造
```html
<header class="header">
  <div class="container">
    <div class="header-content">
      <div class="logo">
        <a href="/" class="logo-link">
          <span class="logo-text"><i class="fas fa-home"></i> 北見の街の電気屋さん</span>
        </a>
      </div>
      <nav class="header-nav">
        <ul class="nav-list"><!-- ナビゲーション項目 --></ul>
      </nav>
      <div class="header-contact">
        <a href="tel:07040800965" class="phone-link"><!-- 電話番号 --></a>
      </div>
      <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </div>
</header>
```

## SEO要件

### 必須メタタグ（全ページ共通）
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<title>{サービス名}｜{差別化ポイント}｜北見の街の電気屋さん</title>
<meta name="description" content="...（120文字以内）">
<meta name="keywords" content="...">
<link rel="canonical" href="https://denki-kitami.com/{ページパス}/">
<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="...">
<meta property="og:image" content="...">
```

### 構造化データ（JSON-LD）
- **トップページ**: `@type: LocalBusiness` + `FAQPage`
- **サブページ**: `@type: Service` + `provider: LocalBusiness` + `AggregateOffer` + `FAQPage`
- **共通フィールド**: name, telephone, address(北見市/北海道/JP), areaServed, priceRange

## リサーチ資料の参照ガイド
新しいサービスページを作成する際、以下の順序でリサーチ資料を確認すること:

1. **市場調査**: `market-research/{service}-market-report.md`
2. **キーワード分析**: `seo-research/keyword-analysis*.md`, `seo-research/{service}-keyword-analysis.md`
3. **共起語分析**: `seo-research/cooccurrence/{service}-cooccurrence*.md`
4. **ユーザーインサイト**: `seo-research/user-insight/{service}-user-insight*.md`
5. **コンテンツ戦略**: `content-strategy/{service}-page-strategy.md`
6. **コンテンツドラフト**: `content-drafts/{service}-draft.md`
7. **コンプライアンス確認**: `compliance-audit/{service}-compliance.md`

既存リサーチがない場合は、上記と同じ形式・ファイル名で新規作成すること。

## サービスカテゴリ一覧（6カテゴリ）
1. **基本電気工事** — 分電盤交換、ブレーカー交換、コンセント増設、エアコン専用回路
2. **照明・LED工事** — LED交換、ダウンライト、センサーライト
3. **セキュリティ・通信** — インターホン、防犯カメラ、アンテナ
4. **EV・省エネ工事** — EV充電、エコキュート、IHクッキングヒーター
5. **緊急・点検対応** — 漏電修理、ブレーカー異常、コンセント焦げ
6. **店舗・法人向け** — 店舗LED化、工場分電盤改修
