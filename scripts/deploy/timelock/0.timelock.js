const { formatEther } = require('ethers/lib/utils')
const { ethers, network } = require('hardhat')
const factory = require('../../../specs/util/factory')
const deployments = require('../../util/deployments')
const config = require('../../config/accounts.json')
const { time: { DAYS } } = require('../../config/block-time')

const getDependencies = async (chainId) => {
  if (chainId !== 31337) {
    return deployments.get(chainId)
  }

  return {}
}

const deploy = async () => {
  const [deployer] = await ethers.getSigners()
  const previousBalance = await deployer.getBalance()

  console.log('Deployer: %s Balance: %d ETH', deployer.address, formatEther(previousBalance))
  const { chainId } = network.config
  const { timelock } = await getDependencies(chainId)

  if (timelock) {
    throw Error('Timelock contract exists already')
  }

  const contract = await factory.deploy('Timelock', 1 * DAYS, [config.admin], [config.admin], config.admin)

  console.log('Timelock deployed:', contract.address)
}

deploy().catch(console.error)
