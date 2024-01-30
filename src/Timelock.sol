// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors,
    address admin
  ) TimelockController(
    minDelay,
    proposers,
    executors,
    admin
  ) { }
}