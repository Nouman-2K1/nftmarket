import React, { useState } from "react";

const CreateNFT: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      // TODO: Implement image upload to Pinata and get URL
    }
  };

  const handleCreateNFT = async () => {
    if (!name || !image || !description) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement metadata upload to Pinata and NFT creation
      // Simulate a delay for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("NFT created successfully!");
    } catch (error) {
      console.error("Error creating NFT", error);
      alert("Failed to create NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl  ">
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
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 "
              placeholder="Enter NFT name"
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
              onChange={handleImageUpload}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 "
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
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 "
              placeholder="Enter NFT description"
            />
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleCreateNFT}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 "
            >
              Create NFT
            </button>
            {loading && (
              <p className="mt-4 text-blue-700 font-semibold">
                Please wait... Uploading...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;
