import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_OWNER_ADDRESS = "0xa31A461ccdC1467fAe421711D6CB15dCA70DC1FF";  

const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", INITIAL_OWNER_ADDRESS);

  const nftMarketplace = m.contract("NFTMarketplace", [initialOwner]);

  return { nftMarketplace };
});

export default NFTMarketplaceModule;
