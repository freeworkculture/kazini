const Able = artifacts.require("Able");
const contractName = '0x41626c6500000000000000000000000000000000000000000000000000000000'

contract('Able', function ([msgOrigin,msgSender,newOwner,newController,storedContract]) {
  let isAble
  let addr
  let sig
  let newsig
  let cname

  beforeEach('setup contract for each test', async function () {
    isAble = await Able.new()
    addr = isAble.address
    sig = 0x0
    cname = '0x73746f726564636f6e74726163746e616d650000000000000000000000000000'

  })
  it('has an owner', async function () {
      assert.equal(await isAble.owner(), msgOrigin)
  })
  it('has a contrl', async function() {
      assert.equal(await isAble.getContrl({}), addr)
  })
  it('has a controller', async function() {
    assert.equal(await isAble.controller(), addr);
  })
  it('can change the owner', async function () {
      await isAble.changeOwner(newOwner, sig),
      assert.equal(await isAble.owner(), newOwner)
  })
  it('can change the contrl', async function () {
    await isAble.changeContrl(newController, sig);
    assert.equal(await isAble.getContrl({}), newController);
  })
  it('can change the controller', async function () {
    await isAble.changeContrl(newController, sig);
    await isAble.changeController(sig);
    assert.equal(await isAble.controller(), newController);
  })
  it('can register a new contract', async function () {
    await isAble.registerContract(storedContract, cname, sig);
    assert.equal(await isAble.getContract(storedContract), cname);
  })
  it('can only get a stored contract', async function () {
    assert.notEqual(await isAble.getContract(storedContract), cname);
  })
  it('can only remove a stored contract', async function () {
    await isAble.registerContract(storedContract, cname, sig);
    assert.equal(await isAble.getContract(storedContract), cname);
    await isAble.removeContract(storedContract, sig);
    assert.notEqual(await isAble.getContract(storedContract), cname);
  })




  


})