const fetch = require("node-fetch");
require('dotenv').config();
const API_BASE_URI = process.env.API_BASE_URI;
module.exports = {
    name: '4TunesAPI',
    async fetch(endpoint, id, body) {
        const result = await fetch(`${API_BASE_URI}${endpoint}/${id}`)
            .then(res => res.json())
            .catch(error => console.error(error));

        if (!result) {
            console.log('result: ' + result);
            console.log(`${API_BASE_URI}${endpoint}/${id}`, body);
            return;
        }

        if (result.error) {
            if (result.error.code === 404) {
                if (body) {
                    const res = await fetch(`${API_BASE_URI}${endpoint}`, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {'Content-Type': 'application/json'}
                    }).then(res => res.status).catch(error => console.error(error));

                    if (res === 201) {
                        console.log(`${endpoint}/${id}の作成完了`);
                        return this.fetch(endpoint, id);
                    } else {
                        console.log(`${endpoint}/${id}の作成失敗`);
                        console.log('res: ' + res);
                        console.log(`${API_BASE_URI}${endpoint}`, body);
                        return;
                    }
                } else {
                    return;
                }
            } else {
                console.log(result);
                console.log(`${API_BASE_URI}${endpoint}/${id}`, body);
                return;
            }
        }

        return result;
    },
    async post(endpoint, body) {
        const res = await fetch(`${API_BASE_URI}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.status).catch(error => console.error(error));

        if (res !== 201) {
            console.log(`${endpoint}の追加失敗`);
            console.log('res: ' + res);
            console.log(`${API_BASE_URI}${endpoint}`, body);
        }
    }
};
