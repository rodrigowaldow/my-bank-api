import express from 'express';
import accountModel from '../models/account.js';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const userAccounts = await accountModel.find({});
    res.send(userAccounts);

    //logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para registrar um depósito em uma conta. Este endpoint deverá
// receber como parâmetros a “agencia”, o número da “conta” e o valor do depósito.
// Ele deverá atualizar o “balance” da conta, incrementando-o com o valor recebido
// como parâmetro. O endpoint deverá validar se a conta informada existe, caso não
// exista deverá retornar um erro, caso exista retornar o saldo atual da conta.
router.patch('/deposit/:agency/:account', async (req, res) => {
  try {
    const { agency, account } = req.params;
    const value = req.body.value;

    const filter = {
      $and: [{ agencia: agency }, { conta: account }],
    };
    const update = {
      $inc: { balance: Number(value) },
    };

    const userAccount = await accountModel.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });

    if (!userAccount) {
      throw new Error('Account does not exist.');
    }

    res.send({ 'New balance': userAccount.balance });

    //logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para registrar um saque em uma conta. Este endpoint deverá
// receber como parâmetros a “agência”, o número da “conta” e o valor do saque. Ele
// deverá atualizar o “balance” da conta, decrementando-o com o valor recebido com
// parâmetro e cobrando uma tarifa de saque de (1). O endpoint deverá validar se a
// conta informada existe, caso não exista deverá retornar um erro, caso exista retornar
// o saldo atual da conta. Também deverá validar se a conta possui saldo suficiente
// para aquele saque, se não tiver deverá retornar um erro, não permitindo assim que
// o saque fique negativo.
router.patch('/withdraw/:agency/:account', async (req, res) => {
  try {
    const { agency, account } = req.params;
    const value = req.body.value + 1;

    const filter = {
      $and: [{ agencia: agency }, { conta: account }],
    };

    const userAccount = await accountModel.findOne(filter);
    if (!userAccount) {
      throw new Error('Account does not exist.');
    }

    const newBalance = userAccount.balance - value;
    if (newBalance < 0) {
      throw new Error('The account has no value enough.');
    }

    userAccount.balance = newBalance;
    await userAccount.save();

    res.send({ 'New balance': userAccount.balance });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para consultar o saldo da conta. Este endpoint deverá receber
// como parâmetro a “agência” e o número da “conta”, e deverá retornar seu “balance”.
// Caso a conta informada não exista, retornar um erro.
router.get('/balance/:agency/:account', async (req, res) => {
  try {
    const { agency, account } = req.params;

    const filter = {
      $and: [{ agencia: agency }, { conta: account }],
    };

    const projection = {
      _id: 0,
      balance: 1,
    };

    const balance = await accountModel.findOne(filter, projection);
    if (!balance) {
      throw new Error('Account does not exist.');
    }

    res.send({ Balance: balance });

    //logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para excluir uma conta. Este endpoint deverá receber como
// parâmetro a “agência” e o número da “conta” da conta e retornar o número de contas
// ativas para esta agência.
router.delete('/:agency/:account', async (req, res) => {
  try {
    const agency = req.params.agency;
    const account = req.params.account;

    const userAccount = await accountModel.findOneAndDelete({});

    const activeAccounts = await accountModel.find({});

    res.send(activeAccounts);

    //logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
