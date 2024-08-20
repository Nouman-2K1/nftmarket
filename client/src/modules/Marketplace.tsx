import React, { useState } from "react";
interface NFT {
  id: number;
  name: string;
  imageUrl: string;
  price: string;
  description: string;
}

const nftData: NFT[] = [
  {
    id: 1,
    name: "NFT 1",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.05",
    description: "Description for NFT ",
  },
  {
    id: 2,
    name: "NFT 2",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.10",
    description: "Description for NFT ",
  },
  {
    id: 3,
    name: "NFT 3",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.05",
    description: "Description for NFT ",
  },
  {
    id: 4,
    name: "NFT 4",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.10",
    description: "Description for NFT ",
  },
  {
    id: 5,
    name: "NFT 5",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.05",
    description: "Description for NFT ",
  },
  {
    id: 6,
    name: "NFT 6",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.10",
    description: "Description for NFT ",
  },
  {
    id: 7,
    name: "NFT 7",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.05",
    description: "Description for NFT ",
  },
  {
    id: 8,
    name: "NFT 8",
    imageUrl: "https://via.placeholder.com/150",
    price: "0.10",
    description: "Description for NFT ",
  },
];

const MarketPlace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredNFTs = nftData.filter((nft) =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100">
      <div className="pt-20 pb-5 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-50 md:w-1/3 px-4 py-2 rounded-md focus:outline-none focus:ring-2 border-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-wrap justify-center items-center max-w-5xl gap-6 p-4">
          {filteredNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-lg shadow-md p-4 w-full sm:w-64"
            >
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-4">{nft.name}</h2>
              <p className="text-gray-600 text-sm  mt-2  ">{nft.description}</p>
              <p className="text-gray-600">Price: {nft.price} ETH</p>
              <div className="flex justify-between mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
          {filteredNFTs.length === 0 && (
            <div className="text-gray-500 text-center">
              No NFTs found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
