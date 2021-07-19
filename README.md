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

## らじる☆らじる 聴き逃し

いわゆるオンデマンド配信。
対象番組は放送から1週間程度。

[聴き逃し番組を探す](https://www.nhk.or.jp/radio/ondemand/)

- [新着](https://www.nhk.or.jp/radioondemand/json/index_v3/index.json)
- [放送日](https://www.nhk.or.jp/radioondemand/json/index_v3/index_housoubi.json)
- [ジャンル](https://www.nhk.or.jp/radioondemand/json/index_v3/index_genre.json)
- [50音](https://www.nhk.or.jp/radioondemand/json/index_v3/index_50on.json)

新着の json から"ジャズ・トゥナイト"を抜粋

```json
{
    "data_list": [
      {
            "site_id": "0449",
            "program_name": "ジャズ・トゥナイト",
            "program_name_kana": "じゃずとぅないと",
            "media_code": "07",
            "corner_id": "01",
            "corner_name": "",
            "thumbnail_p": "https://www.nhk.or.jp/prog/img/449/g449.jpg",
            "thumbnail_c": null,
            "open_time": "2021-07-18T01:00:00+09:00",
            "close_time": "2021-07-25T01:00:00+09:00",
            "onair_date": "2021年7月17日(土)放送",
            "link_url": null,
            "start_time": "2021-07-17T23:00:00+09:00",
            "update_time": "2021-07-19T09:36:09+09:00",
            "dev": "2021-07-19T10:11:52.163+09:00",
            "detail_json": "https://www.nhk.or.jp/radioondemand/json/0449/bangumi_0449_01.json"
        }
    ]
}
```

detail_json

```json
{
    "main": {
        "site_id": "0449",
        "program_name": "ジャズ・トゥナイト",
        "mode": 0,
        "media_type": "radio",
        "media_code": "07",
        "media_name": "NHK-FM",
        "site_detail": "番組の案内役は、音楽家の大友良英さん。\r\n世界各国の最先端のジャズからクラシック・ジャズまでを、大友さんならではの視点で幅広く紹介します。番組の前半では毎回さまざまなテーマを設定した特集を、番組後半では内外の新譜を中心に紹介しています。",
        "thumbnail_p": "https://www.nhk.or.jp/prog/img/449/g449.jpg",
        "thumbnail_c": null,
        "schedule": "毎週土曜 午後11時（最終週除く）",
        "official_url": "https://www4.nhk.or.jp/jazz/",
        "share_url": "https://www2.nhk.or.jp/radio/pg/sharer.cgi?p=0449_01",
        "corner_id": "01",
        "corner_name": null,
        "corner_detail": null,
        "program_index": false,
        "cast": null,
        "dev": "2021-07-19T10:19:55.868+09:00",
        "detail_list": [
            {
                "headline_id": "3668350",
                "headline": null,
                "headline_sub": null,
                "headline_image": null,
                "file_list": [
                    {
                        "seq": 1,
                        "file_id": "3668350",
                        "file_title": "ジャズ・トゥナイト　▽海ＪＡＺＺ特集",
                        "file_title_sub": "当番組名物（？）の「〇〇ジャズ特集」今回は夏らしく「海ＪＡＺＺ」をお届けします。いったいどんな曲がかかるのか・・・みなさんも予想してお楽しみください！",
                        "file_name": "https://nhks-vh.akamaihd.net/i/radioondemand/r/449/s/stream_449_8a922946f2b853d78d898c942c86dc93.mp4/master.m3u8",
                        "open_time": "2021-07-18T01:00:00+09:00",
                        "close_time": "2021-07-25T01:00:00+09:00",
                        "onair_date": "7月17日(土)午後11:00放送",
                        "share_url": "https://www2.nhk.or.jp/radio/pg/sharer.cgi?p=0449_01_3668350",
                        "aa_contents_id": "[radio]vod;ジャズ・トゥナイト　▽海ＪＡＺＺ特集;r3,130;2021071772009;2021-07-17T23:00:00+09:00_2021-07-18T01:00:00+09:00",
                        "aa_measurement_id": "vod",
                        "aa_vinfo1": "ジャズ・トゥナイト　▽海ＪＡＺＺ特集",
                        "aa_vinfo2": "r3,130",
                        "aa_vinfo3": "2021071772009",
                        "aa_vinfo4": "2021-07-17T23:00:00+09:00_2021-07-18T01:00:00+09:00"
                    }
                ]
            }
        ]
    }
}
```

ffmpeg でダウンロードしてみる。

```make
M3U8URL := https://nhks-vh.akamaihd.net/i/radioondemand/r/449/s/stream_449_8a922946f2b853d78d898c942c86dc93.mp4/master.m3u8
DURATION := 120
TMP := tmp
FILENAME := filename

METADATA_GENRE := ラジオ
METADATA_ALBUM_ARTIST := 大友良英
METADATA_TITLE := 7月17日(土)午後11:00放送「ジャズ・トゥナイト　▽海ＪＡＺＺ特集」
METADATA_ALBUM := ジャズ・トゥナイト
METADATA_DATE := 2021-07-17 23:00:00
METADATA_COMMENT := 当番組名物（？）の「〇〇ジャズ特集」今回は夏らしく「海ＪＡＺＺ」をお届けします。いったいどんな曲がかかるのか・・・みなさんも予想してお楽しみください！

download:
	mkdir -p ${TMP}
	ffmpeg  \
			-y -i ${M3U8URL} \
			-t ${DURATION} \
			-metadata genre="${METADATA_GENRE}" \
			-metadata album_artist="${METADATA_ALBUM_ARTIST}" \
			-metadata title="${METADATA_TITLE}" \
			-metadata album="${METADATA_ALBUM}" \
			-metadata date="${METADATA_DATE}" \
			-metadata comment="${METADATA_COMMENT}" \
			-c copy "${TMP}/${FILENAME}.m4a"
```
