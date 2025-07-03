const { ethers } = require("hardhat");

async function main() {
  // Get the deployer account (first signer)
  const [deployer] = await ethers.getSigners();

  // Deploy the DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.waitForDeployment();
  console.log("DiamondCutFacet deployed to:", diamondCutFacet.target);

  // Deploy the Diamond contract, passing the DiamondCutFacet address
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(diamondCutFacet.target);
  await diamond.waitForDeployment();
  console.log("Diamond deployed to:", diamond.target);

  // Attach the DiamondCutFacet interface to the Diamond proxy
  const diamondAsCutFacet = await ethers.getContractAt("DiamondCutFacet", diamond.target);

  // Dynamically generate DiamondCutFacet selector using Interface
  const diamondCutFacetInterface = new ethers.Interface(DiamondCutFacet.interface.format());
  const diamondCutFunction = diamondCutFacetInterface.getFunction("diamondCut");
  const diamondCutSelectors = [diamondCutFunction.selector];

  // Add DiamondCutFacet to the Diamond proxy
  await diamondAsCutFacet.connect(deployer).diamondCut(
    diamondCutFacet.target,
    diamondCutSelectors,
    true
  );
  console.log("DiamondCutFacet added to Diamond proxy");

  // Deploy the MarketplaceFacet
  const MarketplaceFacet = await ethers.getContractFactory("MarketPlaceFacet");
  const marketplaceFacet = await MarketplaceFacet.deploy();
  await marketplaceFacet.waitForDeployment();
  console.log("MarketplaceFacet deployed to:", marketplaceFacet.target);

  // Dynamically generate MarketplaceFacet selectors using Interface
  const marketplaceFacetInterface = new ethers.Interface(MarketplaceFacet.interface.format());
  const listItemFunction = marketplaceFacetInterface.getFunction("listItem");
  const getItemFunction = marketplaceFacetInterface.getFunction("getItem");
  const marketplaceSelectors = [listItemFunction.selector, getItemFunction.selector];

  // Add MarketplaceFacet to the Diamond proxy
  await diamondAsCutFacet.connect(deployer).diamondCut(
    marketplaceFacet.target,
    marketplaceSelectors,
    true
  );
  console.log("MarketplaceFacet added to Diamond proxy");

  // Deploy the PaymentFacet
  const PaymentFacet = await ethers.getContractFactory("PaymentFacet");
  const paymentFacet = await PaymentFacet.deploy();
  await paymentFacet.waitForDeployment();
  console.log("PaymentFacet deployed to:", paymentFacet.target);

  // Dynamically generate PaymentFacet selector using Interface
  const paymentFacetInterface = new ethers.Interface(PaymentFacet.interface.format());
  const processPaymentFunction = paymentFacetInterface.getFunction("processPayment");
  const paymentSelectors = [processPaymentFunction.selector];

  // Add PaymentFacet to the Diamond proxy
  await diamondAsCutFacet.connect(deployer).diamondCut(
    paymentFacet.target,
    paymentSelectors,
    true
  );
  console.log("PaymentFacet added to Diamond proxy");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});