import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import accountRouter from './routes/account.js';

(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://rodrigowaldow:Rodrigo@01@bootcamp.0h8sh.mongodb.net/MyBank?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/account', accountRouter);

app.listen(3001, () => {
  console.log('API initialized');
});
