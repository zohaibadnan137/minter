const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ZoToken...");

  const ZoToken = await ethers.getContractFactory("ZoToken");
  const ZoTokenDeployed = await ZoToken.deploy();

  console.log("ZoToken was deployed to: ", await ZoTokenDeployed.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
