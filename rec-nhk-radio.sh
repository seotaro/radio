#!/bin/bash

# 変数とコマンド・予約語を区別したいので変数名は大文字にしている。

LANG=ja_JP.utf8
NOW=`date '+%s'`

if [ $# -ne 5 ]; then
  echo "usage: $0 {NHK1|NHK2|FM} 長さ(分) 番組名 番組パーソナリティ 出力ディレクトリ"
  exit 1
fi

# ハンドリングしやすいように引数を変数にマップする。
CHANNEL=$1
DURATION=`expr $2 \* 60`
PROGRAM_NAME=$3
PERSONALITY=$4
DIRECTORY=$5

# 作業用ディレクトリを作成して、一時ファイルはここに出力する。
TMP="/tmp/rec-nhk-radio"
mkdir -p ${TMP}

# slack web hook URL
WEBHOOK_URL="https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx"

# チャンネルのURLをセットする。
# http://www.nhk.or.jp/radio/config/config_web.xml を参照のこと。
M3U8URL=""
case ${CHANNEL} in
    "NHK1")
      M3U8URL="https://radio-stream.nhk.jp/hls/live/2023229/nhkradiruakr1/master.m3u8"
      ;;
    
    "NHK2")
      M3U8URL="https://radio-stream.nhk.jp/hls/live/2023501/nhkradiruakr2/master.m3u8"
      ;;

    "FM")
      M3U8URL="https://radio-stream.nhk.jp/hls/live/2023507/nhkradiruakfm/master.m3u8"
      ;;

    *)
      echo "failed channel"
      exit 1
      ;;
esac
 

# ハンドリングしやすいようにffmpegで書き込むメタデーターを別の変数にマップする。
METADATA_GENRE="ラジオ"
METADATA_ALBUM_ARTIST=${PERSONALITY}
METADATA_TITLE="${PROGRAM_NAME} `date --date=@${NOW} '+%Y/%m/%d'` 放送"
METADATA_ALBUM=${PROGRAM_NAME}
METADATA_DATE=`date --date=@${NOW} '+%Y/%m/%d %H:%M:%S'`

FILENAME="${PROGRAM_NAME} (`date --date=@${NOW} '+%Y%m%d_%H%M%S'`)"

curl --silent ${M3U8URL} -o "${TMP}/${FILENAME}.m3u8"

ffmpeg -loglevel quiet \
        -y -i ${M3U8URL} \
        -t ${DURATION} \
        -metadata genre="${METADATA_GENRE}" \
        -metadata album_artist="${METADATA_ALBUM_ARTIST}" \
        -metadata title="${METADATA_TITLE}" \
        -metadata album="${METADATA_ALBUM}" \
        -metadata date="${METADATA_DATE}" \
        -c copy "${TMP}/${FILENAME}.m4a"


# エラー時にファイルを保存する。
if [ $? -ne 0 ]; then
  cp "${TMP}/${FILENAME}.m3u8" "${DIRECTORY}/${FILENAME}-before.m3u8"
  curl --silent ${M3U8URL} -o "${DIRECTORY}/${FILENAME}-after.m3u8"
  touch "${DIRECTORY}/${FILENAME}-error"
fi

# slack に投稿する。
if [ $? -eq 0 ]; then
  POST_MESSAGE="payload={\"channel\": \"#rec-radio\", \"username\": \"${HOSTNAME}\", \"text\": \"「${PROGRAM_NAME}（${FILENAME}.m4a）」を保存しました。\", \"icon_emoji\": \":smile:\"}"
else
  POST_MESSAGE="payload={\"channel\": \"#rec-radio\", \"username\": \"${HOSTNAME}\", \"text\": \"「${PROGRAM_NAME}（${FILENAME}.m4a）」の保存中にエラーが発生しました。\", \"icon_emoji\": \":scream:\"}"
fi
curl --silent -X POST --data-urlencode "${POST_MESSAGE}" ${WEBHOOK_URL}

mkdir -p "${DIRECTORY}"
cp "${TMP}/${FILENAME}.m4a" "${DIRECTORY}/${FILENAME}.m4a"
rm -f "${TMP}/${FILENAME}.m4a"
rm -f "${TMP}/${FILENAME}.m3u8"

exit 0
