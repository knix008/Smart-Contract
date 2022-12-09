const MyCoin = artifacts.require("MyCoin");

contract('MyCoin', (accounts) => {
  it('should put 10000 MyCoin in the first account', async () => {
    const myCoinInstance = await MyCoin.deployed();
    const balance = await myCoinInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
  it('should call a function that depends on a linked library', async () => {
    const myCoinInstance = await MyCoin.deployed();
    const myCoinBalance = (await myCoinInstance.getBalance.call(accounts[0])).toNumber();
    const myCoinEthBalance = (await myCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(myCoinEthBalance, 2 * myCoinBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  it('should send coin correctly', async () => {
    const myCoinInstance = await MyCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await myCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await myCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await myCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await myCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await myCoinInstance.getBalance.call(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});
