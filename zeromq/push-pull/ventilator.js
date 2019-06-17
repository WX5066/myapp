// Task ventilator in node.js
// Binds PUSH socket to tcp://localhost:5557
// Sends batch of tasks to workers via that socket.
'use strict';
const zmq = require('zeromq');
const tty = require('tty');
const sender = zmq.socket('push');
const moment = require('moment');
//tty.setRawMode(true);

// Socket to send messages on

class ventilator{
    constructor(){
      sender.bindSync("tcp://*:5557");
    }
    work(msg) {
      var _today = moment();
      var str = _today.format('YYYY-MM-DD HH:mm:ss'); /*现在的时间*/
     // console.log(str,"Sending tasks to workers…" , msg);
      sender.send(msg);
    };
}
module.exports = new ventilator();