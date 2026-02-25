// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../ITeleporterMessenger.sol";

/**
 * @title NexusBilling
 * @dev Subnet contract for NEXUS MVP. 
 * Manages user subscriptions and triggers cross-chain pulls via Avalanche Teleporter.
 */
contract NexusBilling is Ownable {
    ITeleporterMessenger public immutable teleporterMessenger;
    bytes32 public immutable cChainBlockchainID;
    address public nexusVaultOnCChain;

    struct Subscription {
        address userAddress;
        uint256 serviceId;
        uint256 costPerMonth;
        uint256 nextPaymentDueDate;
        bool isActive;
    }

    // Mapping from user address => service ID => Subscription details
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    
    // Mapping from service ID => receiver address on the C-Chain
    mapping(uint256 => address) public serviceReceivers;

    // Events
    event SubscriptionRegistered(address indexed user, uint256 indexed serviceId, uint256 costPerMonth);
    event RenewalTriggered(address indexed user, uint256 indexed serviceId, bytes32 indexed messageID, uint256 amountToPull);
    event ServiceReceiverSet(uint256 indexed serviceId, address indexed receiver);
    event NexusVaultUpdated(address indexed oldVault, address indexed newVault);

    /**
     * @notice Initializes the NexusBilling contract
     * @param _teleporterMessenger The address of the Teleporter Messenger precompile on this subnet
     * @param _cChainBlockchainID The teleporter blockchain ID for the Avalanche C-Chain
     * @param _nexusVaultOnCChain The address of the NexusVault contract on the C-Chain
     */
    constructor(
        address _teleporterMessenger,
        bytes32 _cChainBlockchainID,
        address _nexusVaultOnCChain
    ) Ownable(msg.sender) {
        require(_teleporterMessenger != address(0), "Invalid messenger address");
        require(_cChainBlockchainID != bytes32(0), "Invalid C-Chain ID");
        require(_nexusVaultOnCChain != address(0), "Invalid vault address");

        teleporterMessenger = ITeleporterMessenger(_teleporterMessenger);
        cChainBlockchainID = _cChainBlockchainID;
        nexusVaultOnCChain = _nexusVaultOnCChain;
    }

    /**
     * @notice Sets the target C-Chain vault address (in case of upgrades)
     */
    function setNexusVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid vault address");
        address oldVault = nexusVaultOnCChain;
        nexusVaultOnCChain = _vault;
        emit NexusVaultUpdated(oldVault, _vault);
    }

    /**
     * @notice Sets the receiver address for a specific service.
     * @param serviceId The ID of the service.
     * @param receiver The address on the C-Chain to receive the pulled funds.
     */
    function setServiceReceiver(uint256 serviceId, address receiver) external onlyOwner {
        require(receiver != address(0), "Invalid receiver address");
        serviceReceivers[serviceId] = receiver;
        emit ServiceReceiverSet(serviceId, receiver);
    }

    /**
     * @notice Registers a new recurring subscription.
     * @dev For MVP purposes, this is a public function. In production, this would require 
     * EIP-712 signatures or frontend validation to ensure user consent.
     * @param user The address of the subscribing user.
     * @param serviceId The ID of the service to subscribe to.
     * @param costPerMonth The monthly cost in mUSDC (or the target stablecoin decimals).
     */
    function registerSubscription(
        address user,
        uint256 serviceId,
        uint256 costPerMonth
    ) external {
        require(user != address(0), "Invalid user address");
        require(costPerMonth > 0, "Cost must be > 0");

        subscriptions[user][serviceId] = Subscription({
            userAddress: user,
            serviceId: serviceId,
            costPerMonth: costPerMonth,
            nextPaymentDueDate: block.timestamp + 30 days, // First payment is assumed handled upfront, next due in 30 days
            isActive: true
        });

        emit SubscriptionRegistered(user, serviceId, costPerMonth);
    }

    /**
     * @notice Cancels an active subscription.
     * @param user The address of the subscribing user.
     * @param serviceId The ID of the service to cancel.
     */
    function cancelSubscription(address user, uint256 serviceId) external {
        // In this MVP, anyone can trigger a cancellation for demonstration, 
        // or restrict it to the user.
        require(msg.sender == user || msg.sender == owner(), "Not authorized");
        
        Subscription storage sub = subscriptions[user][serviceId];
        require(sub.isActive, "Subscription not active");

        sub.isActive = false;
    }

    /**
     * @notice Triggers the monthly renewal for a user's subscription.
     * @dev Uses Avalanche Teleporter to send a cross-chain message to the C-Chain `NexusVault` to pull funds.
     * @param user The address of the subscribed user.
     * @param serviceId The ID of the service.
     */
    function triggerRenewal(address user, uint256 serviceId) external {
        Subscription storage sub = subscriptions[user][serviceId];
        
        require(sub.isActive, "Subscription not active");
        require(block.timestamp >= sub.nextPaymentDueDate, "Payment not due yet");

        address receiver = serviceReceivers[serviceId];
        require(receiver != address(0), "Service receiver not set");

        uint256 amountToPull = sub.costPerMonth;

        // Encode the payload: user address, receiver address, and the amount to pull.
        bytes memory messageData = abi.encode(user, receiver, amountToPull);

        // Send cross-chain message via Avalanche Teleporter
        bytes32 messageId = teleporterMessenger.sendCrossChainMessage(
            TeleporterMessageInput({
                destinationBlockchainID: cChainBlockchainID,
                destinationAddress: nexusVaultOnCChain,
                feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}), // Teleporter on Devnet/Fuji often uses zero fees for testing
                requiredGasLimit: 300000, 
                allowedRelayerAddresses: new address[](0), // Empty array indicates any relayer can deliver
                message: messageData
            })
        );

        // Update the next payment due date (add ~30 days)
        sub.nextPaymentDueDate += 30 days;

        emit RenewalTriggered(user, serviceId, messageId, amountToPull);
    }
}
