// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../ITeleporterReceiver.sol";

/**
 * @title NexusVault
 * @dev C-Chain contract for NEXUS MVP.
 * Receives cross-chain messages via Teleporter to execute recurring payments.
 */
contract NexusVault is Ownable, ITeleporterReceiver {
    using SafeERC20 for IERC20;

    address public immutable teleporterMessenger;
    IERC20 public immutable paymentToken;

    bytes32 public allowedSubnetId;
    address public allowedBillingContract;

    event PaymentTeleported(address indexed user, address indexed receiver, uint256 amount);
    event BillingContractUpdated(bytes32 indexed subnetId, address indexed billingContract);

    /**
     * @notice Initializes the NexusVault contract.
     * @param _teleporterMessenger Address of the TeleporterMessenger on the C-Chain.
     * @param _paymentToken Address of the ERC20 token used for payments (e.g., MockUSDC).
     */
    constructor(address _teleporterMessenger, address _paymentToken) Ownable(msg.sender) {
        require(_teleporterMessenger != address(0), "Invalid messenger address");
        require(_paymentToken != address(0), "Invalid token address");
        
        teleporterMessenger = _teleporterMessenger;
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @notice Sets the allowed subnet ID and the billing contract address handling the logic.
     * @param _subnetId The Teleporter blockchain ID of the App-Chain/Subnet.
     * @param _billingContract The address of the NexusBilling contract on the subnet.
     */
    function setAllowedBillingContract(bytes32 _subnetId, address _billingContract) external onlyOwner {
        require(_subnetId != bytes32(0), "Invalid subnet ID");
        require(_billingContract != address(0), "Invalid contract address");

        allowedSubnetId = _subnetId;
        allowedBillingContract = _billingContract;

        emit BillingContractUpdated(_subnetId, _billingContract);
    }

    /**
     * @notice Receives the cross-chain message from Teleporter.
     * @dev Implements `ITeleporterReceiver.receiveTeleporterMessage`.
     * @param sourceBlockchainID The ID of the chain that sent the message.
     * @param originSenderAddress The address of the sender contract on the source chain.
     * @param message The ABI encoded payload containing the transfer details.
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external override {
        // 1. Ensure only the actual TeleporterMessenger can call this function
        require(msg.sender == teleporterMessenger, "Unauthorized: Not Teleporter");

        // 2. Verify that the sender is our trusted NexusBilling contract on the correct Subnet
        require(sourceBlockchainID == allowedSubnetId, "Unauthorized: Invalid Subnet");
        require(originSenderAddress == allowedBillingContract, "Unauthorized: Invalid Billing Contract");

        // 3. Decode the payload
        (address user, address receiver, uint256 amount) = abi.decode(message, (address, address, uint256));

        require(user != address(0), "Invalid user address");
        require(receiver != address(0), "Invalid receiver address");
        require(amount > 0, "Amount must be > 0");

        // 4. Execute the token transfer (Pull)
        // Note: The user MUST have already provided an allowance to the NexusVault contract prior to this step.
        paymentToken.safeTransferFrom(user, receiver, amount);

        // 5. Emit success event
        emit PaymentTeleported(user, receiver, amount);
    }
}
