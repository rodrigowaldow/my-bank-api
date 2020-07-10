import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import winston from 'winston';
import swaggerUI from 'swagger-ui-express';

import accountRouter from './routes/account.js';
import swaggerDocument from './documentation.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERDB}:${process.env.PWDB}@bootcamp.0h8sh.mongodb.net/MyBank?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    logger.error(err);
  }
})();

app.use(express.json());
app.use('/account', accountRouter);
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

app.listen(process.env.PORT, () => {
  logger.info('API started!');
});
