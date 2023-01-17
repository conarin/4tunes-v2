// 例外を吐かずにいい感じにデコードしてくれるやつ。
// http://iyukki.blog56.fc2.com/blog-entry-120.html より
const RE2 = require('re2');
module.exports = decode = (str) => {
    str = str.replace(new RE2(/%(?:25)+([0-9A-F][0-9A-F])/g), (whole,m1) => {
        return "%"+m1;
    });
    const utf8uri = new RE2(
        "%[0-7][0-9A-F]|"+
        "%C[2-9A-F]%[89AB][0-9A-F]|%D[0-9A-F]%[89AB][0-9A-F]|"+
        "%E[0-F](?:%[89AB][0-9A-F]){2}|"+
        "%F[0-7](?:%[89AB][0-9A-F]){3}|"+
        "%F[89AB](?:%[89AB][0-9A-F]){4}|"+
        "%F[CD](?:%[89AB][0-9A-F]){5}","ig");
    return str.replace(utf8uri, (whole) => {
        return decodeURIComponent(whole);
    });
};