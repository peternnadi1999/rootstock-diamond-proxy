const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Diamond Proxy Test", function () {
  async function deployDiamondFixture() {
    const [owner, user] = await ethers.getSigners();

    // Deploy the DiamondCutFacet first
    const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
    const diamondCutFacet = await DiamondCutFacet.deploy();
    await diamondCutFacet.waitForDeployment();

    // Deploy the Diamond contract, passing the DiamondCutFacet address
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(diamondCutFacet.target);
    await diamond.waitForDeployment();

    // Attach the DiamondCutFacet interface to the Diamond proxy
    const diamondAsCutFacet = await ethers.getContractAt("DiamondCutFacet", diamond.target);

    // Get function selectors for DiamondCutFacet
    const diamondCutSelectors = Object.values(diamondCutFacet.interface.fragments)
      .filter((fragment) => fragment.type === "function")
      .map((fragment) => diamondCutFacet.interface.getFunction(fragment.name).selector);

    // Add DiamondCutFacet to the Diamond proxy
    const tx = await diamondAsCutFacet.connect(owner).diamondCut(
      diamondCutFacet.target,
      diamondCutSelectors,
      true
    );
    await tx.wait();
    console.log("DiamondCutFacet added, tx hash:", tx.hash);

    // Deploy the MarketplaceFacet
    const MarketplaceFacet = await ethers.getContractFactory("MarketPlaceFacet");
    const marketplaceFacet = await MarketplaceFacet.deploy();
    await marketplaceFacet.waitForDeployment();

    // Get and log function selectors for MarketplaceFacet
    const marketplaceSelectors = Object.values(marketplaceFacet.interface.fragments)
      .filter((fragment) => fragment.type === "function")
      .map((fragment) => marketplaceFacet.interface.getFunction(fragment.name).selector);
    console.log("MarketplaceFacet selectors:", marketplaceSelectors);

    // Add MarketplaceFacet via the Diamond proxy
    const marketplaceTx = await diamondAsCutFacet.connect(owner).diamondCut(
      marketplaceFacet.target,
      marketplaceSelectors,
      true
    );
    await marketplaceTx.wait();
    console.log("MarketplaceFacet added, tx hash:", marketplaceTx.hash);

    // Attach the MarketplaceFacet interface to the Diamond proxy
    const diamondAsMarketplaceFacet = await ethers.getContractAt("MarketPlaceFacet", diamond.target);

    return { diamond, diamondAsCutFacet, diamondAsMarketplaceFacet, marketplaceFacet, owner, user };
  }

  it("lists and retrieves an item via delegate call", async function () {
    const { diamondAsMarketplaceFacet, user } = await loadFixture(deployDiamondFixture);

    // Test listing and retrieving an item
    await diamondAsMarketplaceFacet
      .connect(user)
      .listItem(1, "Beaded Necklace", ethers.parseEther("0.01"));
    const [name, price] = await diamondAsMarketplaceFacet.connect(user).getItem(1);
    expect(name).to.equal("Beaded Necklace");
    expect(price).to.equal(ethers.parseEther("0.01"));
  });

  it("processes payment via delegate call", async function () {
    const { diamond, diamondAsCutFacet, diamondAsMarketplaceFacet, owner, user } = await loadFixture(deployDiamondFixture);

    // Deploy and add the PaymentFacet
    const PaymentFacet = await ethers.getContractFactory("PaymentFacet");
    const paymentFacet = await PaymentFacet.deploy();
    await paymentFacet.waitForDeployment();

    // Get and log function selectors for PaymentFacet
    const paymentSelectors = Object.values(paymentFacet.interface.fragments)
      .filter((fragment) => fragment.type === "function")
      .map((fragment) => paymentFacet.interface.getFunction(fragment.name).selector);
    console.log("PaymentFacet selectors:", paymentSelectors);

    // Add PaymentFacet via the Diamond proxy
    const paymentTx = await diamondAsCutFacet.connect(owner).diamondCut(
      paymentFacet.target,
      paymentSelectors,
      true
    );
    await paymentTx.wait();
    console.log("PaymentFacet added, tx hash:", paymentTx.hash);

    // Attach the PaymentFacet interface to the Diamond proxy
    const diamondAsPaymentFacet = await ethers.getContractAt("PaymentFacet", diamond.target);

    // First list an item to set the price
    await diamondAsMarketplaceFacet
      .connect(user)
      .listItem(1, "Beaded Necklace", ethers.parseEther("0.01"));

    // Test payment processing with the correct amount
    await diamondAsPaymentFacet
      .connect(user)
      .processPayment(1, { value: ethers.parseEther("0.01") });
    expect(true).to.be.true;
  });

  it("profiles gas for listing", async function () {
    const { diamondAsMarketplaceFacet, user } = await loadFixture(deployDiamondFixture);

    // Test gas usage for listing an item
    const tx = await diamondAsMarketplaceFacet
      .connect(user)
      .listItem(1, "Beaded Necklace", ethers.parseEther("0.01"));
    const receipt = await tx.wait();
    console.log("Gas Used:", receipt.gasUsed.toString());
    expect(receipt.gasUsed).to.be.below(80000); // Adjusted target to 80k gas
  });
});