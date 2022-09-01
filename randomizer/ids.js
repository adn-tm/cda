// function generateSnils() {
//     const rnd = Math.floor(Math.random() * 999999999)
//     const number = leftPad('' + rnd, 9, '0')
//
//     let sum = number
//         .split('')
//         .map((val, i) => parseInt(val) * (9 - i))
//         .reduce((a, b) => a + b)
//
//     if (sum > 101) {
//         sum = sum % 101
//     }
//
//     const checkSum = sum === 100 || sum === 101 ? '00' : leftPad('' + sum, 2, '0')
//     return number + checkSum
// }

function leftPad(str, len, ch) {
    const length = len - str.length + 1
    return length > 0 ? new Array(length).join(ch) + str : str
}

function mask(num) {
    return `${num.substr(0, 3)} ${num.substr(3, 3)} ${num.substr(6, 3)} ${num.substr(9)}`
}

function passport() {
    return leftPad('' + (1 + Math.floor(Math.random() * 90)), 2, '0') +
        leftPad('' + Math.floor(Math.random() * 99), 2, '0') +
        leftPad('' + Math.floor(Math.random() * 999999), 6, '0');
}

function oms() {
    const num = leftPad('' + (1 + Math.floor(Math.random() * 90)), 2, '0') +
        leftPad('' + Math.floor(Math.random() * 9999999999999), 13, '0');
    let sum = 0;
    let p = "";
    for (let i = 0; i < num.length; i++) {
        if (i % 2 === 0) p = num[i] + p; else sum += Number(num[i])
    }
    const pn = String(Number(p) * 2);
    for (let i = 0; i < pn.length; i++) {
        sum += Number(pn[i])
    }
    return num + ((sum % 10) === 0 ? "0" : String(10 - (sum % 10)));
}

function birthSert() {
    const FP = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
        "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
    const SP = "АБВГДЕЖЗИКЛМНОПРСТУФХЧШЩЭЮЯ";
    return FP[Math.floor(1 + Math.random() * FP.length)] + '-'
        + SP[Math.floor(Math.random() * SP.length)]
        + SP[Math.floor(Math.random() * SP.length)] + " " +
        leftPad('' + Math.floor(1 + Math.random() * 999998), 6, '0');
}


/* add zeros to string */
function zeros(str, lng) {
    const factlength = str.length;
    if (factlength < lng) {
        for (let i = 0; i < (lng - factlength); i++) {
            str = '0' + str;
        }
    }
    return str;
}

/* GENERATE SOME PRORVA OF SOME */
function genProrva(str) {
    rezult = '';
    const f_name = str;
    quant = document.getElementById('quantity').value;
    if (!quant || quant.match(/^[\D]+$/) || quant < 1 || quant > 99) quant = 13;
    for (let i = 0; i < quant; i++) {
        rezult = rezult + window[f_name]() + '\n';
    }
    els = document.getElementsByClassName('prorva');
    for (let i = 0; i < els.length; i++) {
        els[i].style.color = 'black';
    }
    document.getElementById('gen_' + f_name + '_prorva').style.color = '#009900';
    return rezult;
}

/* INN FL */
function innPerson() {
    const region = zeros(String(Math.floor((Math.random() * 92) + 1)), 2);
    const inspection = zeros(String(Math.floor((Math.random() * 99) + 1)), 2);
    const numba = zeros(String(Math.floor((Math.random() * 999999) + 1)), 6);
    let rezult = region + inspection + numba;
    let kontr = String(((
        7 * rezult[0] + 2 * rezult[1] + 4 * rezult[2] +
        10 * rezult[3] + 3 * rezult[4] + 5 * rezult[5] +
        9 * rezult[6] + 4 * rezult[7] + 6 * rezult[8] +
        8 * rezult[9]
    ) % 11) % 10);
    kontr === 10 ? kontr = 0 : kontr = kontr;
    rezult = rezult + kontr;
    kontr = String(((
        3 * rezult[0] + 7 * rezult[1] + 2 * rezult[2] +
        4 * rezult[3] + 10 * rezult[4] + 3 * rezult[5] +
        5 * rezult[6] + 9 * rezult[7] + 4 * rezult[8] +
        6 * rezult[9] + 8 * rezult[10]
    ) % 11) % 10);
    kontr === 10 ? kontr = 0 : kontr = kontr;
    rezult = rezult + kontr;
    return rezult;
}

