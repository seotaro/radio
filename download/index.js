'use strict';

require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const { execSync } = require('child_process');

const { PubSub } = require('@google-cloud/pubsub');

const DIRECTORY = process.env.DIRECTORY || '.';
fs.mkdirSync(DIRECTORY, { recursive: true });

const client = new PubSub();

function listenForMessages() {
    const subscription = client.subscription(process.env.SUBSCRIPTION);

    // メッセージハンドラー
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        const item = JSON.parse(message.data);

        try {
            const command = makeFfmpegCommandLine(DIRECTORY, item.main.program_name, item.main.detail.file);
            fs.mkdirSync(`${DIRECTORY}/${item.main.program_name}`, { recursive: true });
            execSync(command)

            message.ack();

            console.log(`download program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id}`);

        } catch (err) {
            console.error(`program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id} is ${err}`);
        }
    };

    // エラーハンドラー
    const errorHandler = function (error) {
        console.error(`ERROR: ${error}`);
        throw error;
    };

    subscription.on('message', messageHandler);
    subscription.on('error', errorHandler);
}

listenForMessages();




const makeFfmpegCommandLine = (directory, programName, file) => {
    const datetimes = file.aa_vinfo4.split('_');
    const start = new Date(datetimes[0]);
    const end = new Date(datetimes[1]);
    const duration = (end - start) / 1000 - 1; // [秒]
    const command = [
        `ffmpeg`,
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


