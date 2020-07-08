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
      throw new Error('Account does not exist');
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
    const { agency, account } = req.params;

    const filter = {
      $and: [{ agencia: agency }, { conta: account }],
    };

    const userAccount = await accountModel.findOneAndDelete(filter);
    if (!userAccount) {
      throw new Error('Account does not exist');
    }

    const activeAccounts = await accountModel.find({ agencia: agency });

    res.send({
      success: 'Account was deleted',
      'Active accounts': activeAccounts.length,
    });

    //logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para realizar transferências entre contas. Este endpoint deverá
// receber como parâmetro o número da “conta” origem, o número da “conta” destino e
// o valor de transferência. Este endpoint deve validar se as contas são da mesma
// agência para realizar a transferência, caso seja de agências distintas o valor de tarifa
// de transferencia (8) deve ser debitado na “conta” origem. O endpoint deverá retornar
// o saldo da conta origem.
router.patch('/transfer/:origin/:destiny', async (req, res) => {
  try {
    const { origin, destiny } = req.params;
    const value = req.body.value;
    let tax = false;

    const originAccount = await accountModel.findOne({ conta: origin });
    const destinyAccount = await accountModel.findOne({ conta: destiny });

    if (!originAccount || !destinyAccount) {
      throw new Error(`Account does not exist.`);
    }

    if (originAccount.agencia !== destinyAccount.agencia) {
      tax = true;
      originAccount.balance -= 8;
    }

    originAccount.balance -= value;
    if (originAccount.balance < 0) {
      throw new Error('The account has no value enough.');
    }
    destinyAccount.balance += value;

    await originAccount.save();
    await destinyAccount.save();

    res.send({
      success: 'Transfer sucess',
      'Current balance': originAccount.balance,
      'Has tax': tax,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Crie um endpoint para consultar a média do saldo dos clientes de determinada
// agência. O endpoint deverá receber como parametro a “agência” e deverá retornar
// o balance médio da conta.

// Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint
// devera receber como parâmetro um valor numérico para determinar a quantidade de
// clientes a serem listados, e o endpoint deverá retornar em ordem crescente pelo
// saldo a lista dos clientes (agência, conta, saldo).

// Crie um endpoint para consultar os clientes mais ricos do banco. O endpoint deverá
// receber como parâmetro um valor numérico para determinar a quantidade de clientes
// a serem listados, e o endpoint deverá retornar em ordem decrescente pelo saldo,
// crescente pelo nome, a lista dos clientes (agência, conta, nome e saldo).

// Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
// agência para a agência private agencia=99. O endpoint deverá retornar a lista dos
// clientes da agencia private.

export default router;
