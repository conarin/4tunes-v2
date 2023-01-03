module.exports = {
    toLevel(exp = 0) {
        if (exp < 0) return 1;
        else if (exp <= 200) return Math.floor(exp / 50 + 1);
        else if (exp <= 700) return Math.floor(exp / 100 + 3);
        else if (exp <= 2200) return Math.floor(exp / 150 + 16 / 3);
        else if (exp <= 4200) return Math.floor(exp / 200 + 9);
        else return Math.floor(Math.sqrt((3888 - exp) / -2) / 5 + 55 / 2);
    },
    magnification(exp = 0) {
        if (exp < 0) return 1;
        else if (exp <= 200) return 1;
        else if (exp <= 700) return 1.2;
        else if (exp <= 2200) return 1.5;
        else if (exp <= 4200) return 1.8;
        else return 2;
    }
};
