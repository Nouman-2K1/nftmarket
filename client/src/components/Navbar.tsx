import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } catch (error) {
        console.error("Connection to MetaMask failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchBalance = async (account: string) => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.formatEther(balance));
  };

  const handleLogout = () => {
    setAccount(null);
    setBalance(null);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Market</div>
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-1/3 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-6 items-center">
          <Link
            to="/main/marketplace"
            className="text-white hover:text-blue-400"
          >
            MarketPlace
          </Link>
          <Link
            to="/main/create-nft"
            className="text-white hover:text-blue-400"
          >
            Create NFT
          </Link>
          <Link to="/main/profile" className="text-white hover:text-blue-400">
            Profile
          </Link>
          <div>
            {account ? (
              <div className="flex flex-row items-end text-white text-right">
                <div className="flex flex-col">
                  <span className="block text-sm">
                    Address: {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <span className="block text-sm">Balance: {balance} ETH</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
