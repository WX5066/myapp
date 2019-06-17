'use strict';

const AV = require('leanengine');
const FS = require('fs');
//const redisClient = require('redis');
//var logger = require('../mid/log').logger("Test1Controller", 'debug');
var Multiparty = require('multiparty');
const zmqCli = require('../zeromq/simple_req/zmqCli');
const zmqBrokerCli = require('../zeromq/reqbroker/zmqBrokerCli');
const ventilator = require('../zeromq/push-pull/ventilator');

class Test1Controller{
	constructer(){

	}
	async query1(req, res){
		setTimeout(function(){
			console.log('5');
			res.send("查询成功");
		},5000);
		
	}
	/**
	 * broker 代理
	 * @param {*} req 
	 * @param {*} res 
	 */
	async zmqBroker(req, res){
		for (let index = 0; index <1000; index++) {
			zmqBrokerCli.sendmsg("wx");//耗时26s
		}
		res.send("ok");
	}

	/**
	 * 简单 请求-回复 模型
	 */
	async zmq(req, res){
		for (let index = 0; index <1000; index++) {
			zmqCli.sendmsg({"Hello":"Hello"});//耗时17s
		}
		//zmqCli.getZmqClient().send("1");
		
		res.send("哈哈");
	}
	/**
	 *   push-pull模型使用多任务并发
	 */
	async zmqpush(req, res){
		for (let index = 0; index <1; index++) {
			ventilator.work("wx");//
		}
		res.send("哈哈");
		
	}


	async zmq1(req, res){
		//zmqCli.getZmqClient().send("1");
		zmqCli.sendmsg({"Hello":"world"});
		console.log("打印2.2");
		res.send("哈哈1.0");
	}

	async zmq2(req, res){
		//zmqCli.getZmqClient().send("1");
		zmqCli.sendmsg('w');
		console.log("打印3.0");
		res.send("哈哈3.0");
	}


	async query2(req, res){
		res.send("第二个版本");
	}


	async test1(req, res, next){
		const {name, password} = req.query;
		const query = new AV.Query('user');
		query.equalTo('username', name);
		const list = await query.find();
		console.log(list.length);
		const list1 = await query.first();
		console.log(list1);
		
		if(list.length > 0){
			console.log(list[0].attributes.username);
			//logger.error((new Date()) + list[0].attributes.username);
			
			return res.json({
				status : false,
				message : '用户名重复'
			});
		}

	 	var user = new AV.Object('user');
	 	user.set({
		 	"username" : name,
		 	'password' : password,
		 	'pid' : '123456789'
		 });
		const result = await user.save();
		console.log('测试结果' + result.attributes.username);
		res.json({
			status : result,
			message : success,
		});
	}

	async loaduser(req, res, next){
		const {username, pageSize = 10,
            pageNumber = 1} = req.query;
            console.log(req.query);
		const query = new AV.Query('user');
		query.limit(pageSize);
        query.skip((pageNumber - 1) * pageSize);
		const users = await query.find();
		const nums = await query.count();
		console.log(users.length);
		res.json({
			total: nums,
            rows:users
		});
	}

	async userlist(req, res, next){
		console.log('****************');
		res.render('user',{});//render
	}

	async test2(){
		 // 声明类型
	 	var list = [];
	 	var start = 2;
	 	var end = 5;
	 	var i = 0;
	 	for (;start < end; start++, i++) {
	 		list[i] = new Object();
	 		list[i].name = start;
	 		list[i].age = start;
	 	}
	 	console.log(list);

	 	const newlist = list.map((currentValue,index, arr)=>{
	 		console.log(currentValue + '下标' + index);
	 		var a = currentValue;
	 		a.name = 3;
	 		a.age = 4
	 		return a; 
	 	});
	 	console.log(newlist);
	 	console.log(list);
	}
	async uploadCarVoice(req, res, next){
		
		var form = new Multiparty.Form();
		form.parse(req,function(err, field, files){
			console.log(field);
			const version = field.version[0];
			if(!version){
				res.send('请上传版本号');
			}
			var iconFile = files.myfile[0];
			console.log(iconFile);
			FS.readFile(iconFile.path,function(err, data){
				if(err){
					console.log('文件读取失败');
				}
				console.log('-------------------------------');
				console.log(data);
				var filedata = new AV.File('carvoice.apk', data);
				filedata.set({
					'version' : version,
					'_type' : 'update_apk'
				});
				/*filedata.save().then(function(theFile){
					return res.send('上传成功');
				});*/
			 	filedata.save().then(function(theFile){
                        res.send('上传成功');
                    }).catch(console.error);
			});
		})
	}
    /**
		获取最后一次上传的apk包的版本号信息
    */
	async getLatestEditionOfAppCarVoice(req, res, next){
		try{
			var result = {'success' : true};
			const query = new AV.Query('_File');
			query.descending('createdAt');
			query.equalTo('name', 'carvoice.apk');
			const list = await query.first();
			if(!list){
				result.success = false;
				result.message = '未找到apk包';
				return res.json(result);
			}
			let url = list.toJSON().url;
			console.log(url);
			const version =  list.attributes.metaData.version;
			if(!version){
				result.success = false;
				result.message = "当前版本未上传版本号";
			}else{
				result.data = version;
			}
			return res.json(result);
		}catch(error){
			result.success = false;
			result.message = '请求错误';
			return res.json(result);
		}
	}
}
module.exports = new Test1Controller();