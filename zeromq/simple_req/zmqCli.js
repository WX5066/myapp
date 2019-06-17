'use strict';

const zmq = require('zeromq');

class zmqCli{
    
    constructor() {
        if(!this.client){
            console.log('初次加载');
            this.client = zmq.socket('req');// 请求应答类型
            this.client.connect("tcp://localhost:5555");
            this.client.on("message",function(Request){
               // console.log('返回信息监听' + Request);
            });
            process.on('SIGINT', function() {
                this.client.close();
            });
        }
       
    }
    /**
     * 获取连接
     */
    getZmqClient(){
        return this.client;
    }

    /**
     * 加载消息监听
     * @param {*} fn 自定义函数
     * 
     */
    initMsgEvent(fn){
        
    }

    /**
     * 发送消息
     * @param {*} msg 
     */
    sendmsg(msg){
        this.client.send(msg);
    }

}
module.exports = new zmqCli();