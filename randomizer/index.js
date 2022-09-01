const fs = require("fs");
const path = require("path");
const {v4} = require("uuid");

const DEATH_PROPABILITY = 0.15;

const {
    snils, oid, randomDate, ogrn, kpp,
    oms, passport, birthSert, innPerson, innOrg
} = require("./ids");
const AGES_FILE = "ages";
const AGES = {
    f: fs.readFileSync(path.join(__dirname, "names", "f", AGES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a)),
    m: fs.readFileSync(path.join(__dirname, "names", "m", AGES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a))
}
const NAMES_FILE = "names";
const NAMES = {
    f: fs.readFileSync(path.join(__dirname, "names", "f", NAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a)),
    m: fs.readFileSync(path.join(__dirname, "names", "m", NAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a))
}
const SECNAMES_FILE = "midnames";
const SECNAMES = {
    f: fs.readFileSync(path.join(__dirname, "names", "f", SECNAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a)),
    m: fs.readFileSync(path.join(__dirname, "names", "m", SECNAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a))
}

const SURNAMES_FILE = "surnames";
const SURNAMES = {
    f: fs.readFileSync(path.join(__dirname, "names", "f", SURNAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a)),
    m: fs.readFileSync(path.join(__dirname, "names", "m", SURNAMES_FILE) + ".txt").toString().split("\n").map(a => JSON.parse(a))
}

const CITIES_FILE = "cities.jsonl";
const CITIES = fs.readFileSync(path.join(__dirname, "names", CITIES_FILE)).toString().split("\n").filter(a => !!a).map(a => {
    try {
        return JSON.parse(a);
    } catch (e) {
        return {}
    }
});

const STREETS = [
    "ул.Ленина", "пт-т Ленина", "пер.Ленина", "туп.Ленина",
    "ул.Мира", "пт-т Мира", "пер.Мира", "туп.Мира",
    "ул.Советская", "пт-т Советский", "пер.Советский", "туп.Советский",
]

const GENDERS = ['f', 'm'];

