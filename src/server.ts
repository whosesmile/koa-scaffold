import 'dotenv/config';
import app from './app';
import logger from './utils/logger';

app.listen(process.env.HTTP_PORT, () => {
  logger.info(`工作进程 ${process.pid} 已启动: Node is running at http://localhost:${process.env.HTTP_PORT} in ${process.env.NODE_ENV} mode.\nPress CTRL-C to stop.\n`);
});

// import 'dotenv/config';
// import logger from './utils/logger';
// import * as os from 'os';
// import * as cluster from 'cluster';

// // 工作进程数
// let WORKERS = Number(process.env.WORKER_COUNT);

// // 如果未指定
// if (Number.isNaN(WORKERS)) {
//   WORKERS = os.cpus().length;
// }

// if (cluster.isMaster) {
//   logger.info(`主进程 ${process.pid} 正在运行`);

//   // 衍生工作进程。
//   for (let i = 0; i < WORKERS; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     logger.error(`工作进程 ${worker.process.pid} 已退出 code:${code}, signal:${signal}`);
//   });
// }
// else {
//   const app = require('./app').default;
//   // 工作进程可以共享任何 TCP 连接。
//   app.listen(process.env.HTTP_PORT, () => {
//     logger.info(`工作进程 ${process.pid} 已启动: Node is running at http://localhost:${process.env.HTTP_PORT} in ${process.env.NODE_ENV} mode.\nPress CTRL-C to stop.\n`);
//   });
// }
