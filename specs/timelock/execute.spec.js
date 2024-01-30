const { time: { DAYS, MINUTES } } = require('../../scripts/config/block-time')
const factory = require('../util/factory')
const helper = require('../util/helper')
const keyUtil = require('../util/key')
const { time } = require('@nomicfoundation/hardhat-network-helpers')

require('chai')
  .use(require('chai-as-promised'))
  .should()

describe('Timelock: execute', () => {
  let data
  const contracts = {}

  before(async () => {
    const minDelay = 1 * DAYS

    const [owner, proposer, executor, bob] = await ethers.getSigners()
    contracts.npm = await factory.deploy('FakeToken', 'Fake Neptune Mutual Token', 'NPM')
    contracts.timelock = await factory.deploy('Timelock', minDelay, [proposer.address], [executor.address], owner.address)

    data = contracts.npm.interface.encodeFunctionData('transfer', [bob.address, helper.ether(10)])

    await contracts.timelock.connect(proposer).schedule(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo'),
      1 * DAYS
    )
  })

  it('must throw when tried to execute before delay', async () => {
    const [, , executor] = await ethers.getSigners()

    await contracts.timelock.connect(executor).execute(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo')
    ).should.be.rejectedWith('TimelockController: operation is not ready')
  })

  it('must throw if controller does not have balance', async () => {
    const [, , executor] = await ethers.getSigners()

    const current = await time.latest()
    await time.setNextBlockTimestamp(current + 1 * DAYS + 1 * MINUTES)

    await contracts.timelock.connect(executor).execute(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo')
    ).should.be.rejectedWith('TimelockController: underlying transaction reverted')
  })

  it('must execute the call', async () => {
    const [,, executor, bob] = await ethers.getSigners()

    await contracts.npm.mint(contracts.timelock.address, helper.ether(10))

    ;(await contracts.npm.balanceOf(bob.address)).should.equal(helper.ether(0))

    await contracts.timelock.connect(executor).execute(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo')
    )

    ;(await contracts.npm.balanceOf(bob.address)).should.equal(helper.ether(10))
  })
})
