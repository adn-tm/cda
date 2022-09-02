const {v4} = require("uuid");
const {Kafka, Partitioners } = require("kafkajs");
const moment = require("moment/moment");

class KafkaWriter {
    constructor(config) {

        this.config = {
            clientId: 'CDA-generator',
            brokers: ['localhost:9092'],
            topic:"CDAinput",
            sourceId: v4(),
            sourceType: "MOCKUP SOURCE TYPE",
            ...(config || {})
        };
        const kafka = new Kafka({
            clientId: this.config.clientId,
            brokers: this.config.brokers
        })
        this.producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    }
    async init() {
        await this.producer.connect()
    }
    async write(xmlData) {
        const guid = v4();
        const fn = guid + '-' + moment().format("YYYY-MM-DD") + ".xml";
        const data = {
            'filename': fn,
            'source_entity': this.config.sourceId,
            'type_name': this.config.sourceType,
            'code_by_emdr': guid,
            'xml': xmlData
        }
        await this.producer.send({
            topic: 'test-topic',
            messages: [
                {value: JSON.stringify(data)},
            ],
        })
        return fn;
    }
}

module.exports={KafkaWriter}