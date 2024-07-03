"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ethers } from "ethers"
import { BrowserProvider } from "ethers"
import { Sdk } from "@circles-sdk/sdk"
import { Avatar } from "@circles-sdk/sdk"

const chainConfig = {
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543",
  v2HubAddress: "0x",
  migrationAddress: "0x"
};

export default function Component() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarInfo, setAvatar] = useState();
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  const provider = new ethers.BrowserProvider(window.ethereum);

  let signer = null;
  let walletAddress = null;
  let sdk = null;
  let sdkInitialized = false;

  async function initializeSdk(signer) {
    try {
      sdk = new Sdk(chainConfig, signer);
      console.log("SDK initialized:", sdk);
      sdkInitialized = true;
      return sdk;
    } catch (error) {
      console.error("Error initializing SDK:", error);
      throw error;
    }
  }

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      signer = await provider.getSigner();
      walletAddress = await signer.getAddress();

      if (!sdkInitialized) {
        sdk = await initializeSdk(signer);
        console.log("SDK after initialization:", sdk);
      }
      const balance = await provider.getBalance(walletAddress);
      setUserBalance(ethers.formatEther(balance));

      setUserAddress(walletAddress);
      setIsConnected(true);
      setIsLoggedIn(true);

      await checkAndRegisterAvatar();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setIsLoggedIn(false);
    setUserAddress("");
    setUserBalance(0);
    setAvatarImage(null);
  };

  async function checkAndRegisterAvatar() {
    try {
      if (!sdkInitialized || !sdk) {
        throw new Error("SDK is not initialized");
      }

      const avatarInfo = await sdk.getAvatar(walletAddress);
      console.log("Avatar found:", avatarInfo);
      setAvatar(avatarInfo);
    } catch (error) {
      console.log("Avatar not found, registering as human...");
      const newAvatar = await sdk.registerHuman();
      console.log("Registered as V1 Human:", newAvatar);
      setAvatar(newAvatar);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <header className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome to Circles Dev Playground</h1>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <Button onClick={disconnectWallet} className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Disconnect Wallet
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>
                <div className="text-sm font-medium">{userBalance} ETH</div>
              </div>
              {avatarImage ? (
                <img src="/placeholder.svg" alt="Avatar" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="text-sm font-medium"> CRC </div>
            </div>
          )}
        </header>
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isConnected ? (
            <div className="flex items-center justify-center md:col-span-2">
              <Button onClick={connectWallet} className="bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                Connect Wallet
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Send Circles CRC Token</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="Enter recipient address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Send</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to send"
                    />
                  </div>
                  <Button className="w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                    Send CRC
                  </Button>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Your Balance</h2>
                <div className="flex items-center gap-4">
                  {avatarImage ? (
                    <img src="/placeholder.svg" alt="Avatar" className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold"> CRC</div>
                    <Button onClick={checkAndRegisterAvatar} className="mt-2 bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                      Get your Circles Avatar
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
