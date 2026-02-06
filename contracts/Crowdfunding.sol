// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SteamToken.sol";

contract Crowdfunding {
    STeamToken public steamToken;
    address public platformOwner;
    uint256 public platformFeePercent = 5; 

    uint256 public campaignCount;

    constructor(address _tokenAddress) {
        steamToken = STeamToken(_tokenAddress);
        platformOwner = msg.sender;
    }

    struct Campaign {
        string title;
        string skinName; 
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        address creator;
        bool finalized;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 campaignId,
        string title,
        string skinName,
        uint256 goal,
        uint256 deadline,
        address creator
    );

    event Funded(uint256 campaignId, address contributor, uint256 amount);

    event CampaignFinalized(uint256 campaignId);

    function createCampaign(
        string memory _title,
        string memory _skinName,
        uint256 _goal,
        uint256 _durationInSeconds
    ) public {
        require(_goal > 0, "Goal must be > 0");

        campaignCount++;

        campaigns[campaignCount] = Campaign({
            title: _title,
            skinName: _skinName,
            goal: _goal,
            deadline: block.timestamp + _durationInSeconds,
            amountRaised: 0,
            creator: msg.sender,
            finalized: false
        });

        emit CampaignCreated(
            campaignCount,
            _title,
            _skinName,
            _goal,
            block.timestamp + _durationInSeconds,
            msg.sender
        );
    }

    function fundCampaign(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH");

        campaign.amountRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        uint256 tokenAmount = msg.value * 1000;
        steamToken.mint(msg.sender, tokenAmount);

        emit Funded(_campaignId, msg.sender, msg.value);
    }

    function finalizeCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp >= campaign.deadline, "Not ended yet");
        require(!campaign.finalized, "Already finalized");

        campaign.finalized = true;

        uint256 fee = (campaign.amountRaised * platformFeePercent) / 100;
        uint256 creatorAmount = campaign.amountRaised - fee;

        payable(platformOwner).transfer(fee);
        payable(campaign.creator).transfer(creatorAmount);

        emit CampaignFinalized(_campaignId);
    }

    function getUserContribution(
        uint256 _campaignId,
        address _user
    ) public view returns (uint256) {
        return contributions[_campaignId][_user];
    }
}
