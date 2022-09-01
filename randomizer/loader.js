const fs = require("fs-extra");
const split = require('binary-split');
const path = require("path");
const pi = require("pipe-iterators");
const { UniqueID } = require('nodejs-snowflake');
const TarantoolConnection = require('tarantool-driver');
const TARANTOOL={connection:"guest@localhost:3301", space:"patient",
    columns:["id", "ln", "fn", "sn", "dul","snils", "oms"],
    searches: {
        id: {index: "primary", fields: ["id"]},
        snils: {index: "SnilsLastFirst", fields: ["snils", "ln", "fn", "sn"]},
        dul: {index:"DulLastFirst", fields: ["dul", "ln", "fn", "sn"]},
        oms: {index:"OmsLastFirst", fields: ["oms", "ln", "fn", "sn"]},
    }
};

const uid = new UniqueID({
    returnNumber: true,
    // customEpoch: number, // Defaults to 1546300800000 (01-01-2019). This is UNIX timestamp in ms
    // machineID: number // A value ranging between 0 - 4095. If not provided then a random value will be used
});
const tarantool = new TarantoolConnection({port:3301, host:"localhost", retryStrategy: (times) => Math.min(times * 50, 2000)}) // TARANTOOL.connection);
let i=0;
fs.createReadStream( path.join(__dirname, "people.jsons"))
    .pipe(split())
    .pipe(pi.thru(function (line, enc, next){
        const doc=JSON.parse(line);
        doc.fn=doc.firstName;
        doc.ln=doc.lastName;
        doc.sn=doc.secondName || "";
        const tuple = TARANTOOL.columns.map(fld=>doc[fld] || null);
        tuple[0] = uid.getUniqueID().toString(16);
        tarantool.insert(TARANTOOL.space, tuple).then(r=>{
            i++;
            if (i % 10000 === 0) console.log(`${i} written`);
            next();
        }).catch((e)=> { next(); });
    })).on("error", console.error).on("end", ()=>{
        console.log("data loaded");
    })