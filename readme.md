# cda-generator 
Can be used for generation mockups of structured electronic medical documents (SEMD) based on [standart HL7 CDA](http://www.hl7.org/implement/standards/product_brief.cfm?product_id=496).

### Requirements
* NodeJS v10+ 
* npm 
also possible to run `cda-generator` using `docker`

### Installation
Clone this repository
``` bash
git clone https://github.com/adn-tm/cda.git
```

### Command line usage
Install modules
``` bash
cd cda
npm install
```
Set up your template (read Templates section)
`templates`  

Run cda-generator in command-line mode 
``` bash
node index.js -s ./templates/66 -d ./dist -c 5
```
### Docker usage
Set up your config in the `docker-compose.yaml`

Run container
``` bash
docker-compose up -d
```
We provide some examples.
Generate XML files to local filesystem.
``` bash
docker-compose -f docker-compose.fs.yaml up -d 
```
Generate XML files and produce messages to Kafka
``` bash
docker-compose -f docker-compose.kafka.yaml up -d 
```

### Command line parameters and environment variable 
Possible parameters:
````
         -h(elp) online help 
         -s(rc) template_dir
                 path to template directory. Files config.json & template.xml are required there
                 It can be passed by $CDA_GEN_SRC environment variable
                 Default value is '/home/node/src'

         -d(st) destination_dir
                 path to exists directory for saving results into the file system
                 It can be passed by $CDA_GEN_DST environment variable
                 Default value is '/home/node/dst'

         -k(afka) brokers
                 Comma separated broker list, ex. 'kafka1:9092, kafka2:9092'.
                 It can be passed by $KAFKA_BROKERS environment variable
                 By default Kafka broker not used

         -t(opic) topic
                 Broker topic for pushing the produced data
                 It can be passed by $KAFKA_TOPIC environment variable

         Additional data for produced values of messages CAN been passed through the environment variable prefixed by 'CDA_GEN_MSG_'
                 Example:
                         export CDA_GEN_MSG_sourceType=ABD
                         export CDA_GEN_MSG_clientId=CDA-generator
         -c(nt) N
                 mocks count (default == 1 for files and INFINITY for Kafka destination)
                 It can be passed by $CDA_GEN_CNT environment variable

         -w(ait) N
                 delay (measured in ms) between each CDA generation
                 It can be passed by $CDA_GEN_DELAY environment variable
                 0 by default
````
### Work with templates
TBD