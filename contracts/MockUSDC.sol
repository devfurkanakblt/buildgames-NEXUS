// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Simple ERC20 Mock Token for testing on Avalanche Fuji testnet. 
 * Acts as a stablecoin for the NEXUS MVP.
 * Mints 10,000 tokens to deployer upon creation. Uses 6 decimals to mimic real USDC.
 */
contract MockUSDC is ERC20, Ownable {
    /**
     * @notice Constructor mints 10,000 mUSDC tokens to the deployer.
     * @dev Initialize the ERC20 token with name and symbol, and transfer ownership to deployer.
     */
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        // Mint 10,000 tokens. Using 6 decimals as it's standard for USDC on Avalanche.
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    /**
     * @notice Returns the number of decimals used to get its user representation.
     * @dev Overridden to return 6 instead of the default 18.
     * @return uint8 The number of decimals.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
    /**
     * @notice Mints additional tokens to a specified address.
     * @dev Only callable by the owner of the contract.
     * @param to The address to receive the minted tokens.
     * @param amount The amount of tokens to mint (in wei based on 6 decimals).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
