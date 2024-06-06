/**
 * @license
 * MIT License
 *
 * Copyright (c) 2017 spica.tokyo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @version 1.0.0
 */

const RE2 = require('re2');
const BigNumber = require('bignumber.js');
BigNumber.config({
    DECIMAL_PLACES: 30,
    POW_PRECISION: 30,
    EXPONENTIAL_AT: 30
});

// https://github.com/spica-git/ReversePolishNotation より

/**
 * @description 演算子・その他演算機能の定義
 *    Order: 演算の優先順位（MDNの定義に準拠）
 *        https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 *    Arity: 演算項の数
 *    AssocLow: 結合法則（"":なし, "L":左結合(left to right), "R":右結合(right to left)）
 *    fn: 演算処理
 */
const OperateTable = {
    '(': {
        Order: 20, Type: "state", Arity: 0, AssocLow: "",
        fn: function () {
        }
    },
    ')': {
        Order: 20, Type: "state", Arity: 0, AssocLow: "",
        fn: function () {
        }
    },
    //+符合の代替
    '#': {
        Order: 16, Type: "op", Arity: 1, AssocLow: "R",
        fn: function (_L) {
            return BigNumber(_L);
        }
    },
    //-符合の代替
    '_': {
        Order: 16, Type: "op", Arity: 1, AssocLow: "R",
        fn: function (_L) {
            return BigNumber(-_L);
        }
    },
    // '~': {
    //     Order: 16, Type: "op", Arity: 1, AssocLow: "R",
    //     fn: function (_L) {
    //         return ~_L;
    //     }
    // },
    '^': {
        Order: 15, Type: "op", Arity: 2, AssocLow: "R",
        fn: function (_L, _R) {
            return BigNumber(_L).exponentiatedBy(BigNumber(_R));
        }
    },
    '*': {
        Order: 14, Type: "op", Arity: 2, AssocLow: "L",
        fn: function (_L, _R) {
            return BigNumber(_L).multipliedBy(BigNumber(_R));
        }
    },
    '/': {
        Order: 14, Type: "op", Arity: 2, AssocLow: "L",
        fn: function (_L, _R) {
            return BigNumber(_L).dividedBy(BigNumber(_R));
        }
    },
    '%': {
        Order: 14, Type: "op", Arity: 2, AssocLow: "L",
        fn: function (_L, _R) {
            return BigNumber(_L).modulo(BigNumber(_R));
        }
    },
    '+': {
        Order: 13, Type: "op", Arity: 2, AssocLow: "L",
        fn: function (_L, _R) {
            return BigNumber(_L).plus(BigNumber(_R));
        }
    },
    '-': {
        Order: 13, Type: "op", Arity: 2, AssocLow: "L",
        fn: function (_L, _R) {
            return BigNumber(_L).minus(BigNumber(_R));
        }
    },
    // '<<': {
    //     Order: 12, Type: "op", Arity: 2, AssocLow: "L",
    //     fn: function (_L, _R) {
    //         return _L << _R;
    //     }
    // },
    // '>>': {
    //     Order: 12, Type: "op", Arity: 2, AssocLow: "L",
    //     fn: function (_L, _R) {
    //         return _L >> _R;
    //     }
    // },
    // '&': {
    //     Order: 9, Type: "op", Arity: 2, AssocLow: "L",
    //     fn: function (_L, _R) {
    //         return _L & _R;
    //     }
    // },
    // '^': {
    //     Order: 8, Type: "op", Arity: 2, AssocLow: "L",
    //     fn: function (_L, _R) {
    //         return _L ^ _R;
    //     }
    // },
    // '|': {
    //     Order: 7, Type: "op", Arity: 2, AssocLow: "L",
    //     fn: function (_L, _R) {
    //         return _L | _R;
    //     }
    // }
};

