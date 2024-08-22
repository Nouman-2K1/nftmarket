import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../ContractABI/ContractABI";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const Profile: React.FC = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [transactionMessage, setTransactionMessage] = useState<string>("");

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

      const userAddress = await (await signer).getAddress();

      const userTokenIds: number[] = await contract.getUserNFTs(userAddress);

      const listedNFTs = await contract.getListedNFTs();

      const userListedNFTs = listedNFTs.filter(
        (listing: { seller: string }) => listing.seller === userAddress
      );

      const combinedTokenIds = [
        ...userTokenIds,
        ...userListedNFTs.map(
          (listing: { tokenId: number }) => listing.tokenId
        ),
      ];

      const nftPromises = combinedTokenIds.map(async (tokenId) => {
        try {
          const metadataUrl = await contract.tokenURI(tokenId);
          const ipfsUrl = GetIpfsUrlFromPinata(metadataUrl);
          const response = await fetch(ipfsUrl);
          const metadata = await response.json();

          const isListed = listedNFTs.some(
            (listing: { tokenId: number }) => listing.tokenId === tokenId
          );
          const listing = listedNFTs.find(
            (listing: { tokenId: number }) => listing.tokenId === tokenId
          );

          return {
            id: tokenId.toString(),
            name: metadata.name,
            imageUrl: metadata.image,
            description: metadata.description,
            listed: isListed,
            price: isListed ? listing.price.toString() : undefined,
          };
        } catch (error) {
          console.error(`Error fetching data for Token ${tokenId}:`, error);
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

  const handleListNFT = async (nft: any) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleSubmitListing = async () => {
    setLoading(true);
    setTransactionMessage("Please wait... Listing your NFT");

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

      const transaction = await contract.listNFT(
        selectedNFT.id,
        ethers.parseEther(price)
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      alert("NFT has been successfully listed for sale!");
      await getAllNFTs();
    } catch (error) {
      alert("An error occurred while listing the NFT.");
    } finally {
      setLoading(false);
      setTransactionMessage("");
      setIsModalOpen(false);
      setPrice("");
    }
  };

  const handleCancelListing = async (nft: any) => {
    setLoading(true);
    setTransactionMessage("Please wait... Canceling your NFT listing");

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

      const transaction = await contract.cancelListing(nft.id);

      // Wait for the transaction to be mined
      await transaction.wait();

      alert("NFT listing has been successfully canceled!");
      await getAllNFTs();
    } catch (error) {
      alert("An error occurred while canceling the listing.");
    } finally {
      setLoading(false);
      setTransactionMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 pt-28 text-indigo-700">
        Your NFTs
      </h1>

      {fetching ? (
        <div className="flex items-center justify-center w-full h-48">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : nfts.length === 0 ? (
        <p className="text-lg text-gray-600">No NFTs found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full max-w-xs hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                {nft.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4 text-center">
                {nft.description}
              </p>
              <div className="flex justify-center w-full">
                {!nft.listed ? (
                  <button
                    onClick={() => handleListNFT(nft)}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    List NFT
                  </button>
                ) : (
                  <button
                    onClick={() => handleCancelListing(nft)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Cancel Listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
              {transactionMessage}
            </h2>
            <div className="flex justify-center items-center">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedNFT && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
              List Your NFT
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedNFT.imageUrl}
                alt={selectedNFT.name}
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="price"
            >
              Set Listing Price (ETH)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              placeholder="Enter price in ETH"
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSubmitListing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
              >
                Confirm Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
