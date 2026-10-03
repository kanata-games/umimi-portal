# ウミミポータル — 引き継ぎメモ

新しい会話でポータルを続けるときは、まずこのメモを読んでください。
（このファイルは GitHub の CLAUDE.md と、アーティファクトに同梱する handoff.md の両方に使う。`python3 build.py` で handoff.md にコピーされる）

## 公開先
| 名前 | URL | 備考 |
|---|---|---|
| 本番（ポータル） | https://claude.ai/artifact/HggNv5joTNLMBmE4LBaL5H | 友達に共有するのはここ。いまは非公開（共有はユーザーがページの共有メニューから） |
| GitHub | https://github.com/kanata-games/umimi-portal | 控え。Pages をオンにすると https://kanata-games.github.io/umimi-portal/ が予備リンクになる |
| 前のウミミダービー（単独版） | https://claude.ai/artifact/PYEKLnLzBZFj4eyh182WPh | 今後は更新しない。ホームの「ウミミポータルへ ひっこす」でデータ移行コード（UMDSAVE1-）を出せる |
| ウミミの箱庭（本番） | https://claude.ai/artifact/NnwrAc1v6XpEGsrDqoFUuw | 別プロジェクト（kanata-games/umimi）。ポータルからはリンクだけ |

## 進め方（毎回これ）
1. 新しい会話では、このリポジトリを読み込んでから作業する。アーティファクトの最新版と食い違うときは、`Artifact` の read で本番を読んで合わせる
2. 変更したら `python3 build.py`（index.html と handoff.md を作る）
3. アーティファクトを公開しなおす：本体は `source/index.html`、`files` に core.js・derby.html・alarm.html・slot.html（ほかのゲームの html も）・png 3つ・handoff.md（contentType は "text/markdown"）。別の会話からは本番の URL を `url` に渡して更新する（先に read が必要）
4. 公開したら、このリポジトリにもコミットして push する
5. セーブ互換を守る：ウミミ帳 `umimi-book-v1`、ダービー `umimi-derby-v1`、スロット `umimi-slot-v1`。項目を足すときは読み込み時に初期値を入れる

## 概要
- ユーザー：kanata-games（返答は必ず日本語で）。Windows。PCは古めなので軽さを優先する
- ウミミ：ユーザーのキャラ。白い「月のウミウシうさぎ」で、おでこに三日月。生みの親はリリィさん
- 遊ぶのは友達との暇つぶし。販売はしない
- ポータル＝1つのアーティファクトの中に、ゲームごとの html ページを入れたもの。ページどうしは同じ場所あつかいなので localStorage を共有できる
- ウミミの箱庭はポータルに入れない（友達が本番リンクで遊んでいるため）。ポータルからは本番リンクへのカードだけ置く

## ファイル（すべて同じアーティファクトに公開する）
| ファイル | 役目 |
|---|---|
| source/index.html | ポータルのトップ（アーティファクトの本体ページ。doctype なし）。ゲーム一覧、ウミミ帳のまとめ、データのバックアップ・ひっこし |
| index.html | Pages 用。build.py で source/index.html に head を足して作る（直接編集しない） |
| build.py | index.html と handoff.md を作る |
| core.js | 全ゲーム共通の部品。`window.UMI` に入っている |
| derby.html | ウミミダービー（16週の育成レース） |
| alarm.html | ウミミめざまし（めざまし時計。Web Audio で音を鳴らす。設定は localStorage `umimi-alarm-v1`。ページを開いたままでないと鳴らない） |
| slot.html | ウミミスロット。最初に台えらび。台の決まりは `MACH` に1台ずつ（lever / after / bonusEnd）。リール・抽選・すべり・音・絵は共通。セーブ `umimi-slot-v1`：メダル・設定は全台共通、台ごとのデータは `m.moon` `m.time`（1台だったころのセーブは読み込み時に m.moon へ移す）。つきのかけらはボーナス後に BIG+30/REG+10、タイム後+20、全台で1日200まで |
| umimi-sprites.png | ウミミ10コマ（セル 245x222） |
| costumes.png | 勝負服の絵（箱庭の衣装シートと同じ。セル 240x208、8列） |
| visitors.png | 海のなかま10種×2コマ |
| CLAUDE.md / handoff.md | このメモ（handoff.md は build.py が作るコピー） |

- 公開：Artifact で index.html を本体にし、のこりは `files` で同梱する
- source/index.html はアーティファクトの骨組みでつつまれるので doctype なしで書く。ほかの html（derby.html など）は **doctype・charset・viewport・body{margin:0} を自分で書く**
- ゲームページからトップへは `<a href="./">`、トップからゲームへは `<a href="derby.html">`

