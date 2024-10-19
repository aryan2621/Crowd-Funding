// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool isClosed;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        string title,
        uint256 target
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event CampaignClosed(uint256 indexed campaignId, bool success);

    modifier onlyCampaignOwner(uint256 _id) {
        require(
            msg.sender == campaigns[_id].owner,
            "Only campaign owner can perform this action"
        );
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        _;
    }

    modifier campaignActive(uint256 _id) {
        require(!campaigns[_id].isClosed, "Campaign is closed");
        require(
            block.timestamp <= campaigns[_id].deadline,
            "Campaign has ended"
        );
        _;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(
            _deadline > block.timestamp,
            "The deadline must be in the future."
        );
        require(_target > 0, "Target must be greater than 0");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.isClosed = false;

        emit CampaignCreated(numberOfCampaigns, msg.sender, _title, _target);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(
        uint256 _id
    ) public payable campaignExists(_id) campaignActive(_id) {
        require(msg.value > 0, "Donation amount must be greater than 0");
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.amountCollected < campaign.target,
            "Target already reached"
        );
        uint256 remainingAmount = campaign.target - campaign.amountCollected;
        uint256 donationAmount = msg.value;
        if (msg.value > remainingAmount) {
            donationAmount = remainingAmount;
            payable(msg.sender).transfer(msg.value - remainingAmount);
        }

        campaign.donators.push(msg.sender);
        campaign.donations.push(donationAmount);
        campaign.amountCollected += donationAmount;
        emit DonationReceived(_id, msg.sender, donationAmount);
    }

    function closeCampaign(
        uint256 _id
    ) public campaignExists(_id) campaignActive(_id) onlyCampaignOwner(_id) {
        Campaign storage campaign = campaigns[_id];
        campaign.isClosed = true;
        bool success = campaign.amountCollected >= campaign.target;
        if (success) {
            payable(campaign.owner).transfer(campaign.amountCollected);
        }
        emit CampaignClosed(_id, success);
    }

    function getDonators(
        uint256 _id
    )
        public
        view
        campaignExists(_id)
        returns (address[] memory, uint256[] memory)
    {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    function getCampaign(
        uint256 _id
    ) public view campaignExists(_id) returns (Campaign memory) {
        return campaigns[_id];
    }
}
