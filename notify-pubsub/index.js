"use strict";

require('dotenv').config();

const fetch = require('node-fetch');
const { Datastore } = require("@google-cloud/datastore");
const { PubSub } = require("@google-cloud/pubsub");

const DATASTORE_KIND = 'nhk-radio-on-demand';

const datastore = new Datastore();

const pubsub = new PubSub();

const now = () => {
    return (new Date()).toISOString();
};

const fastify = require('fastify')({
    logger: true
})

fastify.post('/', async (request, reply) => {
    const buffer = Buffer.from(request.body.message.data, 'base64');
    const json = JSON.parse(buffer);

    console.log(`${now()} received ${json.url} ${json.lastModified}`);
    await parse(json.url);

    reply
        .code(200)
        .send('ok')
})

const start = async () => {
    try {
        await fastify.listen(process.env.PORT || 8080, '0.0.0.0')

    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()

async function parse(url) {
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

    if (!json || !json.main || !json.main.detail_list) {
        console.error(`${url} is something wrong. json = ${json}`);
        return;
    }

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

    return await Promise.all(items.map(item => {
        return (async function (item) {
            const [results] = await queryDatabase(item.main.detail.file.file_id);
            if (0 < results.length) {
                // 既に処理済みのファイルはスルー。
                return;
            }

            try {
                await insertDatabase(item);
                await publishPubSub(item);

                console.log(`${now()} published file_id=${item.main.detail.file.file_id}`);

            } catch (err) {
                console.error(`${now()} ${item.main.detail.file.file_id} is ${err}`);
            }
        })(item);
    }))
        .then(() => {
            console.log(`${now()} finished ${url}`);
        })
        .catch((err) => {
            console.error(`${now()} ${err}`);
        });
}

async function queryDatabase(id) {
    const key = datastore.key([DATASTORE_KIND, id]);
    const query = datastore
        .createQuery(DATASTORE_KIND)
        .select('__key__')
        .filter('__key__', '=', key);

    return datastore.runQuery(query);
}

async function insertDatabase(model) {
    const key = datastore.key([DATASTORE_KIND, model.main.detail.file.file_id]);
    const entity = {
        key: key,
        data: { program_name: model.main.program_name, detail_json: model, createdAt: new Date() },
    };

    return datastore.save(entity);
}

async function publishPubSub(model) {
    const topicName = process.env.PUBSUB_TOPIC_NAME;
    const dataBuffer = Buffer.from(JSON.stringify(model));

    return pubsub.topic(topicName).publish(dataBuffer);
}
