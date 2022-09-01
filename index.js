const {Factory, rand, randomDate} = require("./randomizer");
const _= require("lodash");
const Handlebars = require("handlebars");
const dateFormat = require('handlebars-dateformat');
const argsProcessor = require('command-line-parser');
const path = require("path");
const fs=require("fs-extra");

const TEMPLATE_FILENAME = "template.xml";
const CONFIG_FILENAME = "config.json";

const cmd=argsProcessor() || {};
if (_.isEmpty(cmd)) {
    console.error("CMA mock generator. Use with parameters:\n");
    console.error("\t template directory ("+CONFIG_FILENAME+" & "+TEMPLATE_FILENAME+" are required)\n");
    console.error("\t destination  directory\n");
    console.error("\t mocks count (default ==1)\n");
    process.exit(-1);
}

Handlebars.registerHelper("rand", rand);
Handlebars.registerHelper("randomDate", randomDate);
Handlebars.registerHelper('dateFormat', dateFormat);

const src = process.argv[2]  ? path.resolve(__dirname, process.argv[2]) : "";
const dest = process.argv[3] ? path.resolve(__dirname, process.argv[3]) : process.cwd();
const cnt = process.argv[4] ? Number(process.argv[4]) : 1;
const config = fs.readJsonSync(path.join(src, CONFIG_FILENAME));
const template = Handlebars.compile(fs.readFileSync(path.join(src, TEMPLATE_FILENAME)).toString())

for (let i=0; i<cnt; i++) {
    const context = Factory(config);
    // console.log("Person", context.patient);
    const s= template(context);
    fs.writeFileSync(path.join(dest, (i+1)+".xml"), s);
}




