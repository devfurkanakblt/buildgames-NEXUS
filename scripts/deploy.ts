import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy MockUSDC
    console.log("Deploying MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();
    console.log(`MockUSDC deployed to: ${mockUSDCAddress}`);

    // 2. Teleporter Component
    // Using the generic Fuji Teleporter Messenger Address
    const teleporterMessengerAddress = "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf";

    // 3. Deploy NexusVault (C-Chain simulation)
    console.log("Deploying NexusVault...");
    const NexusVault = await ethers.getContractFactory("NexusVault");
    const nexusVault = await NexusVault.deploy(teleporterMessengerAddress, mockUSDCAddress);
    await nexusVault.waitForDeployment();
    const nexusVaultAddress = await nexusVault.getAddress();
    console.log(`NexusVault deployed to: ${nexusVaultAddress}`);

    // 4. Deploy NexusBilling (Subnet simulation)
    console.log("Deploying NexusBilling...");
    // Using Fuji C-Chain Blockchain ID as a mock target (padded to bytes32)
    const cChainBlockchainID = ethers.zeroPadValue("0x7Fc93d85c6D62c5b2Ac0B519C875A0273D5571B3", 32);

    const NexusBilling = await ethers.getContractFactory("NexusBilling");
    const nexusBilling = await NexusBilling.deploy(
        teleporterMessengerAddress,
        cChainBlockchainID,
        nexusVaultAddress
    );
    await nexusBilling.waitForDeployment();
    const nexusBillingAddress = await nexusBilling.getAddress();
    console.log(`NexusBilling deployed to: ${nexusBillingAddress}`);

    // 5. Setup Permissions
    console.log("Configuring contracts...");
    // Assume a dummy Subnet ID for the billing contract
    const mockSubnetId = "0x1111111111111111111111111111111111111111111111111111111111111111";

    const tx = await nexusVault.setAllowedBillingContract(mockSubnetId, nexusBillingAddress);
    await tx.wait();
    console.log(`NexusVault configured to trust NexusBilling (${nexusBillingAddress}) from Subnet (${mockSubnetId})`);

    console.log("\n--- Deployment Summary ---");
    console.log("MockUSDC:", mockUSDCAddress);
    console.log("NexusVault:", nexusVaultAddress);
    console.log("NexusBilling:", nexusBillingAddress);
    console.log("--------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
