const RE2 = require('re2');
const {rpn, Generate} = require('./rpn.js');

const toHalfWidth = strVal => {
    // 半角変換
    const halfVal = strVal.replace(/[！-～]/g,
        function( tmpStr ) {
            // 文字コードをシフト
            return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
        }
    );

    // 文字コードシフトで対応できない文字の変換
    return halfVal.replace(/”/g, "\"")
        .replace(/’/g, "'")
        .replace(/‘/g, "`")
        .replace(/￥/g, "\\")
        .replace(/　/g, " ")
        .replace(/Π/g, "π")
        .replace( /\s+/g,'' )
        .replace(/〜/g, "~");
};

module.exports = {
    calculate(formula) {
        formula = toHalfWidth(formula);
        formula = formula.toLowerCase();

        const operandRegex = new RE2(/^[0-9.]+$/),
            operatorRegex = new RE2(/^[+\-×*÷/^%()=]+$/),
            startCharRegex = new RE2(/^[(\-0-9]/),
            encCharRegex = new RE2(/[0-9)=]$/),
            allCharRegex = new RE2(/^[0-9.+\-×*÷/^%()=]+$/);

        if (operandRegex.test(formula) || operatorRegex.test(formula)) return; // 数字・記号のみは省く
        else if (!(startCharRegex.test(formula) && encCharRegex.test(formula))) return; // 開始・終了文字は正しいか
        else if (!allCharRegex.test(formula)) return; // 使用できない文字はないか

        formula = formula
            .replace(new RE2(/=/g), '')
            .replace(new RE2(/×/g),'*')
            .replace(new RE2(/÷/g),'/')
            .replace(new RE2(/\*\*/g),'^');

        let result = '予期せぬエラー';
        try {
            result = rpn(Generate(formula));
        } catch (e) {
            result = e.message;
        }
        if (result === null) result = '計算式が正しくありません\n演算子に不足が無いか確認してください'

        if (formula === result.toString()) return;

        return result.toString();
    }
};