#!/bin/bash

# 変数とコマンド・予約語を区別したいので変数名は大文字にしている。

LANG=ja_JP.utf8
PID=$$
NOW=`date '+%s'`

if [ $# -ne 5 ]; then
  echo "usage: $0 {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} 長さ(分) 番組名 番組パーソナリティ 出力ディレクトリ"
  echo ""
  echo "TBS=TBSラジオ, QRR=文化放送, LFR=ニッポン放送, INT=InterFM897, "
  echo "FMT=TOKYO FM, FMJ=J-WAVE, JORF=ラジオ日本, BAYFM78=bayfm78, "
  echo "NACK5=NACK5, YFM=FMヨコハマ, ..."
  echo "放送局IDは http://radiko.jp/v3/station/region/full.xml を参照のこと。"
  exit 1
fi

# ハンドリングしやすいように引数を変数にマップする。
CHANNEL=$1
DURATION=`expr $2 \* 60`
PROGRAM_NAME=$3
PERSONALITY=$4
DIRECTORY=$5

# 作業用ディレクトリを作成して、一時ファイルはここに出力する。
TMP="/tmp/rec-radiko"
mkdir -p ${TMP}

#
# access auth1_fms
#

AUTH1_FMS_FILE="${TMP}/auth1_fms_${PID}"

if [ -f ${AUTH1_FMS_FILE} ]; then
  rm -f ${AUTH1_FMS_FILE}
fi

wget -q \
  --header="pragma: no-cache" \
  --header="X-Radiko-App: pc_html5" \
  --header="X-Radiko-App-Version: 0.0.1" \
  --header="X-Radiko-User: test-stream" \
  --header="X-Radiko-Device: pc" \
  --post-data='\r\n' \
  --no-check-certificate \
  --save-headers \
  -O ${AUTH1_FMS_FILE} \
  https://radiko.jp/v2/api/auth1_fms

if [ $? -ne 0 ]; then
  echo "failed auth1 process"
  exit 1
fi


#
# get partial key
#   
AUTHKEY="bcd151073c03b352e1ef2fd66c32209da9ca0afa"
AUTHTOKEN=`perl -ne 'print $1 if(/X-RADIKO-AUTHTOKEN: ([\w-]+)/i)' ${AUTH1_FMS_FILE}`
OFFSET=`perl -ne 'print $1 if(/x-radiko-keyoffset: (\d+)/i)' ${AUTH1_FMS_FILE}`
LENGTH=`perl -ne 'print $1 if(/x-radiko-keylength: (\d+)/i)' ${AUTH1_FMS_FILE}`
PARTIAL_KEY=`echo ${AUTHKEY} | dd bs=1 skip=${OFFSET} count=${LENGTH} 2> /dev/null | base64`

rm -f ${AUTH1_FMS_FILE}


#
# access auth2_fms
#

AUTH2_FMS_FILE="${TMP}/auth2_fms_${PID}"

if [ -f ${AUTH2_FMS_FILE} ]; then  
  rm -f ${AUTH2_FMS_FILE}
fi

wget -q \
  --header="pragma: no-cache" \
  --header="X-Radiko-User: dummy-user" \
  --header="X-Radiko-Device: pc" \
  --header="X-Radiko-AuthToken: ${AUTHTOKEN}" \
  --header="X-Radiko-PartialKey: ${PARTIAL_KEY}" \
  --post-data='\r\n' \
  --no-check-certificate \
  -O ${AUTH2_FMS_FILE} \
  https://radiko.jp/v2/api/auth2_fms

if [ $? -ne 0 -o ! -f ${AUTH2_FMS_FILE} ]; then
  echo "failed auth2 process"
  exit 1  
fi

rm -f ${AUTH2_FMS_FILE}


#
# streamのURLを取得する。
#

STREAM_FILE="${TMP}/${CHANNEL}.xml"

if [ -f ${STREAM_FILE} ]; then
  rm -f ${STREAM_FILE}
fi

wget -q "http://radiko.jp/v2/station/stream_smh_multi/${CHANNEL}.xml" -O ${STREAM_FILE}
STREAM_URL=`xmllint --xpath "/urls/url[@areafree='0'][1]/playlist_create_url/text()" ${STREAM_FILE}`

rm -f ${STREAM_FILE}

# ハンドリングしやすいようにffmpegで書き込むメタデーターを別の変数にマップする。
METADATA_GENRE="ラジオ"
METADATA_ALBUM_ARTIST=${PERSONALITY}
METADATA_TITLE="${PROGRAM_NAME} `date --date=@${NOW} '+%Y/%m/%d'` 放送"
METADATA_ALBUM=${PROGRAM_NAME}
METADATA_DATE=`date --date=@${NOW} '+%Y/%m/%d %H:%M:%S'`

FILENAME="${PROGRAM_NAME} (`date --date=@${NOW} '+%Y%m%d_%H%M%S'`)"

ffmpeg -loglevel quiet \
  -y \
  -fflags +discardcorrupt \
  -headers "X-Radiko-Authtoken: ${AUTHTOKEN}" \
  -i "${STREAM_URL}" \
  -metadata genre="${METADATA_GENRE}" \
  -metadata album_artist="${METADATA_ALBUM_ARTIST}" \
  -metadata title="${METADATA_TITLE}" \
  -metadata album="${METADATA_ALBUM}" \
  -metadata date="${METADATA_DATE}" \
  -t ${DURATION} \
  -c copy "${TMP}/${FILENAME}.m4a"

mkdir -p "${DIRECTORY}"
cp "${TMP}/${FILENAME}.m4a" "${DIRECTORY}/${FILENAME}.m4a"
rm -f "${TMP}/${FILENAME}.m4a"

exit 0
