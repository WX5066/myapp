'use strict';

var zmq = require('zeromq')

class zmqBrokerCli{
   constructor(){
        this.client = zmq.socket('req');
        this.client.connect('tcp://localhost:5559');
        this.client.on('message', function(msg) {
            //console.log('客户端收到处理回复:', msg.toString());
        });
        
    }
    sendmsg(msg){
        this.client.send(msg);
    }
}
module.exports = new zmqBrokerCli();