## core.js（window.UMI）
- 色：`PALS`（6色）、`RECOLOR`、`recolorSheet()`
- 絵：`drawUmi(ctx, 色, コマ, 足もとx, 足もとy, 大きさ, 向き(1=右,-1=左), 勝負服キー)`。コマ 0-1=ふつう、2-3=およぐ、4=きらきら、5-6=ねる、7-9=よろこぶ。勝負服を着ているときは1枚絵を揺らして表現する
- なかま：`VIS`、`CREA`（生き物の名前）、`drawVis(ctx, 生き物, x, y, 大きさ, コマ, 向き)`
- カード：`CARDS`（15枚）、`CARD[id]`、`RAR`（R/SR/SSR の強さと確率）
- 勝負服：`DRESSES`（15着。SSRは固有スキル u_〜 を持つ）、`DRESS_KEYS`、`DRESS_RATE`、`DRESS_TICKET_SHARDS`
- `drawIcons(root)`：`canvas[data-vis]` と `canvas[data-dress]` を描く
- `fitCanvas(cv, 最大dpr)`、`onAssets(fn)`：画像の読み込みが終わるたびに呼ばれる
- ウミミ帳：`loadBook()` / `saveBook(b)`。localStorage `umimi-book-v1`
  - `shards` つきのかけら / `cards` なかまカード {id:枚数} / `ssrTickets` `tenCount` なかまガチャ / `dresses` 勝負服 {key:1} / `dressTickets` 勝負服チケット / `hall` でんどうの子 / `nextId`

## セーブのルール
- 全ゲーム共通のものはウミミ帳へ。ゲームだけのものは、ゲームごとのキーに分ける（ダービーは `umimi-derby-v1`）
- 項目を足すときは、読み込み時に初期値を入れて古いデータが壊れないようにする
- ダービーの `save()` は、BOOK_KEYS をウミミ帳へ、それ以外をダービーのキーへ書き分けている

## コード
- `UMDB1-` + base64(JSON)：でんどうの子1匹（友達との対戦用）。n,c,p,s[5],k(スキル),a(適性8文字),g(作戦),o(勝負服)
- `UMBOOK1-`：ウミミ帳のバックアップ（ポータルの「データ」）
- `UMDSAVE1-`：前のウミミダービー（単独版）からのひっこし用。前の版のホームの「ウミミポータルへ ひっこす」で出す

## 新しいゲームの足し方
1. `newgame.html` を作る（doctype から書く）。`<script src="core.js"></script>` を先に読み込み、`UMI` を使う。上に `<a href="./">← ポータル</a>` を置く
2. ゲームだけのセーブは `umimi-<ゲーム名>-v1` に。かけらなどは `UMI.loadBook()` で読み、変えたら `UMI.saveBook()`
3. source/index.html の `GAMES` の行の `st:'soon'` を `st:'play'` にして `href` を入れる
4. 同じアーティファクトに `files` で新しい html を足して公開しなおす（ほかのファイルはそのまま残る）
- 構想中：ウミミデュエル（なかまカードでカードバトル）、ウミミクエスト（RPG）、ウミミの冒険、ウミミエグゼ、ウミミソウル
- 名前が元ネタのゲームに近いものは、配信など広く見せるときは名前をずらす

## ウミミダービーのおもな中身
- 16週・レース3回（4週目デビュー戦、10週目夏の大一番、16週目最終決戦。それぞれ2レースから選ぶ）。ライバル「セレネ」が毎回出る物語つき
- 出走9匹。作戦（にげ/せんこう/さし/おいこみ）と距離（短/マイル/中/長）の適性 S〜G
- スキルpt とヒント、スキル20種＋勝負服の固有スキル5種
- なかまガチャ（10連でSR以上確定、10連5回ごとにSSR確定チケット）、勝負服ガチャ（チケット制）
- みんなでレース：でんどうの子や友達のコードの子で最大9匹

## ウミミスロットの台
- ムーンランプ（moon）：ジャグラー風。ランプがペカると月光BIG(20G)/ウミミREG(8G)。アシストONで出玉率約100%、OFFだと取りこぼしで約88%
- ウミミタイム（time）：演出もりもり。予告（セリフの色 白<青<緑<赤<虹=BIG確定、流れ星、なかまの行進、赤ストップ）→第3停止後に「ボーナス確定」告知。満月チャンス（1/220で突入、10G、成功率約6割）。BIG後は必ず・REG後は半分でウミミタイム（30G、クラゲがよくそろう、1/50で上乗せ 5〜100G、タイム中のボーナスは+30G/+10G）。天井800Gで月光確定。出玉率約102%（シミュレーション）
- 台を足すときは `MACH` に1つ足し、`MKEYS` に入れて、台えらびのサムネ（drawThumbs）を描く

## やってはいけないこと
- GitHub で書き込むのは kanata-games/umimi-portal（ポータル）と kanata-games/umimi（箱庭、その会話の作業のときだけ）。meteo-flick、rockside、konkantan は Grok や ChatGPT が使っているので触らない
- 新しいリポジトリの作成はこちらからはできない（ポリシーで止められる）。必要ならユーザーに作ってもらう
- 本番の箱庭をポータルの中に移さない（友達のセーブが消えるため）。移すならユーザーと相談し、引き継ぎコードを用意してから
- コミットの末尾には、指示された Co-Authored-By と Claude-Session の行を付ける
