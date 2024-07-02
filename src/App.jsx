/**
 * v0 by Vercel.
 * @see https://v0.dev/t/4LduZrYJqu6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
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
  circlesRpcUrl: 'rpc.helsinki.aboutcircles.com',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543",
  v2HubAddress: "0xFFfbD3E62203B888bb8E09c1fcAcE58242674964",
  migrationAddress: "0x0A1D308a39A6dF8972A972E586E4b4b3Dc73520f"
};

export default function Component() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [signer, setSigner] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  // const [userBalance, setUserBalance] = useState(0)
  // const [recipientAddress, setRecipientAddress] = useState("")
  // const [sendAmount, setSendAmount] = useState(0)


  const provider = new ethers.BrowserProvider(window.ethereum);
  let signer = null ;
  let walletAddress = null ;
  let sdk = null ;



  async function initializeSdk(signer) {
    try {
        // Initialize the SDK with the chain configuration and the provider
        sdk = new Sdk(chainConfig, signer);
        console.log("SDK initialized:", sdk);

        // return sdk;
    } catch (error) {
        console.error("Error initializing SDK:", error);
        throw error; // Propagate the error for further handling if necessary
    }
  };

const connectWallet = async () => {
  try {
      // Request account access from the user
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the signer after the wallet is connected
      signer = await provider.getSigner();
  
      walletAddress = await signer.getAddress()

      // Initialize SDK after wallet connection
      initializeSdk(signer);

      // Update state to reflect that the wallet is connected and logged in
      setIsConnected(true);
      setIsLoggedIn(true);
  } catch (error) {
      // Handle any errors that occur during wallet connection
      console.error("Error connecting wallet:", error);
  }
  };


  //once SDK initialized, check if the address is registered or not using getAvatarInfo, if not register as V1 Human

async function checkAndRegisterAvatar(sdk, signer) {
    try {
        try {
            // Attempt to get the avatar info
            const avatar = await sdk.getAvatar(walletAddress);
            console.log("Avatar found:", avatar);
            setAvatar(avatar);
        } catch (error) {
            // If error occurs (avatar not found), register as human
            console.log("Avatar not found, registering as human...");
            const avatar = await sdk.registerHuman();
            console.log("Registered as V1 Human:", avatar);
            setAvatar(avatar);
            generateAvatar();
        }
    } catch (error) {
        console.error("Error during registration check:", error);
    }
  };
  
  const generateAvatar = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setAvatarImage(canvas.toDataURL())
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <header className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome to Circles Dev Playground</h1>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
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
              // value={recipientAddress}
              // onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Send</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to send"
              // value={sendAmount}
              // onChange={(e) => setSendAmount(e.target.value)}
            />
          </div>
          {/* <Button onClick={sendEther} className="w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
            Send CRC
          </Button> */}
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