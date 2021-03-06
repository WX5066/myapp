var express = require('express');
var router = express.Router();

const Admin = require('../testcontroller/Test1Controller');
/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

//测试路径1
router.get("/test1",Admin.test1);

router.get("/test2",Admin.test2);

//用户列表页面
router.get("/userlist", function(req, res, next) {
  res.render('myhtml/user.html', { title: 'Express' });
});

router.get("/loaduser",Admin.loaduser);

router.post('/uploadCarVoice', Admin.uploadCarVoice);

router.get('/queryVersion',Admin.getLatestEditionOfAppCarVoice);
module.exports = router;
