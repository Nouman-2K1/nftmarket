const { Network, Alchemy } = require('alchemy-sdk');

const settings = {
  apiKey: "s3TknIMmo7u1YZt5Dyson43TJvTDyElo",
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);
 
alchemy.core.getAssetTransfers({
  fromBlock: "0x0",
  fromAddress: "0x994b342dd87fc825f66e51ffa3ef71ad818b6893",
  category: ["ERC721", "EXTERNAL", "ERC20"],  
})
  .then(console.log)
  .catch(console.error);
