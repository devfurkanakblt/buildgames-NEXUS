**STEP 3: The C-Chain Contract (NexusVault.sol)**

Write the `NexusVault.sol` contract.
Requirements:
- It MUST implement the `ITeleporterReceiver` interface to receive messages from `NexusBilling.sol`.
- It handles the `receiveTeleporterMessage` function: 
  1. Decode the payload (user address, receiver address, amount).
  2. Verify that the sender is our trusted `NexusBilling` contract on the Subnet (check source blockchain ID and source address).
  3. Execute `IERC20(mockUSDC).safeTransferFrom(user, receiver, amount)`. (Assume the user has already approved this contract).
- Emit a `PaymentTeleported` event upon success.