function rand(cnt, finish) {
    if (typeof cnt === "string") {
        finish = finish || 30;
        let result = '';
        const characters = cnt || 'АБВГДЕЖЗИКЛМНОПРСТУФХЧШЩЭЮЯЪЬ';
        const charactersLength = characters.length;
        for (let i = 0; i < finish; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    if (finish && cnt < finish) {
        return Math.trunc(Math.random() * (finish - cnt) + 1);
    }
    if (Array.isArray(cnt)) {
        if (!cnt[0].num || !cnt[0].text) return cnt[Math.round(Math.random() * cnt.length)];
        let maxSumm = 0;
        for (let i = 0; i < cnt.length; i++) maxSumm += cnt[i].num;
        const val = Math.random() * (maxSumm - 1);
        let s = cnt[0].num;
        let i = 0;
        while (val > s && i < cnt.length) {
            i++;
            s += cnt[i].num
        }
        // console.log(i, val, cnt[i])
        return cnt[i].text
    }
    return Math.floor(Math.random() * cnt)
}

function genOnePerson(known, isAdult, isAlive) {
    const person = {...(known || {})};
    person.gender = person.gender || {gender: GENDERS[rand(2)]};
    person.genderName = person.gender === 'f' ? "Женский" : "Мужской";
    person.genderCode = person.gender === 'f' ? 2 : 1;
    person.firstName = person.firstName || rand(NAMES[person.gender]);
    person.lastName = person.lastName || rand(SURNAMES[person.gender]);
    person.secondName = person.secondName || rand(SECNAMES[person.gender]);
    person.snils = person.snils || snils();
    person.oms = person.oms || oms();
    person.inn = person.inn || innPerson();
    person.guid = person.guid || v4();
    person.address = person.address || address()
    person.legalAddress = person.legalAddress || address()
    let yearOfBirth = 0;
    if (!person.birthDate) {
        if (isAdult === true) {
            while (yearOfBirth > 18)
                yearOfBirth = rand(AGES[person.gender]);
        } else if (isAdult === false) {
            yearOfBirth = rand(18);
        } else {
            yearOfBirth = rand(AGES[person.gender]);
        }
        person.birthDate = randomDate(yearOfBirth);
    } else {
        yearOfBirth = Date(person.birthDate).getFullYear();
    }
    const age = ((new Date()).getFullYear() - yearOfBirth);
    if (!person.dul) {
        if (age > 14) person.dul = passport()
        else person.dul = birthSert();
    }
    if (isAlive === false) {
        person.deathDate = person.deathDate || randomDate((new Date()).getFullYear() - (yearOfBirth + Math.floor(age * Math.random())));
    } else if (!isAlive) {
        if (Math.random() < DEATH_PROPABILITY)
            person.deathDate = person.deathDate || randomDate((new Date()).getFullYear() - (yearOfBirth + Math.floor(age * Math.random())));
    }
    return person;
}

function anyOrg(known, regionCode, oidPrefix) {
    const org = {...(known || {})};
    org.id = org.id || {};
    org.id.oid = org.id.oid || oid(oidPrefix);
    org.id.code = org.id.code || rand(100000);
    org.guid = org.guid || v4();
    org.inn = org.inn || innOrg();
    org.ogrn = org.ogrn || ogrn();
    org.kpp = org.kpp || kpp();
    org.shorName = org.shorName || rand("", 30);
    org.fullName = org.fullName || rand("", 100);
    org.regAddress = org.regAddress || address(regionCode);
    org.postAddress = org.postAddress || address(regionCode);
    return org;
}

function address(regionCode) {
    let a;
    if (!regionCode) {
        a = CITIES[rand(CITIES.length)];
    } else {
        const matched = CITIES.filter(c => (c.codeTaxOffice && String(c.codeTaxOffice).startsWith(regionCode)));
        if (matched.length <= 1)
            a = matched[0] || {};
        else
            a = matched[rand(matched.length)];
    }
    const addr = {...a};
    addr.regionCode = addr.codeTaxOffice ? addr.codeTaxOffice.substring(0, 2) : "00";
    addr.street = rand(STREETS);
    addr.building = rand(100) + 1;
    addr.flat = rand(100) + 1;
    addr.office = rand(100) + 1;
    return addr
}

const Generators = {
    "random": rand,
    "Date": randomDate,
    "Person": genOnePerson,
    "Organization": anyOrg,
    "Address": address,
    "Passport": passport,
    "OGRN": ogrn,
    "KPP": kpp,
    "SNILS": snils,
    "OID": oid,
    "OMS": oms,
    "BirthSert": birthSert,
    "INN_Person": innPerson,
    "INN_Org": innOrg
}


function Factory(config, KnownGenerators) {
    KnownGenerators = KnownGenerators || Generators;
    if (typeof config !== "object") return;
    if (!config.type) {
        const result = {};
        for (let k in config) {
            const a = Factory(config[k], KnownGenerators);
            if (a)
                result[k] = a;
        }
        return result;
    }
    if (config.type in Generators) {
        const a = Generators[config.type].apply(KnownGenerators, config.params || [])
        if (!config.length) return a;
        const result = [a];
        for (let i = 1; i < config.length; i++) {
            result.push(Generators[config.type].apply(KnownGenerators, config.params || []))
        }
        return result;
    }
    throw new Error("Unknown generator type: " + config.type)
}

module.exports = {
    Factory,
    Generators,
    anyOrg,
    anyPerson: genOnePerson,
    genOnePerson,
    rand,
    snils,
    oid,
    randomDate,
    ogrn,
    kpp,
    oms,
    passport,
    birthSert,
    innPerson,
    innOrg,
    address
};

// const ws = fs.createWriteStream(path.join(__dirname, "people.jsons"), {encoding:"utf8"});
// for(let i=0; i<1000000; i++) {
//     ws.write(JSON.stringify(genOnePerson()).replace(/\n/gm, " ") + "\n");
//     if (i % 10000 === 0) console.log(`${i} written`);
// }
// ws.close()
