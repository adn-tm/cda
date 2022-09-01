const fs = require("fs-extra");
const split = require('binary-split');
const path = require("path");
const _ = require("lodash");
const pi = require("pipe-iterators");
const midnames ="midnames";
const names = "names";
const surnames = "surnames";
const NAMES={f:[], m:[]};
const SECNAMES={f:[], m:[]};
const SURNAMES={f:[], m:[]};

function freq(a, b) {
    if (a.num==b.num) return 0;
    return a.num>b.num ? -1 : 1;
}
fs.createReadStream( path.join(__dirname,names)+"_table.jsonl")
    .pipe(split())
    .pipe(pi.map((line)=>{
        const {text, num, gender} = JSON.parse(line.toString("utf8"));
        return {text, num, gender}
    }))
    .on("data", doc=>{
        if (doc.gender in NAMES)
            NAMES[doc.gender].push({text:doc.text, num:doc.num})
    })
    .on("end", ()=>{
        fs.writeFile(path.join(__dirname, "m", names)+".txt", NAMES.m.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
        fs.writeFile(path.join(__dirname, "f", names)+".txt", NAMES.f.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
    })



fs.createReadStream( path.join(__dirname, midnames)+"_table.jsonl")
    .pipe(split())
    .pipe(pi.map((line)=>{
        const {text, num, gender} = JSON.parse(line.toString("utf8"));
        return {text, num, gender}
    }))
    .on("data", doc=>{
        if (doc.gender in SECNAMES)
            SECNAMES[doc.gender].push({text:doc.text, num:doc.num})

    })
    .on("end", ()=>{
        fs.writeFile(path.join(__dirname, "m", midnames)+".txt", SECNAMES.m.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
        fs.writeFile(path.join(__dirname, "f", midnames)+".txt", SECNAMES.f.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
    })


fs.createReadStream( path.join(__dirname, surnames)+"_table.jsonl")
    .pipe(split())
    .pipe(pi.thru.obj(function(line, enc, next) {
        const {text, num, gender, f_form, m_form} = JSON.parse(line.toString("utf8"));
        if (!gender && gender!=="u")
            this.push({text, num, gender});
        if (gender==='m' || gender==='u')
            this.push({text:f_form || text, num, gender:'f'});
        if (gender==='m' || gender==='u')
            this.push({text:m_form || text, num, gender:'m'});
        next()
    }))
    .on("data", doc=>{
        if (doc.gender in SURNAMES)
            SURNAMES[doc.gender].push({text:doc.text, num:doc.num})
    })
    .on("end", ()=>{
        fs.writeFile(path.join(__dirname, "m", surnames)+".txt", SURNAMES.m.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
        fs.writeFile(path.join(__dirname, "f", surnames)+".txt", SURNAMES.f.sort(freq).map(a=>JSON.stringify(a)).join("\n"))
    })
