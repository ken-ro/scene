# scene

ロビンファクトリーの特化サイト群をまとめて管理する Astro 親プロジェクトです。

現時点で公開対象になっているのは防犯ベスト向けの bouhan-vest セクションで、将来的に senkyo-blouson、shouboudan などを同じリポジトリ配下に増やしていく前提です。

## 現在のルート

- / : scene の入口ページ
- /bouhan-vest/ : 防犯ベスト・自治会ビブス名入れ専門店
- /bouhan-vest/items/
- /bouhan-vest/guide/
- /bouhan-vest/estimate/
- /bouhan-vest/privacy/
- /senkyo-blouson/
- /shouboudan/

共有URLは src/data/site.ts の sectionPaths で管理しています。

## ローカル開発

プロジェクトルートで実行します。

```sh
npm install
npm run dev
```

本番ビルド確認は次です。

```sh
npm run build
npm run preview
```

## GitHub に載せる手順

このフォルダは Git 初期化済みです。まだコミットと remote 設定はしていません。

最初の push までは、PowerShell なら次の流れで進めれば十分です。

```sh
git add .
git commit -m "Initial scene site"
git remote add origin <GitHub のリポジトリ URL>
git push -u origin main
```

GitHub 側のリポジトリは空で作る前提が安全です。README や .gitignore を GitHub 側で追加せず、空リポジトリにしてから remote をつなぐほうが衝突しません。

## Cloudflare Pages 設定

GitHub と接続したら、Cloudflare Pages では次の設定で開始できます。

- Production branch: main
- Framework preset: Astro
- Build command: npm run build
- Build output directory: dist
- Root directory: /
- Node.js version: .node-version に合わせて 22.16.0

追加の環境変数は、今の静的サイト構成では不要です。

Cloudflare Pages の build image v3 では、Node.js は .node-version か .nvmrc で固定できます。このリポジトリでは .node-version を置いて、Pages 側のビルド差異を減らしています。

## カスタムドメイン

本番想定ドメインは次です。

- scene.robinfactory.co.jp

公開対象の防犯ベストサイトは次のURLになります。

- https://scene.robinfactory.co.jp/bouhan-vest/

## デプロイ後の確認

公開後は少なくとも次を確認します。

- / が scene の入口ページとして開く
- /bouhan-vest/ 以下の 5 ページがすべて開く
- ヘッダー、フッター、CTA のリンクが /bouhan-vest/ 配下に向いている
- canonical が scene.robinfactory.co.jp 基準になっている
- privacy ページだけ noindex になっている

## 補足

- Astro の site 設定は astro.config.mjs で scene.robinfactory.co.jp に固定済みです。
- bouhan-vest の内部リンクは src/data/site.ts から生成する形にしてあるため、今後別シーンを増やすときも同じやり方で展開できます。
