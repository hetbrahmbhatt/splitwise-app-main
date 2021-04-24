var kafka = require( 'kafka-node' );

function ConnectionProvider () {
    this.getConsumer = function ( topic_name ) {

        this.client = new kafka.Client( "3.143.110.5:2181" );
        this.kafkaConsumerConnection = new kafka.Consumer( this.client, [ { topic: topic_name, partition: 0 } ] );
        this.client.on( 'ready', function () { console.log( 'client ready! ', topic_name ) } )
        return this.kafkaConsumerConnection;
    };
    this.getProducer = function () {
        if ( !this.kafkaProducerConnection ) {
            this.client = new kafka.Client( "3.143.110.5:2181" );
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer( this.client );
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;
