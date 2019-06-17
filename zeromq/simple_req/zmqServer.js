// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"

var zmq = require('zeromq');
var moment = require('moment');
var num = 0;


class zmqServer{
    constructor(){
      // socket to talk to clients
      var responder = zmq.socket('rep');
      responder.on('message', function(request) {
        var _today = moment();
        var str = _today.format('YYYY-MM-DD HH:mm:ss'); /*现在的时间*/
        console.log(str , " : " ,(num++));
        responder.send("请求回复，World"); 
        // console.log(("收到客户端请求" + (request.Hello)));
        // var obj = JSON.parse(request);
        // console.log(obj);
        // console.log(obj.Hello);
        // console.log("收到客户端请求: [", request, "]");
       // throw new Error('抛出异常');
        // do some 'work'
        setTimeout(function() {
          // send reply  back to client.
          responder.send("请求回复，World"); 
        }, 1000);
      });

      responder.bind('tcp://*:5555', function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Listening on 5555…");
        }
      });
    }
}
module.exports = new zmqServer();
// process.on('SIGINT', function() {
//   responder.close();
// });