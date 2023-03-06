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
                        console.log('res: ' + res);
                        console.log(`${API_BASE_URI}${endpoint}`, body);
                        throw(`${endpoint}/${id}の作成失敗`);
                    }
                } else {
                    return;
                }
            } else {
                console.log(result);
                console.log(`${API_BASE_URI}${endpoint}/${id}`, body);
                throw(`${endpoint}/${id}の取得失敗`);
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

        if (!(res === 201 || res === 409)) {
            console.log(`${endpoint}の追加失敗`);
            console.log('res: ' + res);
            console.log(`${API_BASE_URI}${endpoint}`, body);
            throw(`${endpoint}の追加失敗`);
        }

        return res;
    },
    async patch(endpoint, body) {
        const res = await fetch(`${API_BASE_URI}${endpoint}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.status).catch(error => console.error(error));

        if (!(res === 204 || res === 404)) {
            console.log(`${endpoint}の更新失敗`);
            console.log('res: ' + res);
            console.log(`${API_BASE_URI}${endpoint}`, body);
            throw(`${endpoint}の更新失敗`);
        }

        return res;
    },
    async delete(endpoint, body) {
        const res = await fetch(`${API_BASE_URI}${endpoint}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.status).catch(error => console.error(error));

        if (!(res === 204 || res === 404)) {
            console.log(`${endpoint}の削除失敗`);
            console.log('res: ' + res);
            console.log(`${API_BASE_URI}${endpoint}`, body);
            throw(`${endpoint}の削除失敗`);
        }

        return res;
    }
};
