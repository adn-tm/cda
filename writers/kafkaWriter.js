const {v4} = require("uuid");
const {Kafka, Partitioners } = require("kafkajs");
const moment = require("moment/moment");

class KafkaWriter {
    constructor(config) {
        this.config = {
            clientId: 'CDA-generator',
            brokers: ['localhost:9092'],
            topic:"CDAinput",
            ...(config || {})
        };
        this.messageAddon = {
            sourceId: v4(),
            sourceType: "MOCKUP SOURCE TYPE",
            ...(config.message || {})
        }
        const kafka = new Kafka({
            clientId: this.config.clientId,
            brokers: this.config.brokers
        })
        this.producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
    }
    async init() {
        await this.producer.connect()
    }
    async write(xmlData) {
        const guid = v4();
        const fn = guid + '-' + moment().format("YYYY-MM-DD") + ".xml";
        const data = {
            ...(this.messageAddon),
            'filename': fn,
            'code_by_emdr': guid,
            'xml': xmlData
        }
        console.log(fn)
        await this.producer.send({
            topic: this.config.topic,
            messages: [
                {value: JSON.stringify(data)},
            ],
        })
        return fn;
    }
}

module.exports={KafkaWriter}
