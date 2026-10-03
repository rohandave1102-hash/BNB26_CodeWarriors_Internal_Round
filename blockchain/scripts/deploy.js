const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying ModelLedger Smart Contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const ModelLedger = await hre.ethers.getContractFactory("ModelLedger");
  const modelLedger = await ModelLedger.deploy();

  await modelLedger.waitForDeployment();
  const contractAddress = await modelLedger.getAddress();

  console.log(`✅ ModelLedger successfully deployed to: ${contractAddress}`);

  // Export contract address and ABI for backend consumption
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ModelLedger.sol/ModelLedger.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const outputDir = path.join(__dirname, "../../backend/app/config");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const configData = {
    contractAddress: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployerAddress: deployer.address,
    abi: abi
  };

  const outputPath = path.join(outputDir, "contractConfig.json");
  fs.writeFileSync(outputPath, JSON.stringify(configData, null, 2));
  console.log(`📄 Saved contract config to: ${outputPath}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
