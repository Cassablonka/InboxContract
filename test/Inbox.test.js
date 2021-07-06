const assert = require('assert');
const ganache = require('ganache-cli')
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

beforeEach(async () => {
  accounts =await web3.eth.getAccounts()

  contractResult = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Hi Cassa !']
    })
    .send({
      from: accounts[0],
      gas: 1000000
    });
});

describe('Inbox', () => {
  it('Deploys the Contract', () => {
    assert.ok(contractResult.options.address);
  });

  it('Displays the Message',async () =>{
    const message = await contractResult.methods.message().call();
    assert.equal(message, 'Hi Cassa !');
  });

  it('Updates the Message',async () => {
    await contractResult.methods.setMessage('Hello !').send({ from: accounts[0]});
    const message = await contractResult.methods.message().call();
    assert.equal(message, 'Hello !');
  });
});
