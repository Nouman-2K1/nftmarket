import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../ContractABI/ContractABI";

const pinataJwt = import.meta.env.VITE_PINATA_JWT;
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const CreateNFT: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getTimestampedFile = (file: File): File => {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "png";
    const newName = `${timestamp}.${extension}`;
    return new File([file], newName, { type: file.type });
  };

  const uploadFileToPinata = async (file: File): Promise<string> => {
    try {
      const timestampedFile = getTimestampedFile(file);
      const data = new FormData();
      data.append("file", timestampedFile);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Pinata response error:", errorDetails);
        throw new Error("Failed to upload image to Pinata");
      }

      const result = await response.json();
      if (result.IpfsHash) {
        return `https://${pinataGateway}/ipfs/${result.IpfsHash}`;
      } else {
        throw new Error("Failed to upload image to Pinata");
      }
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      throw error;
    }
  };

  const uploadMetadataToPinata = async (imageUrl: string): Promise<string> => {
    try {
      const metadata = {
        name: name,
        description: description,
        image: imageUrl,
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Pinata response error:", errorDetails);
        throw new Error("Failed to upload metadata to Pinata");
      }

      const result = await response.json();
      if (result.IpfsHash) {
        return `https://${pinataGateway}/ipfs/${result.IpfsHash}`;
      } else {
        throw new Error("Failed to upload metadata to Pinata");
      }
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw error;
    }
  };

  const handleCreateNFT = async () => {
    if (!name || !image || !description) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Pinata
      const imageUrl = await uploadFileToPinata(image);

      // Upload metadata to Pinata with the image URL
      const metadataUrl = await uploadMetadataToPinata(imageUrl);

      // Create an instance of the contract
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        await signer
      );

      // Call the contract function to create the NFT
      const tx = await contract.createNFT(metadataUrl);
      await tx.wait();

      alert("NFT created successfully!");

      setName("");
      setImage(null);
      setDescription("");
    } catch (error) {
      console.error("Error creating NFT", error);
      alert("Failed to create NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create Your NFT
        </h1>
        <form className="space-y-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-800"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter NFT name"
              disabled={loading}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-800"
              htmlFor="image"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {image && (
              <p className="mt-2 text-gray-600">Selected File: {image.name}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-800"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter NFT description"
              disabled={loading}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCreateNFT}
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create NFT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;