module.exports = {
    /**
     * @description 逆ポーランド記法の式を計算する
     * @param {string} rpn_exp 計算式
     */
    rpn(rpn_exp) {
        ///引数エラー判定
        if (!rpn_exp || typeof rpn_exp !== "string") {
            throw new Error("引数の型が正しくありません");
        }

        //演算子と演算項を切り分けて配列化する。再起するので関数化。
        function fnSplitOperator(_val, _stack) {
            if (_val === "") {
                return;
            }

            //演算子判定
            if (OperateTable[_val] != null) {
                _stack.push({value: _val, Type: OperateTable[_val].Type});
                return;
            }

            //演算子を含む文字列かどうか判定
            for (const op in OperateTable) {
                const piv = _val.indexOf(op);
                if (piv !== -1) {
                    fnSplitOperator(_val.substring(0, piv), _stack);
                    fnSplitOperator(_val.substring(piv, piv + op.length), _stack);
                    fnSplitOperator(_val.substring(piv + op.length), _stack);
                    return;
                }
            }

            //数値
            if (!isNaN(_val)) {
                _stack.push({value: _val, Type: "num"});
            }
            //文字列
            else {
                _stack.push({value: _val, Type: "str"});
            }
        }

        //切り分け実行
        //式を空白文字かカンマでセパレートして配列化＆これらデリミタを式から消す副作用
        const rpn_stack = [];
        for (let i = 0, rpn_array = rpn_exp.split(/\s+|,/); i < rpn_array.length; i++) {
            fnSplitOperator(rpn_array[i], rpn_stack);
        }


        ///演算開始
        const calc_stack = []; //演算結果スタック
        while (rpn_stack.length > 0) {
            const elem = rpn_stack.shift();
            switch (elem.Type) {
                //演算項（数値のparse）
                case "num":
                    calc_stack.push(
                        elem.value.indexOf("0x") !== -1 ? parseInt(elem.value, 16) : parseFloat(elem.value)
                    );
                    break;

                //演算項（文字列）※数値以外のリテラルを扱うような機能は未サポート
                case "str":
                    calc_stack.push(elem.value);
                    break;

                //制御文 ※計算時にはないはずなのでwarningを出して無視
                case "state":
                    console.warn("inclute statement: " + elem.value);
                    break;

                //演算子・計算機能
                case "op":
                case "fn":
                    const operate = OperateTable[elem.value];
                    if (operate == null) {
                        throw new Error("存在しないオペレートです: " + elem.value);
                    }

                    //演算に必要な数だけ演算項を抽出
                    const args = [];
                    for (let i = 0; i < operate.Arity; i++) {
                        if (calc_stack.length > 0) {
                            args.unshift(calc_stack.pop());
                        } else {
                            throw new Error("オペランドが足りません");
                        }
                    }

                    //演算を実行して結果をスタックへ戻す
                    const res = operate.fn.apply(null, args);
                    if (res != null) {
                        calc_stack.push(res);
                    }
                    break;
            }
        }

        ///途中失敗の判定
        if (rpn_stack.length > 0 || calc_stack.length !== 1) {
            console.warn({message: "計算式が正しくありません", rest_rpn: rpn_stack, result_value: calc_stack});
            return null;
        }

        ///計算結果を戻す
        return calc_stack[0];
    },


    /**
     * @description 計算式から逆ポーランド記法を生成
     * @param {string} exp 計算式
     */
    Generate(exp) {
        ///引数エラー判定
        if (typeof exp !== "string") {
            throw new Error("引数の型が正しくありません");
        }

        const Polish = []; ///parse結果格納用
        const ope_stack = [[]]; ///演算子スタック
        let depth = 0; ///括弧のネスト深度
        let unary = true; //単項演算子チェック（正負符号等）

        do {
            //先頭の空白文字とカンマを消去
            exp = exp.replace(new RE2(/^(\s|,)+/, ""));
            if (exp.length === 0) {
                break;
            }

            //演算子スタック
            ope_stack[depth] = ope_stack[depth] || [];

            ///数値抽出（整数・小数・16進数）
            const g = exp.match(new RE2(/(^0x[0-9a-f]+)|(^[0-9]+(\.[0-9]+)?)/i));
            if (g != null) {
                Polish.push(g[0].indexOf("0x") === 0 ? parseInt(g[0], 16) : parseFloat(g[0]));
                exp = exp.substring(g[0].length);
                unary = false;
                continue;
            }

            //演算子抽出
            let op = null;
            for (const key in OperateTable) {
                if (exp.indexOf(key) === 0) {
                    op = key;
                    exp = exp.substring(key.length);
                    break;
                }
            }

            if (op == null) {
                throw new Error("不正な式です: `" + exp.substring(0, 10) + "`");
            }

            ///スタック構築
            ///・各演算子の優先順位
            ///・符合の単項演算子化
            switch (op) {
                default:
                    ///+符号を#に、-符号を_に置換
                    if (unary) {
                        if (op === "+") {
                            op = "#";
                        } else if (op === "-") {
                            op = "_";
                        }
                    }

                    //演算子スタックの先頭に格納
                    //・演算子がまだスタックにない
                    //・演算子スタックの先頭にある演算子より優先度が高い
                    //・演算子スタックの先頭にある演算子と優先度が同じでかつ結合法則がright to left
                    if (ope_stack[depth].length === 0 ||
                        OperateTable[op].Order > OperateTable[ope_stack[depth][0]].Order ||
                        (OperateTable[op].Order === OperateTable[ope_stack[depth][0]].Order
                            && OperateTable[op].AssocLow === "R")
                    ) {
                        ope_stack[depth].unshift(op);
                    }
                    //式のスタックに演算子を積む
                    else {
                        //演算子スタックの先頭から、優先順位が同じか高いものを全て抽出して式に積む
                        //※優先順位が同じなのは結合法則がright to leftのものだけスタックに積んである
                        while (ope_stack[depth].length > 0) {
                            const ope = ope_stack[depth].shift();
                            Polish.push(ope);
                            //演算優先度が、スタック先頭の演算子以上ならば、続けて式に演算子を積む
                            if (OperateTable[ope].Order < OperateTable[op].Order) {
                                break;
                            }
                        }
                        ope_stack[depth].unshift(op);
                    }
                    unary = true;
                    break;

                //括弧はネストにするので特別
                case "(":
                    depth++;
                    unary = true;
                    break;

                case ")":
                    while (ope_stack[depth].length > 0) { ///演算子スタックを全て処理
                        Polish.push(ope_stack[depth].shift());
                    }
                    if (--depth < 0) {
                        //括弧閉じ多すぎてエラー
                        throw new Error("')'が多すぎます");
                    }
                    unary = false; ///括弧を閉じた直後は符号（単項演算子）ではない
                    break;
            }
        } while (exp.length > 0)

        if (depth > 0) {
            console.warn({message: "'('が多すぎます", rest_exp: exp});
        } else if (exp.length > 0) {
            console.warn({message: "計算式が正しくありません", rest_exp: exp});
        } else {
            while (ope_stack[depth].length > 0) {
                Polish.push(ope_stack[depth].shift());
            }
            return Polish.join(" ");
        }

        return null;
    }
}