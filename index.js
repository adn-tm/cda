const {Factory, rand, randomDate} = require("./randomizer");
const _= require("lodash");
const argsProcessor = require('command-line-parser');
const path = require("path");
const fs=require("fs-extra");
const {KafkaWriter, FileWriter} = require("./writers");

const Handlebars = require("handlebars");
const dateFormat = require('handlebars-dateformat');
Handlebars.registerHelper("rand", rand);
Handlebars.registerHelper("randomDate", randomDate);
Handlebars.registerHelper('dateFormat', dateFormat);


const TEMPLATE_FILENAME = "template.xml";
const CONFIG_FILENAME = "config.json";
const SRC_DEFAULT = "/home/node/src";
const DST_DEFAULT ="/home/node/dst";
const MSG_FIELDS_PREFIX="CDA_GEN_MSG_";

const cmd=argsProcessor() || {};
if (cmd.h || cmd.help ) {
    console.log("CMA mock generator. Use with parameters:");

    console.log("\t -s(rc) template_dir ")
    console.log(`\t\t path to template directory. Files ${CONFIG_FILENAME} & ${TEMPLATE_FILENAME} are required there`);
    console.log("\t\t It can be passed by $CDA_GEN_SRC environment variable");
    console.log(`\t\t Default value is '${SRC_DEFAULT}'\n`);

    console.log("\t -d(st) destination_dir");
    console.log("\t\t path to exists directory for saving results into the file system");
    console.log("\t\t It can be passed by $CDA_GEN_DST environment variable");
    console.log(`\t\t Default value is '${DST_DEFAULT}'\n`);

    console.log("\t -k(afka) brokers");
    console.log("\t\t Comma separated broker list, ex. 'kafka1:9092, kafka2:9092'. ");
    console.log("\t\t It can be passed by $KAFKA_BROKERS environment variable");
    console.log(`\t\t By default Kafka broker not used\n`);

    console.log("\t -t(opic) topic");
    console.log("\t\t Broker topic for pushing the produced data");
    console.log("\t\t It can be passed by $KAFKA_TOPIC environment variable\n");
    console.log(`\t Additional data for produced values of messages CAN been passed through the environment variable prefixed by '${MSG_FIELDS_PREFIX}'`);
    console.log("\t\t Example:");
    console.log("\t\t\t CDA_GEN_MSG_sourceType=ABD");
    console.log("\t\t\t CDA_GEN_MSG_clientId=CDA-generator");

    console.log("\t -c(nt) N");
    console.log("\t\t mocks count (default == 1 for files and INFINITY for Kafka destination)");
    console.log("\t\t It can be passed by $CDA_GEN_CNT environment variable\n");

    console.log("\t -w(ait) N");
    console.log("\t\t delay (measured in ms) between each CDA generation");
    console.log("\t\t It can be passed by $CDA_GEN_DELAY environment variable\n");
    console.log("\t\t 0 by default\n");


    process.exit(0);
}



const srcParam = cmd.src || cmd.s || process.env["CDA_GEN_SRC"] || SRC_DEFAULT;
const src =path.resolve(__dirname, srcParam);
let config, template;
try {
    config = fs.readJsonSync(path.join(src, CONFIG_FILENAME));
    template = Handlebars.compile(fs.readFileSync(path.join(src, TEMPLATE_FILENAME)).toString())
} catch(e) {
    console.error("Source configuration error:\n", e);
    process.exit(1);
}

let writer;
if (cmd.k || cmd.kafka || process.env["KAFKA_BROKERS"]) {
    try {
        const kConfig = {
            brokers: (cmd.k || cmd.kafka || process.env["KAFKA_BROKERS"]).split(",").map(s=>s.trim()),
            topic: (cmd.t || cmd.topic || process.env["KAFKA_TOPIC"])
        };
        kConfig.message = {};
        for(let k in process.env) {
            if (k.startsWith(MSG_FIELDS_PREFIX))
                kConfig.message[k.substring(MSG_FIELDS_PREFIX.length)]=process.env[k]
        }
        writer = new KafkaWriter(kConfig);
    } catch(e) {
        console.error("Source configuration reading error:\n", e);
        process.exit(2);
    }
} else {
    const dstParam = cmd.dst || cmd.d || process.env["CDA_GEN_DST"] || DST_DEFAULT;
    writer = new FileWriter({ destination:  path.resolve(__dirname, dstParam) });
}

const cnt = Number(cmd.cnt || cmd.c || process.env["CDA_GEN_CNT"] || ((writer instanceof KafkaWriter) ? Number.POSITIVE_INFINITY : 1 ));
if (Number.isNaN(cnt)) {
    console.error("Iterations count MUST be INTEGER")
    process.exit(3)
}
const delay = Number(cmd.wait || cmd.w || process.env["CDA_GEN_DELAY"] || 0);
if (Number.isNaN(delay)) {
    console.error("Wait parameter MUST be INTEGER")
    process.exit(4)
}

async function wait(delay) {
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}

async function doIt(template, config, writer, cnt) {
    try {
        await writer.init();
    } catch(e) {
        console.error("Writer initialization error:\n", e);
        process.exit(5);
    }

    let i = 0;
    while(!_.isFinite(cnt) || i < cnt) {
        const context = Factory(config.xmlData || config);
        // console.log("Person", context.patient);
        const s = template(context);
        await writer.write(s);
        i++;
        console.log(i)
        if (delay) {
            await wait(delay);
        }
    }
}

doIt(template, config, writer, cnt).then(()=>{
    process.exit(0)
}).catch(e=>{
    console.error(e);
    process.exit(6)
})
