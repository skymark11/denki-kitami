# denki-kitami プロジェクト

## セッション引き継ぎ

最終更新: 2026-02-02 19:30

### 作業中だったこと
- sitemap.xmlがサーバー上で古い版のまま（2件のみ）。ローカルは4件で正しい。FTP再アップ済みだがXサーバーキャッシュの影響で未反映の可能性あり
- デプロイ後チェックリストの残り項目（PageSpeed Insights、Search Console作業）

### 今回完了したこと
- Dropboxフォルダ移行に伴い、GitHubからdenki-kitamiをクローンし直し（最新版に同期）
- ev-kitamiリポジトリをローカル・GitHub両方から完全削除（サンプルのため不要）
- robots.txtにAI検索エンジン対応を追加（GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot）→ コミット・プッシュ済み（c0ae589）
- leakage-repair/, outlet-installation/ ページを削除（不要ページ整理）→ コミット・プッシュ済み（d57d7e6）
- `.claude/rules/infrastructure.md` を新規作成（.htaccess, robots.txt, sitemap.xmlの標準設定 + デプロイ後チェックリスト + FTPアップ除外フォルダ一覧）
- CLAUDE.md の参照ファイルテーブルに infrastructure.md を追加
- FTP再アップ後のデプロイチェックを実施（トップページ・全サービスページ表示OK、robots.txt反映OK）

### 決定事項
- AI検索エンジンは全てAllow（地域ビジネスはAI検索経由の集客が重要）
- プライバシーポリシーはsitemap.xmlに載せない（重複コンテンツリスク回避）
- Options -Indexesがあるため、各ディレクトリにダミーindex.htmlは不要
- サイト共通のインフラ設定ノウハウは `.claude/rules/infrastructure.md` に積み上げる
- デプロイ後チェックリストも infrastructure.md に記載

### 次にやるべきこと
1. sitemap.xmlのサーバー反映を確認（Xサーバーのキャッシュクリア → 再確認）
   - サーバーパネル → 高速化 → サーバーキャッシュ設定 → キャッシュ削除
   - 反映後、4件（トップ、EV充電器、インターホン、防犯カメラ）が表示されればOK
2. Search Consoleでサイトマップ再送信（sitemap.xml反映後）
3. Search Consoleでインデックス登録リクエスト（interphone/, security-camera/）
4. PageSpeed Insightsでスコア確認（https://pagespeed.web.dev/）
5. 構造化データ確認（https://search.google.com/test/rich-results）
6. 不要フォルダの削除検討: htdocs/denki-kitami-old/, htdocs/claudedocs-backup/

### 注意事項・文脈
- DropboxフォルダがDropbox0（旧）→ Dropbox（新）に変更された。新Dropboxには.gitが同期されなかったため、GitHubからクローンし直した
- denki-kitami-old（旧Dropbox版のバックアップ）がhtdocs内に残っている。不要になれば削除可
- infrastructure.mdはまだGitHubにコミット・プッシュしていない（ルート側の.claude/rules/配下のため、denki-kitamiリポジトリとは別管理）
- sitemap.xmlのlastmod: トップとEV充電器は2025-12-12、インターホンと防犯カメラは2026-02-01
