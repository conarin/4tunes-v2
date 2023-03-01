const RE2 = require('re2');
const hexRegex = new RE2(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
module.exports = {
    hex2rgb(hex = '000000') {
        if (!hex.match(hexRegex)) return [0, 0, 0];
        if (hex.slice(0, 1) === '#') hex = hex.slice(1);
        if (hex.length === 3) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3);

        return [hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 )].map(str => {
            return parseInt(str, 16) || 0;
        });
    },
    rgb2hex(rgb = [0, 0, 0]) {
        return rgb.map(value => {
            return ('0' + value.toString(16)).slice(-2);
        }).join('');
    }
};
