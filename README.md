# ネットラジオ シェルスクリプト

## 「らじる★らじる」シェルスクリプト

```bash
usage: ./rec-nhk-radio.sh {NHK1|NHK2|FM} 長さ(分) 番組名 番組パーソナリティ 出力ディレクトリ
```

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
./rec-nhk-radio.sh FM  120 "ジャズ・トゥナイト" "大友 良英" "/mnt/Music/ラジオ/NHK FM/ジャズ・トゥナイト"
ls "/mnt/Music/ラジオ/NHK FM/ジャズ・トゥナイト"
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

## radiko シェルスクリプト

```bash
usage: ./rec-radiko.sh {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} 長さ(分) 番組名 番組パーソナリティ 出力ディレクトリ
```

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
./rec-radiko.sh FMT 55 "桑田佳祐のやさしい夜遊び" "桑田 佳祐" "/mnt/nas/m4a/TOKYO FM/桑田佳祐のやさしい夜遊び"
ls "/mnt/nas/m4a/TOKYO FM/桑田佳祐のやさしい夜遊び"
'桑田佳祐のやさしい夜遊び (20200411_230001).m4a'
```

### cron 例

```bash
 0 23 * * 6 /home/pi/media-server/raspberrypi/rec-radiko.sh JORF     60 "オトナのJAZZ TIME" "紗理" "/mnt/nas/m4a/ラジオ日本/オトナのJAZZ TIME"
 0  9 * * 6 /home/pi/media-server/raspberrypi/rec-radiko.sh YFM     120 "FUTURESCAPE" "小山 薫堂 / 柳井 麻希" "/mnt/nas/m4a/FMヨコハマ/FUTURESCAPE"
30  2 * * 6 /home/pi/media-server/raspberrypi/rec-radiko.sh YFM      30 "濱ジャズ" "ゴンザレス鈴木" "/mnt/nas/m4a/FMヨコハマ/濱ジャズ"
 0 23 * * 6 /home/pi/media-server/raspberrypi/rec-radiko.sh FMT      55 "桑田佳祐のやさしい夜遊び" "桑田 佳祐" "/mnt/nas/m4a/TOKYO FM/桑田佳祐のやさしい夜遊び"
 0 14 * * 7 /home/pi/media-server/raspberrypi/rec-radiko.sh FMT      55 "山下達郎のサンデー・ソングブック" "山下 達郎" "/mnt/nas/m4a/TOKYO FM/山下達郎のサンデー・ソングブック"
 0 21 * * 7 /home/pi/media-server/raspberrypi/rec-radiko.sh FMT      55 "SPITZ 草野マサムネのロック大陸漫遊記" "草野 マサムネ" "/mnt/nas/m4a/TOKYO FM/SPITZ 草野マサムネのロック大陸漫遊記"
 0  3 * * 1 /home/pi/media-server/raspberrypi/rec-radiko.sh BAYFM78  27 "PONTSUKA!!" "BUMP OF CHICKEN" "/mnt/nas/m4a/bayfm78/PONTSUKA!!"
```
