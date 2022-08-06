const express = require('express'),
    ipfilter = require('express-ipfilter').IpFilter,
    IpDeniedError = require('express-ipfilter').IpDeniedError;

const app = express();
app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.disable('etag');
app.listen(env.API_PORT);

app.use((req, res, next) => {
    console.log(req.headers['x-forwarded-for'], req.connection.remoteAddress, req.ip);
    next();
});

app.use(ipfilter(['::ffff:127.0.0.1', '::1', '::ffff:192.168.100.6'], { mode: 'allow', log: true, logLevel: 'all' }));
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

app.use((req, res) => {
    res.status(404);
    const data = {
        "error": {
            "code": 404,
            "message": "404 Not Found"
        }
    };
    res.json(data);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    const data = {
        "error": {
            "code": 500,
            "message": "500 Internal Server Error"
        }
    };
    res.json(data);
});