# ネットラジオ シェルスクリプト

## 「らじる★らじる」シェルスクリプト

usage: ./rec-nhk-radio.sh {NHK1|NHK2|FM} {長さ(分)} {番組名} {番組パーソナリティ} {出力ディレクトリ}

NHKラジオのストリーミングサービス「らじる★らじる」を.m4a形式で指定した出力ディレクトリに保存する。ファイル名称は"*番組名* (*保存開始時刻(YYYYMMDD_hhmmss)*).m4a"。エリアは関東とした。

下記文字列を対応するタグに埋め込む。

| 文字列                     | タグ         |
| -------------------------- | ------------ |
| ラジオ                     | genre        |
| *番組パーソナリティ*       | album_artist |
| *番組名* *YYYY/MM/DD* 放送 | title        |
| *番組名*                   | album        |
| *保存開始時刻(YYYY/MM/DD)* | date         |

### 実行例

```bash
$ ./rec-nhk-radio.sh FM  120 "ジャズ・トゥナイト" "大友 良英" "/mnt/Music/ラジオ/NHK FM/ジャズ・トゥナイト"
$ ls "/mnt/Music/ラジオ/NHK FM/ジャズ・トゥナイト"
'ジャズ・トゥナイト (20200411_230001).m4a'
```

### cron 例

```bash
30 19 * * 1-5 /home/pi/rec-nhk-radio.sh FM  100 "ベストオブクラシック" "" "/mnt/Music/ラジオ/NHK FM/ベストオブクラシック"
 0 18 * * 6   /home/pi/rec-nhk-radio.sh FM   50 "ザ・ソウルミュージックII" "村上 てつや" "/mnt/Music/ラジオ/NHK FM/ザ・ソウルミュージックII"
20 19 * * 6   /home/pi/rec-nhk-radio.sh FM  100 "N響 ザ・レジェンド" "檀 ふみ / 池辺 晋一郎" "/mnt/Music/ラジオ/NHK FM/N響 ザ・レジェンド"
 0 23 * * 6   /home/pi/rec-nhk-radio.sh FM  120 "ジャズ・トゥナイト" "大友 良英" "/mnt/Music/ラジオ/NHK FM/ジャズ・トゥナイト"
30  8 * * 1-5 /home/pi/rec-nhk-radio.sh NHK2 10 "英会話タイムトライアル" "スティーブ・ソレイシィ" "/mnt/Music/ラジオ/NHK NHK2/英会話タイムトライアル"
 0  7 * * 6   /home/pi/rec-nhk-radio.sh NHK2 50 "英会話タイムトライアル" "スティーブ・ソレイシィ" "/mnt/Music/ラジオ/NHK NHK2/英会話タイムトライアル"
```
