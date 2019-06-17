const zmq = require('zeromq');
const server = zmq.socket('rep');
var moment = require('moment');
var num = 0;

class zmqReqBrokerServer{
    constructor(){
        server.connect('tcp://localhost:5560');
        server.on('message', function(msg) {
            //console.log('服务端0收到请求:', msg.toString());
            var _today = moment();
            var str = _today.format('YYYY-MM-DD HH:mm:ss'); /*现在的时间*/
            console.log(str , " : " ,(num++));
            server.send("World");
            // setTimeout(function() {
            //     server.send("World");
            // }, 1000);
          });
    }
}
module.exports = new zmqReqBrokerServer();

