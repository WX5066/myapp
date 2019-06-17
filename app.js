var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const AV = require('leanengine');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const ejs = require('ejs');

const timeout = require('connect-timeout');

//const log4js = require('./mid/log');
const zmqServer = require('./zeromq/simple_req/zmqServer');
const zmqReqBroker = require('./zeromq/reqbroker/zmqReqBroker');
const zmqReqServer = require('./zeromq/reqbroker/zmqReqBrokerServer');
const zmqReqServer1 = require('./zeromq/reqbroker/zmqReqBrokerServer1');

const ventilator = require('./zeromq/push-pull/ventilator');
const worker = require('./zeromq/push-pull/worker');
const worker1 = require('./zeromq/push-pull/worker1');
const sink = require('./zeromq/push-pull/sink');
var app = express();

//设置Leancloud Express中间件
app.use(AV.express());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// 视图引擎初始化,默认静态路径为/views
app.engine('.html', ejs.__express);

app.set('view engine', 'html');

//加载日志中间件
//log4js.use(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//设置超时
app.use(timeout('3s'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// error handler
app.use(function(err, req, res, next) {
  console.log('7898');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  next(err);
  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
