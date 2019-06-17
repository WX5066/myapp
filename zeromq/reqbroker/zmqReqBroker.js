'use strict';

var zmq  = require('zeromq')
var frontend = zmq.socket('router');
var backend  = zmq.socket('dealer');
frontend.bindSync('tcp://*:5559');
backend.bindSync('tcp://*:5560');
class zmqReqBroker{
    constructor(){
      frontend.on('message', function() {
       // console.log("broker","：接受客户端请求");
        // Note that separate message parts come as function arguments.
        var args = Array.apply(null, arguments);
        // Pass array of strings/buffers to send multipart messages.
        backend.send(args);
      });
    
      backend.on('message', function() {
       // console.log("broker","：收到服务端回复");
        var args = Array.apply(null, arguments);
        frontend.send(args);
      });
    }
}
module.exports = new zmqReqBroker();