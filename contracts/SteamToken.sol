// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STeamToken is ERC20, Ownable {

    address public crowdfundingContract;

    constructor() ERC20("STeamToken", "STM") Ownable(msg.sender) {}

    function setCrowdfundingContract(address _crowdfunding) external onlyOwner {
        require(crowdfundingContract == address(0), "Already set");
        crowdfundingContract = _crowdfunding;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == crowdfundingContract, "Not authorized");
        _mint(to, amount);
    }
}
