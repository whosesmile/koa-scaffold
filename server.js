var cluster = require('cluster');
var config = require('./app/config');
var child_process = require('child_process');

// 热重启处理
var startMode = config.startMode;

// 正式环境需要安装依赖发布静态
if (!config.watch) {
  console.info('安装Web工程依赖包....');
  child_process.execSync('npm install', {
    stdio: 'inherit',
  });

  // TODO 静态工程的依赖和构建
}

// 如果是开发环境 正常启动
if (config.watch) {
  // 设置主进程
  cluster.setupMaster({
    exec: './app/index',
  });

  // 启动多进程
  // var nums = require('os').cpus().length;
  var nums = 1;
  for (var i = 0; i < nums; i++) {
    cluster.fork();
  }
}
// 如果不是 通过pm2启动
else {
  // 停止所有进程
  try {
    child_process.execSync('pm2 delete supplier', {
      stdio: 'inherit',
    });
  } catch (e) {}
  child_process.execSync('pm2 start app/index.js --name=supplier -o /dev/null -e /dev/null -i ' + config.cluster, {
    stdio: 'inherit',
  });
}
