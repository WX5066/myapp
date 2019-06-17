// Task sink in node.js
// Binds PULL socket to tcp://localhost:5558
// Collects results from workers via that socket.
'use strict';

const zmq = require('zeromq')
const receiver = zmq.socket('pull');
const moment = require('moment');
const request = require('request');
const ventilator = require('./ventilator');
var count = 1;

function requestApi(){
  request({url : 'http://localhost:4000/test3', timeout : 3000}
  ,function(error, response, body){
      console.log(error);
      console.log(response);
      console.log(body);
  })
}

class sink{
    constructor(){
      receiver.bindSync("tcp://*:5558");
      receiver.on('message', function(msg) {
        var _today = moment();
        var str = _today.format('YYYY-MM-DD HH:mm:ss'); /*现在的时间*/
        console.log(str,'sink接受work信息...', msg.toString());
       
        if(count == 1){
          requestApi();
          count++;
        }
      });
    }
}
module.exports = new sink();