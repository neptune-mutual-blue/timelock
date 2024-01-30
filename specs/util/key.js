const ethers = require('ethers')

const encodeKey = (x) => ethers.utils.solidityKeccak256(['bytes32'], [toBytes32(x)])
const encodeKeys = (x, y) => ethers.utils.solidityKeccak256(x, y)
const toBytes32 = (x) => ethers.utils.formatBytes32String(x)

module.exports = {
  encodeKey,
  encodeKeys,
  toBytes32
}
