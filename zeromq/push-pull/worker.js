// Task worker in node.js
// Connects PULL socket to tcp://localhost:5557
// Collects workloads from ventilator via that socket
// Connects PUSH socket to tcp://localhost:5558
// Sends results to sink via that socket
'use strict';
const zmq = require('zeromq');
const receiver = zmq.socket('pull')
const sender = zmq.socket('push');
const moment = require('moment');

class worker{
    constructor(){
      receiver.connect('tcp://localhost:5557');
      sender.connect('tcp://localhost:5558');
      receiver.on('message', function(buf) {
        var _today = moment();
        var str = _today.format('YYYY-MM-DD HH:mm:ss'); /*现在的时间*/
       // console.log(str,"work 接受信息",buf.toString());
        // do the work
        // not a great node sample for zeromq,
        // node receives messages while timers run.
        sender.send(buf.toString());
      });
    }
}
module.exports = new worker();