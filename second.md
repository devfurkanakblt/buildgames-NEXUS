**STEP 2: The Subnet Contract (NexusBilling.sol)**

Write the `NexusBilling.sol` contract. 
Requirements:
- It must hold a list of `Subscription` structs (userAddress, serviceId, costPerMonth, nextPaymentDueDate, isActive).
- Needs a function `registerSubscription(...)` for users to opt-in.
- Needs a core function `triggerRenewal(address user, uint256 serviceId)`: This function should formulate a cross-chain message and send it via the `ITeleporterMessenger` interface to the C-Chain `NexusVault` address. The message payload should include the user address, receiver address, and the amount to pull.
- Add necessary events.