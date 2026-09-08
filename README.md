# Edward Fox 自己紹介 — 紙のジオラマ 3D ポートフォリオ

ノートの罫線紙の上をキツネが乗り物で走っていく横スクロールの自己紹介サイト。
[Mr. Panda's Psychologically Safe Portfolio](https://github.com/andrewwoan/mr-pandas-psychologically-safe-portfolio)（Andrew Woan, MIT）の
スクロール→カーブ→カメラ、無限ループの仕組みを参考にしつつ、絵は Canvas 2D で手描き風にプロシージャル生成しています（Blender / 画像素材不要）。

## 使い方

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ に静的ファイルを出力（Vercel / Netlify / GitHub Pages などにそのまま置ける）
```

`?debug` を付けて開くと progress / fps / 主人公の座標が左下に出ます（dev のみ）。

## コンテンツの差し替え

- 本文はすべて `src/content.json`。カードの見出し・行・URL・写真パスを編集するだけで反映されます。
- 写真は `public/photos/` に置いてパスを書く（`hero.photo` = 主人公の顔写真、`scene4.photo.src` = 江ノ電の写真）。
  写真が `null` の間はキツネの顔 / 灰色のプレースホルダが表示されます。
- 各シーンの小物の配置は `src/Experience/scenes/Scene1..5.jsx`、絵は `src/Experience/paper/sketches.js`。
- 乗り物の切替タイミングやカメラ経路は `src/Experience/curve.js`。

## 構成

| ファイル | 役割 |
|---|---|
| `src/Experience/Experience.jsx` | Canvas、ホイール / ドラッグ / スワイプ / キー入力 → progress |
| `src/Experience/Scene.jsx` | progress → カメラ位置・向き、ワールドと 1 枚紙のループ処理 |
| `src/Experience/Hero.jsx` | 主人公（写真の顔 + 紙の体）と乗り物の切替 |
| `src/Experience/paper/PaperCard.jsx` | 押し出した紙カード（タイトル / 本文 / 手書き） |
| `src/Experience/paper/PaperSprite.jsx` | Canvas に描いた板ポリの切り抜き + 棒 |
| `src/Experience/paper/PaperPhoto.jsx` | ポラロイド風写真 |
| `src/Experience/paper/sketches.js` | 小物・乗り物の描画関数 |
| `src/Experience/paper/Environment.jsx` | ノートの壁・芝生の床・小道 |

フォントは Google Fonts（Zen Kurenaido / Yomogi / Patrick Hand）。オフライン時は 4 秒でフォールバックして起動します。
