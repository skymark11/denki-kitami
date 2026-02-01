# サービスページ作成チェックリスト

## リサーチ資料（全て作成/確認済みか）
- [ ] market-research/{service}-market-report.md
- [ ] seo-research/{service}-keyword-analysis.md
- [ ] seo-research/cooccurrence/{service}-cooccurrence-analysis.md
- [ ] seo-research/user-insight/{service}-user-insight.md
- [ ] content-strategy/{service}-page-strategy.md
- [ ] content-drafts/{service}-draft.md

## HTML必須要素
- [ ] viewport meta（maximum-scale=5.0, user-scalable=yes）
- [ ] title（32文字以内、形式: 北見市の{サービス}｜{差別化}｜北見の街の電気屋さん）
- [ ] meta description（120文字以内、電話番号末尾含む）
- [ ] meta keywords
- [ ] canonical URL
- [ ] Open Graph（title, description, type, url, image）
- [ ] Google Fonts: Noto Sans JP
- [ ] Font Awesome 6.4.0
- [ ] ../css/style.css 読み込み
- [ ] ページ固有CSS読み込み（Hero型のみ）
- [ ] JSON-LD: Service + LocalBusiness + AggregateOffer
- [ ] JSON-LD: FAQPage
- [ ] 共通ヘッダー（logo, nav, phone-link, mobile-menu-toggle）
- [ ] 共通フッター（footer-main, footer-links, footer-business, footer-bottom）

## セクション構成（パターンA: Hero型）
- [ ] Hero セクション（大画像 + CTA）
- [ ] リード/導入セクション
- [ ] お悩みセクション（troubles）
- [ ] タイプ/種類紹介（types）
- [ ] 工事の流れ（flow）
- [ ] 料金表（price）
- [ ] 選ばれる理由（reason）
- [ ] FAQ（faq）— 構造化データ連動
- [ ] 対応エリア（area）
- [ ] CTA/お問い合わせ（contact）

## セクション構成（パターンB: PageTitle型）
- [ ] パンくずリスト付きタイトル（page-title-section）
- [ ] 導入・特徴（intro-section）
- [ ] サービス内容/症状（services-section）
- [ ] 設備/診断（equipment-section）
- [ ] 料金表（pricing-section）
- [ ] CTA（cta-section）
- [ ] FAQ（faq-section）
- [ ] 対応エリア（service-area）
- [ ] お問い合わせ（contact-section）

## CSS（Hero型の場合）
- [ ] サービス略称プレフィックス（例: .ac-, .led-, .cam-）
- [ ] :root変数はstyle.cssから継承（再定義しない）
- [ ] @media (max-width: 1024px)
- [ ] @media (max-width: 900px)
- [ ] @media (max-width: 768px)
- [ ] @media (max-width: 480px)

## SEO
- [ ] 必須共起語30語以上を本文に含有
- [ ] H1にメインキーワード
- [ ] H2にミドルKW
- [ ] 画像alt属性にキーワード
- [ ] 内部リンク（トップページ↔サブページ）
- [ ] sitemap.xml にURL追加

## コンプライアンス
- [ ] 建設業許可の表示なし
- [ ] 根拠のない実績数値なし
- [ ] 最上級表現なし（No.1、最安値 等）
- [ ] 価格に「〜」表記あり
- [ ] 電気工事士資格のみを根拠として記載
