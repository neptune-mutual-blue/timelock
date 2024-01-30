const { utils } = require('ethers')
const { time: { DAYS } } = require('../../scripts/config/block-time')
const factory = require('../util/factory')
const helper = require('../util/helper')
const keyUtil = require('../util/key')

require('chai')
  .use(require('chai-as-promised'))
  .should()

describe('Timelock: schedule', () => {
  let data
  const contracts = {}
  const PROPOSER_ROLE = utils.keccak256(utils.toUtf8Bytes('PROPOSER_ROLE'))

  before(async () => {
    const minDelay = 1 * DAYS

    const [owner, proposer, executor, bob] = await ethers.getSigners()
    contracts.npm = await factory.deploy('FakeToken', 'Fake Neptune Mutual Token', 'NPM')
    contracts.timelock = await factory.deploy('Timelock', minDelay, [proposer.address], [executor.address], owner.address)

    data = contracts.npm.interface.encodeFunctionData('transfer', [bob.address, helper.ether(10)])
  })

  it('must throw when not scheduled by proposer', async () => {
    const [owner, , executor, bob] = await ethers.getSigners()

    await contracts.timelock.schedule(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo'),
      1 * DAYS
    ).should.be.rejectedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${PROPOSER_ROLE}`)

    await contracts.timelock.connect(executor).schedule(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo'),
      1 * DAYS
    ).should.be.rejectedWith(`AccessControl: account ${executor.address.toLowerCase()} is missing role ${PROPOSER_ROLE}`)

    await contracts.timelock.connect(bob).schedule(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo'),
      1 * DAYS
    ).should.be.rejectedWith(`AccessControl: account ${bob.address.toLowerCase()} is missing role ${PROPOSER_ROLE}`)
  })

  it('must allow to proposer to schedule a call', async () => {
    const [, proposer] = await ethers.getSigners()

    await contracts.timelock.connect(proposer).schedule(
      contracts.npm.address,
      '0',
      data,
      helper.emptyBytes32,
      keyUtil.toBytes32('foo'),
      1 * DAYS
    )
  })
})
