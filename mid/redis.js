'use strict';

// redis 连接
const redis = require('redis');

class RedisClient{
    constructor(){
      //  this.client = redis.createClient(process.env.REDIS_URL_carvoice_redis);
         this.client = redis.createClient(6379,"106.13.116.203");
        this.client.on('error',function(err){
            console.error('redis err:%s',err);
        });
    }

    getClient(){
        return this.client;
    }

    getAsync(key){
        let rclient = this.client;
        return new Promise(function(resolve,reject){
            rclient.get(key,function(err,val){
                if(err){
                    console.error(err.stack);
                    resolve(null);
                }
                else{
                    // console.log('---redis--get = '+val);
                    resolve(val);
                }
            });
        });
    }

    setAsync(key,val){
        let rclient = this.client;
        return new Promise(function(resolve,reject){
            rclient.set(key,val,function(err,result){
                if(err){
                    console.error('---redis--set error '+key+' =' + val);
                    resolve(false);
                }
                else{
                    // console.log('---redis--set '+key+' =' + val+result);
                    resolve(true);
                }
            });
        });
    }

    setTaihe(publicKey,cookie){
        this.client.set('taihe_public',publicKey,'EX',60*60*24*2,function(err,res){
            if(err){
                console.error(err.stack);
            }
            else{
                console.log('---redis--set taihe_public = '+res);
            }
        });
        this.client.set('taihe_cookie',cookie,'EX',60*60*24*2,function(err,res){
            if(err){
                console.error(err.stack);
            }
            else{
                console.log('---redis--set taihe_cookie = '+res);
            }
        });
    }

}

module.exports = new RedisClient();