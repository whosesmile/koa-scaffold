import 'dotenv/config';
import app from './app';

const server = app.listen(process.env.HTTP_PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`\nNode is running at http://localhost:${process.env.HTTP_PORT} in ${process.env.NODE_ENV} mode.\nPress CTRL-C to stop.\n`);
});

export default server;
