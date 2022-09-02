const path = require("path");
const fs=require("fs-extra");
const {v4}=require("uuid");
const moment=require("moment/moment");

class FileWriter {
    constructor(config) {
        this.config = {
            destination: '~/CDA-results',
            ...(config || {})
        };
        this.folder = path.resolve(__dirname, this.config.destination);
    }
    async init() {
        return new Promise((resolve, reject)=>{
            fs.ensureDir(this.folder, (e)=>{
                if (e) return reject(e);
                return  resolve();
            })
        })
    }
    async write(xmlData) {
        const guid = v4();
        const fn = guid + '-' + moment().format("YYYY-MM-DD") + ".xml";
        const folder = this.folder;
        return new Promise((resolve, reject)=>{
            fs.writeFile(path.join(folder, fn), xmlData, (e)=>{
                if (e) return reject(e);
                return  resolve(fn);
            })
        })
    }
}

module.exports={FileWriter}

