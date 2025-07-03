# Rootstock Diamond Proxy Tutorial

This repository contains a comprehensive guide and implementation of the **Diamond Proxy Contract pattern (EIP-2535)** on the **Rootstock (RSK)** blockchain, an EVM-compatible sidechain secured by Bitcoin. The tutorial demonstrates building a modular, upgradeable decentralized marketplace dApp for African artisans (e.g., Kenya's $500M craft sector, 2024) using Hardhat, with $6.6 billion in Bitcoin locked in Rootstock DeFi (February 2025).

## Overview

- **Pattern**: Diamond Proxy for modularity, upgradeability, and gas efficiency.
- **Features**: Marketplace (listing items), payment processing, and dynamic facet management.
- **Tech Stack**: Solidity, Hardhat, Rootstock Testnet, delegate calls.
- **Use Case**: A scalable dApp for Kenyan artisans, leveraging Rootstock's RBTC economics.

## Prerequisites

- **Node.js**: v16 or higher.
- **Yarn**: Install with `npm install -g yarn`.
- **MetaMask**: Configured for Rootstock Testnet (Chain ID: 31, RPC: `https://public-node.testnet.rsk.co`).
- **Rootstock Testnet tRBTC**: From `https://faucet.testnet.rootstock.io/`.
- **Environment**: `.env` with `ROOTSTOCK_TESTNET_RPC_URL` and `PRIVATE_KEY`.

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/peternnadi1999/rootstock-diamond-proxy.git
   cd rootstock-diamond-proxy
   
2. Install dependencies:

`npm install`

3. Configure .env with your Rootstock Testnet RPC URL and private key.

4. Start a local Hardhat node:
`
npx hardhat node`

**Usage**
1. Deploy the contract:
`npx hardhat run script/interaction.js --network rskTestnet`

Note the deployed Diamond address (e.g., 0xA3a8062b26605a9b14379e16902ae503b57a5).

2. Run tests:
`
npx hardhat test test/diamond.test.js`

3. Optimize gas (optional):
- Profile gas usage with the test script and adjust code.

##Project Structure

- **contracts/**: Solidity files (Diamond.sol, facets, libraries).
- **script/**: Deployment script (interaction.js).
- **test/**: Test suite (diamond.test.js).
- **hardhat.config.js** : Hardhat configuration.

##Key Concepts

- **Delegate Calls**: Route function calls to facets while preserving Diamond storage.
- **Storage Library**: Ensures shared state across facets (DiamondStorage.sol).
- **Facets**: Modular logic (MarketplaceFacet, PaymentFacet, DiamondCutFacet).
- **Gas Optimization**: Batch facet additions, cache selectors.

##Challenges & Mitigations

- **Storage Collisions**: Use standardized storage layout.
- **Upgrade Risks**: Test upgrades in staging.
- **Gas Costs**: Batch operations and optimize selectors.

##Deployment
Deploy to Rootstock Testnet and interact via the Diamond address. Avoid direct calls to facet addresses.

##Resources
- **Rootstock Dev Portal**: https://developers.rsk.co/
- **Rootstock Discord**: Join for community support.
- **Full Code**: This repo (https://github.com/peternnadi1999/rootstock-diamond-proxy)

##Acknowledgments
Thanks to the Rootstock community and contributors for enabling this tutorial.

### Notes
- The Markdown format uses proper headers (`#`, `##`), code blocks (```), and links.
- The repo URL is based on the article's reference (`https://github.com/peternnadi1999/rootstock-diamond-proxy`); update if needed.
- The `.env` setup is simplified to match the article's `hardhat.config.js` example.
- The gas target (80k) from the article is implied in the optimization step.
