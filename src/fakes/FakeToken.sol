// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
  constructor(
    string memory name,
    string memory symbol
  ) ERC20(name, symbol) { }

  function mint(address account, uint256 amount) external {
    super._mint(account, amount);
  }
}
