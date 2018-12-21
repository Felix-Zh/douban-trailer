import util from 'util';
import path from 'path';
import mongoose from 'mongoose';
import glob from 'glob';
import { MONGO as CONFIG } from '../config/db';


// use Node.js Promise
mongoose.Promise = global.Promise;

// enable debug mode in development environment
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

export default {
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(this.getConnectionURI(), { useNewUrlParser: true });

      mongoose.connection.on('connected', () => {
        console.log('MongoDB 已连接...')
        resolve();
      });

      mongoose.connection.on('error', err => {
        reject(err);
      });

    });
  },

  async loadSchemas() {
    const fileNames = await util.promisify(glob)(path.resolve(__dirname, './schema', '**/*.js'));

    fileNames.forEach(require);
  },

  getConnectionURI() {
    const { HOST, PORT, DB_NAME } = CONFIG;

    return `mongodb://${HOST}:${PORT}/${DB_NAME}`;
  }

}
