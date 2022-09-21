module.exports = (res, message) => {
    res.status(400);
    const data = {
        "error": {
            "code": 400,
            "message": message
        }
    };
    res.json(data);
}