require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    rskTestnet: {
         url: process.env.ROOTSTOCK_TESTNET_RPC_URL,
        chainId: 31,
        verbose: true,
        accounts: [process.env.PRIVATE_KEY],
      }
  },
  
};