/* INN UL */
function innOrg() {
    const region = zeros(String(Math.floor((Math.random() * 92) + 1)), 2);
    const inspection = zeros(String(Math.floor((Math.random() * 99) + 1)), 2);
    const numba = zeros(String(Math.floor((Math.random() * 99999) + 1)), 5);
    let rezult = region + inspection + numba;
    let kontr = String(((
        2 * rezult[0] + 4 * rezult[1] + 10 * rezult[2] +
        3 * rezult[3] + 5 * rezult[4] + 9 * rezult[5] +
        4 * rezult[6] + 6 * rezult[7] + 8 * rezult[8]
    ) % 11) % 10);
    kontr === 10 ? kontr = 0 : kontr = kontr;
    rezult = rezult + kontr;
    return rezult;
}

/* OGRN */
function ogrn() {
    const priznak = String(Math.floor((Math.random() * 9) + 1));
    const godreg = zeros(String(Math.floor((Math.random() * 16) + 1)), 2);
    const region = zeros(String(Math.floor((Math.random() * 92) + 1)), 2);
    const inspection = zeros(String(Math.floor((Math.random() * 99) + 1)), 2);
    const zapis = zeros(String(Math.floor((Math.random() * 99999) + 1)), 5);
    let rezult = priznak + godreg + region + inspection + zapis;
    let kontr = String(((rezult) % 11) % 10);
    kontr === 10 ? kontr = 0 : kontr = kontr;
    rezult = rezult + kontr;
    return rezult;
}

/* KPP */
function kpp() {
    const region = zeros(String(Math.floor((Math.random() * 92) + 1)), 2);
    const inspection = zeros(String(Math.floor((Math.random() * 99) + 1)), 2);
    let prichina = Math.floor((Math.random() * 4) + 1);
    switch (prichina) {
        case 1:
            prichina = '01';
            break
        case 2:
            prichina = '43';
            break
        case 3:
            prichina = '44';
            break
        case 4:
            prichina = '45';
            break
        default:
            prichina = '01';
            break
    }
    const numba = zeros(String(Math.floor((Math.random() * 999) + 1)), 3);
    return (region + inspection + prichina + numba);
}

/* SNILS */
function snils() {
    const rand1 = zeros(String(Math.floor((Math.random() * 998) + 2)), 3);
    const rand2 = zeros(String(Math.floor((Math.random() * 999) + 1)), 3);
    const rand3 = zeros(String(Math.floor((Math.random() * 999) + 1)), 3);
    let rezult = rand1 + rand2 + rand3;
    let kontr = String(9 * rezult[0] + 8 * rezult[1] + 7 * rezult[2] +
        6 * rezult[3] + 5 * rezult[4] + 4 * rezult[5] +
        3 * rezult[6] + 2 * rezult[7] + 1 * rezult[8]);
    if (kontr < 100) {
        kontr = kontr;
    } else if (kontr > 101) {
        kontr = String(kontr % 101);
        kontr = zeros(kontr, 2);
        if (kontr > 99) {
            kontr = '00';
        }
    } else {
        kontr = '00';
    }
    rezult = rezult + kontr;
    return rezult;
}
function randomDate(yearOfBirthOrStartYear, endYear) {
    if (!endYear) {
        return new Date(((yearOfBirthOrStartYear || Math.floor(1920 + Math.random() * 100))) + '-' +
            leftPad('' + Math.floor(1 + Math.random() * 12), 2, '0') + '-' +
            leftPad('' + Math.floor(1 + Math.random() * 28), 2, '0'));
    } else {
        if (endYear === "NOW")
            endYear=(new Date()).getFullYear();

        const a = new Date((Math.floor( yearOfBirthOrStartYear+ Math.random() * Math.abs(endYear-yearOfBirthOrStartYear+1))) + '-' +
            leftPad('' + Math.floor(1 + Math.random() * 12), 2, '0') + '-' +
            leftPad('' + Math.floor(1 + Math.random() * 28), 2, '0'));
        // console.log("randomDate", yearOfBirthOrStartYear, endYear, a);
        return a;
    }
}
// "1.2.643.5.1.13.13.12.2.77.8258.100.1.1.70"
function oid(prefix, segments) {

    segments = segments || 15;
    const r = prefix ? prefix.split('.') : [];
    while (r.length < segments) r.push(String(Math.trunc(Math.random() * 300 + 1)));
    return r.join(".");
}

function address(known) {

}
module.exports = {snils, oid, randomDate, ogrn, kpp, address,
    oms, passport, birthSert, innPerson, innOrg };
