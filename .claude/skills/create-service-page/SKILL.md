---
name: create-service-page
description: 新しいサービスページを一式作成する。市場調査→キーワード分析→共起語分析→コンテンツ戦略→HTML/CSS実装→SEO最適化→監査までを一貫実行。「ページ作成」「新しいサービス」「サブページ」等のリクエスト時に使用。
---

# サービスページ作成ワークフロー

$ARGUMENTSで指定されたサービス名の新規ページを、以下のステップで作成する。

## 前提: CLAUDE.md を必ず先に読み込む
プロジェクトルートのCLAUDE.mdを参照し、全規約に従うこと。

## Step 1: リサーチフェーズ

### 1-1. 市場調査
- 既存の `market-research/` を確認し、該当サービスの調査があればそれを使用
- なければ新規作成: `market-research/{service-slug}-market-report.md`
- 内容: 料金相場、北見市の需要推定、競合状況、差別化要素（寒冷地対応等）

### 1-2. キーワード分析
- 既存の `seo-research/` を確認
- なければ新規作成: `seo-research/{service-slug}-keyword-analysis.md`
- 内容: ビッグKW、ミドルKW、ロングテール、検索インテント(Do/Know/Compare)分類

### 1-3. 共起語分析
- `seo-research/cooccurrence/{service-slug}-cooccurrence-analysis.md`
- 内容: 必須KW30語以上、推奨KW15語以上、差別化KW

### 1-4. ユーザーインサイト調査
- `seo-research/user-insight/{service-slug}-user-insight.md`
- 内容: Q&Aサイト・口コミからのTOP10の悩み抽出

## Step 2: 戦略フェーズ

### 2-1. コンテンツ戦略
- `content-strategy/{service-slug}-page-strategy.md`
- 内容: 差別化要素、ターゲットペルソナ、SEO戦略、KPI目標、コンテンツ構成

### 2-2. コンテンツドラフト
- `content-drafts/{service-slug}-draft.md`
- 内容: メタ情報（タイトル32文字以内、メタディスク120文字以内）、H1、本文3,500〜5,000字

## Step 3: 実装フェーズ

### 3-1. ページパターンの判定
サービスの重要度に応じて2つのパターンから選択:
- **Hero型（パターンA）**: 主力サービス → 専用CSSファイル + サービス略称プレフィックス
- **PageTitle型（パターンB）**: 標準サービス → outlet-style.css を共用

### 3-2. ディレクトリ・ファイル作成
```
{service-slug}/
├── index.html          # ページ本体
└── {service-slug}.css  # Hero型のみ（プレフィックス命名）
```

### 3-3. HTML実装チェックリスト
- [ ] `<meta viewport>` に `maximum-scale=5.0, user-scalable=yes` を含む
- [ ] `<title>` 形式: `北見市の{サービス名}｜{差別化}｜北見の街の電気屋さん`
- [ ] `<link rel="canonical">` に正しいURL
- [ ] Open Graph タグ一式
- [ ] JSON-LD構造化データ (`@type: Service` + `provider: LocalBusiness` + `AggregateOffer`)
- [ ] `FAQPage` 構造化データ
- [ ] 共通ヘッダー（CLAUDE.mdのテンプレートに従う）
- [ ] セクション順序がパターンA/Bに準拠
- [ ] 共通フッター
- [ ] 共起語の自然な配置（必須KWは全て含む）

### 3-4. CSS実装チェックリスト（Hero型の場合）
- [ ] プレフィックス命名（例: `.ac-` エアコン, `.led-` LED）
- [ ] CSS変数はstyle.cssの:rootを参照（再定義しない）
- [ ] 4段階レスポンシブ対応（1024px, 900px, 768px, 480px）
- [ ] セクション背景の交互配色（白 / `-section-gray`）

## Step 4: 品質チェックフェーズ

### 4-1. SEO監査
- `seo-audit/{service-slug}-audit.md` を作成
- タイトルタグ、メタディスク、H1、構造化データ、内部リンクを各10点満点で採点

### 4-2. コンプライアンス監査
- `compliance-audit/{service-slug}-compliance.md` を作成
- 景品表示法、特定商取引法、電気工事業法を確認
- **建設業許可表示は禁止**（保有していない）
- **根拠のない実績数値は禁止**

### 4-3. sitemap.xml の更新
- 新ページのURLを `sitemap.xml` に追加

## Step 5: 最終確認
- 全チェックリスト項目をパス
- コンプライアンス問題がゼロ
- 既存ページ（特にトップページ）からの内部リンク追加を検討
