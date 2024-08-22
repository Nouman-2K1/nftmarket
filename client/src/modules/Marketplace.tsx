import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../ContractABI/ContractABI";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  seller: string;
}

const MarketPlace: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [buyingTokenId, setBuyingTokenId] = useState<string | null>(null);

  const account = localStorage.getItem("account");

  const GetIpfsUrlFromPinata = (pinataUrl: string) => {
    const IPFSUrl = pinataUrl.split("/");
    const lastIndex = IPFSUrl.length;
    const ipfsHash = IPFSUrl[lastIndex - 1];
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  const getAllNFTs = async () => {
    setFetching(true);
    try {
      if (!(window as any).ethereum) {
        alert("Ethereum wallet not detected");
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        await signer
      );

      const listedNFTs = await contract.getListedNFTs();
      const nftPromises = listedNFTs.map(async (nft: any) => {
        try {
          const tokenId = nft.tokenId;
          const metadataUrl = await contract.tokenURI(tokenId);
          const ipfsUrl = GetIpfsUrlFromPinata(metadataUrl);
          const response = await fetch(ipfsUrl);
          const metadata = await response.json();

          return {
            tokenId: tokenId.toString(),
            name: metadata.name,
            imageUrl: metadata.image,
            description: metadata.description,
            price: ethers.formatEther(nft.price.toString()),
            seller: nft.seller,
          };
        } catch (error) {
          console.error(`Error fetching data for Token ${nft.tokenId}:`, error);
          return null;
        }
      });

      const nftData = (await Promise.all(nftPromises)).filter(
        (nft) => nft !== null
      );
      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getAllNFTs();
  }, []);

  const handleBuyNFT = async (nft: NFT) => {
    setBuyingTokenId(nft.tokenId);
    try {
      const { ethereum } = window as any;
      if (ethereum && account) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const transaction = await contract.buyNFT(nft.tokenId, {
          value: ethers.parseEther(nft.price),
        });

        await transaction.wait();
        alert("NFT purchased successfully!");

        setNfts((prevNfts) =>
          prevNfts.filter((item) => item.tokenId !== nft.tokenId)
        );
      }
    } catch (error) {
      console.error("Purchase failed", error);
    } finally {
      setBuyingTokenId(null);
    }
  };

  const filteredNFTs = nfts.filter((nft) =>
    (nft.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100">
      <div className="pt-28 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-50 md:w-1/3 px-4 py-2 rounded-md focus:outline-none focus:ring-2 border-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-center items-center min-h-screen">
        {fetching ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center max-w-5xl gap-6 py-4">
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="bg-white rounded-lg shadow-md p-4 w-full sm:w-64"
                >
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h2 className="text-xl font-bold mt-4">{nft.name}</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {nft.description}
                  </p>
                  <p className="text-gray-600">Price: {nft.price} ETH</p>
                  <div className="flex justify-between mt-4">
                    {nft.seller.toLowerCase() === account?.toLowerCase() ? (
                      <span className="text-green-600">You own this NFT</span>
                    ) : (
                      <button
                        onClick={() => handleBuyNFT(nft)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
                      >
                        {buyingTokenId === nft.tokenId ? (
                          <div className="animate-spin border-t-4 border-white border-solid rounded-full h-5 w-5 mr-2"></div>
                        ) : (
                          "Buy Now"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">
                No NFTs found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
