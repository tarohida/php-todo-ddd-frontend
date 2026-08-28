# php-todo-ddd-frontend

Vue 3 / Vite で構築した todo Web API のフロントエンドです。認証なしのバックエンド API と組み合わせて動作します。

## Docker で起動

先にバックエンドを起動します。

```bash
cd ../php-todo-ddd
test -f .env || cp .env.example .env
docker compose run --rm composer install
docker compose up -d --build
docker compose exec php composer migrate
```

次に、このリポジトリでフロントエンドを起動します。

```bash
cp .env.example .env.local
docker compose --env-file .env.local up --build
```

http://localhost:8080 を開きます。`VITE_BACKEND_URL` はコンテナ内部の API URL ではなく、ブラウザから到達できる公開 URL を指定します。

`VITE_` で始まるすべての値はブラウザへ公開され、開発サーバーの起動時またはビルド時にコードへ埋め込まれます。パスワード、トークンなどの秘密情報を設定しないでください。値を変更した場合は、開発コンテナの再起動または本番アセットの再ビルドが必要です。Compose はソースをbind mountし、依存関係だけをDocker volumeへ保持するため、ホスト側の編集がHMRで反映されます。

依存関係を含めて開発環境を作り直す場合は、次のコマンドでコンテナと`node_modules` volumeを削除してから再起動します。

```bash
docker compose down -v
docker compose --env-file .env.local up --build
```

別端末から開く場合は、フロントエンドの `.env.local` を `FRONTEND_BIND_ADDRESS=0.0.0.0`、`VITE_BACKEND_URL=http://<Docker ホスト>:8081` に変更します。バックエンド側も `.env` の `BACKEND_BIND_ADDRESS=0.0.0.0` と `ALLOW_ORIGIN_URL=http://<Docker ホスト>:8080` を設定し、必要なポートだけをファイアウォールで許可してください。

## Runtime and dependencies

2026-08-28 時点のサポート中の安定版へ更新しています。

- Node.js 24.20.0 LTS / npm 11.19.0（公式 Node イメージ同梱版）
- Vue 3.5.42 / Vite 8.2.2
- Axios 1.20.0 / Bootstrap 5.3.8
- ESLint 10.9.1 / eslint-plugin-vue 10.10.0

Node.js 24 は Active LTS です。保守モードの Vue CLI 4 から Vue 公式が推奨する Vite ベースへ移行しました。参照: [Node.js releases](https://nodejs.org/en/about/previous-releases)、[Node.js v24 archive](https://nodejs.org/en/download/archive/v24)、[Vue CLI maintenance notice](https://cli.vuejs.org/)、[Vite guide](https://vite.dev/guide/)。

## Project setup

```
npm ci
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints files

```
npm run lint
```
