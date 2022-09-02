CMA mock generator. 
Use with parameters:
````
        -s(rc) template_dir
                path to template directory. Files config.json & template.xml are required there
                It can be passed by $CDA_GEN_SRC environment variable
                Default value is '/home/node/src'

         -d(st) destination_dir
                 path to exists directory for saving results into the file system
                 It can be passed by $CDA_GEN_DST environment variable
                 Default value is '/home/node/dst'

         -k(afka) destination_dir
                 path to Kafka broker cluster configuration. Use -h -kafka for details.
                 It can be passed by $CDA_GEN_KAFKA_CONFIG environment variable
                 By default Kafka broker not used

         -c(nt) N
                 mocks count (default == 1 for files and INFINITY for Kafka destination)
                 It can be passed by $CDA_GEN_CNT environment variable

         -w(ait) N
                 delay (measured in ms) between each CDA generation
                 It can be passed by $CDA_GEN_DELAY environment variable
                 0 by default
````
Kafka config.json example.
There are default values shown
```json
{
  "clientId": "CDA-generator",
  "brokers": [
    "localhost:9092"
  ],
  "topic": "CDAinput",
  "sourceId": "43291c09-2ed1-4ba4-975a-6fa2d63d6d3c",
  "sourceType": "MOCKUP SOURCE TYPE"
}
````
