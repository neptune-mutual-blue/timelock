const { utils } = require('ethers')
const { time: { DAYS } } = require('../../scripts/config/block-time')
const factory = require('../util/factory')

require('chai')
  .use(require('chai-as-promised'))
  .should()

describe('Timelock: Constructor', () => {
  const contracts = {}
  const TIMELOCK_ADMIN_ROLE = utils.keccak256(utils.toUtf8Bytes('TIMELOCK_ADMIN_ROLE'))
  const PROPOSER_ROLE = utils.keccak256(utils.toUtf8Bytes('PROPOSER_ROLE'))
  const EXECUTOR_ROLE = utils.keccak256(utils.toUtf8Bytes('EXECUTOR_ROLE'))
  const CANCELLER_ROLE = utils.keccak256(utils.toUtf8Bytes('CANCELLER_ROLE'))

  before(async () => {
    const minDelay = 1 * DAYS

    const [owner, proposer, executor] = await ethers.getSigners()
    contracts.npm = await factory.deploy('FakeToken', 'Fake Neptune Mutual Token', 'NPM')
    contracts.timelock = await factory.deploy('Timelock', minDelay, [proposer.address], [executor.address], owner.address)
  })

  it('must correctly set the state upon construction', async () => {
    const [owner, proposer, executor] = await ethers.getSigners()

    ; (await contracts.timelock.hasRole(TIMELOCK_ADMIN_ROLE, owner.address)).should.equal(true)
    ; (await contracts.timelock.hasRole(PROPOSER_ROLE, proposer.address)).should.equal(true)
    ; (await contracts.timelock.hasRole(EXECUTOR_ROLE, executor.address)).should.equal(true)
    ; (await contracts.timelock.hasRole(CANCELLER_ROLE, proposer.address)).should.equal(true)
    ; (await contracts.timelock.hasRole(CANCELLER_ROLE, executor.address)).should.equal(false)

    ; (await contracts.timelock.getMinDelay()).should.equal(1 * DAYS)
  })
})
