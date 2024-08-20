import React, { useState } from "react";

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const nfts = [
    {
      id: 1,
      name: "NFT 1",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
    {
      id: 2,
      name: "NFT 2",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
    {
      id: 1,
      name: "NFT 1",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
    {
      id: 2,
      name: "NFT 2",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
    {
      id: 1,
      name: "NFT 1",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
    {
      id: 2,
      name: "NFT 2",
      imageUrl: "https://via.placeholder.com/150",
      description: "Description for NFT ",
    },
  ];

  const handleListNFT = (nft: any) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleSubmitListing = async () => {
    setLoading(true);

    try {
      // Simulate listing process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement the logic to list the NFT for sale here

      alert("NFT has been successfully listed for sale!");
    } catch (error) {
      alert("An error occurred while listing the NFT.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setPrice("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 pt-28 text-indigo-700">
        Your NFTs
      </h1>

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
            <div className="flex justify-between w-full">
              <button
                onClick={() => handleListNFT(nft)}
                className="text-indigo-600 font-medium hover:underline"
              >
                List NFT
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedNFT && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
              {loading ? "Please wait... Listing" : "List Your NFT"}
            </h2>
            {!loading && (
              <>
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
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 sm:text-sm mb-4"
                  placeholder="Enter price in ETH"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition ease-in-out duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitListing}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-150"
                  >
                    List NFT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
