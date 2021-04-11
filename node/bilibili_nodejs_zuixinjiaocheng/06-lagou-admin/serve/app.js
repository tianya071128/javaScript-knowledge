var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/users');

var app = express();

// view engine setup
// 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// 它使用 body-parser 解析带有JSON负载的传入请求 
// 在 v.4.16.0 版本中, 内置了 body-parser 中间件来解析 json 数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态文件夹
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/users', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
