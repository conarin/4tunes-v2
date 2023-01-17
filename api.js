const express = require('express'),
    ipfilter = require('express-ipfilter').IpFilter,
    IpDeniedError = require('express-ipfilter').IpDeniedError,
    RE2 = require('re2');
require('dotenv').config();
const env = process.env;

global.pool = require('./utils/pool.js').create('4tunes');
global.regex = {
    uuid: new RE2(/^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i),
    id: new RE2(/^([0-9]{17,19})$/)
};
global.badRequest = require('./routes/badRequest.js');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.disable('etag');
app.listen(env.API_PORT);

// app.use((req, res, next) => {
//     console.log(req.headers['x-forwarded-for'], req.connection.remoteAddress, req.ip);
//     next();
// });

app.use(ipfilter(['::ffff:127.0.0.1', '::1', '::ffff:192.168.100.6'], { mode: 'allow', log: true, logLevel: 'deny' }));
app.use((err, req, res, _next) => {
    if (err instanceof IpDeniedError) {
        res.status(401)
    } else {
        res.status(err.status || 500)
    }
    const data = {
        "error": {
            "code": 401,
            "message": "This IP address has been added to the blacklist."
        }
    };
    res.json(data);
});

app.use('/minecraft/players', require('./routes/minecraft.js'));
app.use('/users/', require('./routes/users.js'));
app.use('/guilds', require('./routes/guilds.js'));

app.use((req, res) => {
    res.status(404);
    const data = {
        "error": {
            "code": 404,
            "message": "Not Found"
        }
    };
    res.json(data);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    const data = {
        "error": {
            "code": 500,
            "message": "Internal Server Error"
        }
    };
    res.json(data);
});