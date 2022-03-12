'use strict';

require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const { execSync } = require('child_process');

const DIRECTORY = process.env.DIRECTORY || '.';
fs.mkdirSync(DIRECTORY, { recursive: true });

const { v1 } = require('@google-cloud/pubsub');

const client = new v1.SubscriberClient();

async function synchronousPull() {
    const subscription = client.subscriptionPath(
        process.env.GOOGLE_CLOUD_PROJECT,
        process.env.SUBSCRIPTION
    );

    const request = {
        subscription: subscription,
        maxMessages: 10,
    };

    const [response] = await client.pull(request);

    for (const message of response.receivedMessages) {
        console.log(`${(new Date()).toISOString()} ${message.message.messageId} Received message`);
        const item = JSON.parse(message.message.data);

        try {
            const command = makeFfmpegCommandLine(DIRECTORY, item.main.program_name, item.main.detail.file);
            fs.mkdirSync(`${DIRECTORY}/${item.main.program_name}`, { recursive: true });
            execSync(command)

            const ackRequest = {
                subscription: subscription,
                ackIds: [message.ackId],
            };
            await client.acknowledge(ackRequest);

            console.log(`${(new Date()).toISOString()} ${message.message.messageId} download program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id}`);

        } catch (err) {
            console.error(`${(new Date()).toISOString()} ${message.message.messageId} program_name=${item.main.program_name} file_id=${item.main.detail.file.file_id} is ${err}`);
        }
    }
}

(async () => {
    while (true) {
        await synchronousPull().catch(console.error);
    }
})();

const makeFfmpegCommandLine = (directory, programName, file) => {
    const datetimes = file.aa_vinfo4.split('_');
    const start = new Date(datetimes[0]);
    const end = new Date(datetimes[1]);
    const duration = (end - start) / 1000 - 1; // [秒]
    const command = [
        `ffmpeg`,
        `-loglevel error`,
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


