'use strict';

require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const { execSync } = require('child_process');

// const DIRECTORY = process.env.DIRECTORY || '.';
const DIRECTORY = './manual-download'
fs.mkdirSync(DIRECTORY, { recursive: true });

if (process.argv.length !== 3) {
    console.log('usage: node download.js json-url');
    console.log('');
    console.log('Example usage:');
    console.log('  node download.js https://www.nhk.or.jp/radioondemand/json/5915/bangumi_5915_01.json');
    process.exit(-1);
}
const url = process.argv[2];

(async () => {

    const json = await fetch(url)
        .then(response => {
            return response.text();
        })
        .then(text => {
            return JSON.parse(text);
        })
        .catch((error) => {
            console.error(error)
        });

    // ファイル単位に集計する。
    let items = [];
    for (const detail of json.main.detail_list) {
        for (const file of detail.file_list) {
            const item = { main: { detail: { file: {} } } };
            for (const k in json.main) {
                if (k === 'detail_list') {
                    continue;
                }
                item.main[k] = json.main[k];
            }
            for (const k in detail) {
                if (k === 'file_list') {
                    continue;
                }
                item.main.detail[k] = detail[k];
            }
            item.main.detail.file = file;

            items.push(item)
        }
    }

    for (const item of items) {
        try {
            const command = makeFfmpegCommandLine(DIRECTORY, item.main.program_name, item.main.detail.file);
            console.log(command);
            fs.mkdirSync(`${DIRECTORY}/${item.main.program_name}`, { recursive: true });
            execSync(command)

            console.log(`${(new Date()).toISOString()} download program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id}`);

        } catch (err) {
            console.error(`${(new Date()).toISOString()} program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id} is ${err}`);
        }
    }
})();

const makeFfmpegCommandLine = (directory, programName, file) => {
    const datetimes = file.aa_vinfo4.split('_');
    const start = new Date(datetimes[0]);
    const end = new Date(datetimes[1]);
    const duration = (end - start) / 1000 - 1; // [秒]
    const command = [
        `ffmpeg`,
        `-loglevel verbose`,
        `-t ${duration}`,
        `-y -i ${file.file_name.split('?')[0]}`,
        `-metadata genre="ラジオ"`,
        `-metadata album_artist=""`,
        `-metadata title="${file.file_title}"`,
        `-metadata album="${programName}"`,
        `-metadata date="${moment(start).format("YYYY-MM-DD HH:mm:ss")}"`,
        `-metadata comment="${file.file_title_sub}"`,
        `-c copy "${directory}/${programName}/${programName}（${moment(start).format("YYYYMMDD_HHmmss")}）.m4a"`
    ];

    return command.join(' ');
}


