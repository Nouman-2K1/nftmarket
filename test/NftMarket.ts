import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";

describe("NFTMarketplace", function () {
  let NFTMarketplace: ContractFactory;
  let nftMarketplace: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    [owner, addr1, addr2] = await ethers.getSigners();

    nftMarketplace = (await NFTMarketplace.deploy(owner.address)) as Contract; 
  });

  it("should mint an NFT", async function () {
    const tokenURI = "https://example.com/nft/1";
    const tx = await nftMarketplace.createNFT(tokenURI);
    const receipt = await tx.wait(); 

    expect(receipt.logs[2].args[0].toString()).to.equal("0");
    expect(await nftMarketplace.ownerOf(0)).to.equal(owner.address);
    expect(await nftMarketplace.tokenURI(0)).to.equal(tokenURI);
  });

  it("should list an NFT for sale", async function () {
    const tokenURI = "https://example.com/nft/2";
    await nftMarketplace.createNFT(tokenURI);
    await nftMarketplace.listNFT(0, ethers.parseEther("1"));

    const listing = await nftMarketplace.getListedNFTs();
    expect(listing.length).to.equal(1);
    expect(listing[0].price).to.equal(ethers.parseEther("1"));
  });

  it("should allow a user to buy an NFT", async function () {
    const tokenURI = "https://example.com/nft/3";
    await nftMarketplace.createNFT(tokenURI);

    await nftMarketplace.listNFT(0, ethers.parseEther("1"));

    await expect(() =>
      nftMarketplace.connect(addr1).buyNFT(0, {
        value: ethers.parseEther("1"),
      })
    ).to.changeEtherBalances(
      [addr1, owner],
      [-ethers.parseEther("1"), ethers.parseEther("1")]
    );

    expect(await nftMarketplace.ownerOf(0)).to.equal(addr1.address);
  });

  it("should allow a user to cancel an NFT listing", async function () {
    const tokenURI = "https://example.com/nft/4";
    await nftMarketplace.createNFT(tokenURI);

    await nftMarketplace.listNFT(0, ethers.parseEther("1"));

    await nftMarketplace.cancelListing(0);

    const listing = await nftMarketplace.getListedNFTs();
    expect(listing.length).to.equal(0);

    expect(await nftMarketplace.ownerOf(0)).to.equal(owner.address);
  });

  it("should return all listed NFTs", async function () {
    const tokenURI1 = "https://example.com/nft/5";
    const tokenURI2 = "https://example.com/nft/6";
    await nftMarketplace.createNFT(tokenURI1);
    await nftMarketplace.createNFT(tokenURI2);

    await nftMarketplace.listNFT(0, ethers.parseEther("1"));
    await nftMarketplace.listNFT(1, ethers.parseEther("2"));

    const listings = await nftMarketplace.getListedNFTs();
    expect(listings.length).to.equal(2);
    expect(listings[0].price).to.equal(ethers.parseEther("1"));
    expect(listings[1].price).to.equal(ethers.parseEther("2"));
  });

  it("should return NFTs owned by a user", async function () {
    const tokenURI1 = "https://example.com/nft/7";
    const tokenURI2 = "https://example.com/nft/8";
    await nftMarketplace.createNFT(tokenURI1);
    await nftMarketplace.createNFT(tokenURI2);

    await nftMarketplace.transferFrom(owner.address, addr1.address, 0);
    await nftMarketplace.transferFrom(owner.address, addr2.address, 1);

    const addr1NFTs = await nftMarketplace.getUserNFTs(addr1.address);
    const addr2NFTs = await nftMarketplace.getUserNFTs(addr2.address);

    expect(addr1NFTs.length).to.equal(1);
    expect(addr2NFTs.length).to.equal(1);
    expect(addr1NFTs[0]).to.equal(0);
    expect(addr2NFTs[0]).to.equal(1);
  });
});
