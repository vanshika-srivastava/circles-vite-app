"use client"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { ethers } from "ethers";
import { Sdk } from "@circles-sdk/sdk";
import { crcToTc, tcToCrc } from "@circles-sdk/utils";
import Dashboard from "./dashboard";

const chainConfig = {
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543",
  v2HubAddress: "0x",
  migrationAddress: "0x"
};

export default function CirclesOnboarding() {

  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarInfo, setAvatar] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [mintableAmount, setMintableAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [valueString, setValueString] = useState("");
  const [recipientIsValid, setRecipientIsValid] = useState(false);
  const [trustedCircles, setTrustedCircles] = useState([]);
  const [untrustedCircles, setUntrustedCircles] = useState([]);
  const [newCircle, setNewCircle] = useState("");
  const [mappedRelations, setTrustRelations] = useState([]);
  const navigate = useNavigate();
  


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

      await handleAvatarCheckAndRegister();
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

  const handleAvatarCheckAndRegister = async () => {
    try {
      if (!sdkInitialized || !sdk) {
        throw new Error("SDK is not initialized");
      }
      const avatarInfo = await sdk.getAvatar(walletAddress);
      console.log("Avatar found:", avatarInfo);
      setAvatar(avatarInfo);

      const trustRelations = await avatarInfo.getTrustRelations("");
      console.log("Trust Relations:", trustRelations);
  
      // Update trusted circles state
      setTrustedCircles(trustRelations.map(rel => rel.objectAvatar));

      const mappedRelations = trustRelations.map(rel => ({
        timestamp: rel.timestamp, // Assuming date is a property in the trust relation object
        objectAvatar: rel.objectAvatar,
        relations: rel.relation  // Assuming relation is a property in the trust relation object
      }));

      setTrustRelations(mappedRelations);
      console.log(mappedRelations,"got mapped data");

      
      // Fetch additional avatar details
      const mintableAmount = await avatarInfo.getMintableAmount(walletAddress);
      const totalBalance = await avatarInfo.getTotalBalance(walletAddress);
      setMintableAmount(mintableAmount);
      setTotalBalance(totalBalance);

    } catch (error) {
      console.log("Avatar not found, registering as human...");
      try {
        const newAvatar = await sdk.registerHuman();
        console.log("Registered as V1 Human:", newAvatar);
        setAvatar(newAvatar);
      } catch (registerError) {
        console.error("Error registering avatar:", registerError);
      }
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard', { state: { trustRelations: mappedRelations } });
  };

  const personalMint = async () => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }
      await avatarInfo.personalMint();

      // Update total balance after minting
      const totalBalance = await avatarInfo.getTotalBalance(walletAddress);
      setTotalBalance(totalBalance);
    } catch (error) {
      console.error("Error minting Circles:", error);
    }
  };

  const send = async () => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }

      await avatarInfo.transfer(recipient, tcToCrc(new Date(), parseFloat(valueString)));
      // Redirect to dashboard or show a success message
    } catch (error) {
      console.error("Error sending CRC tokens:", error);
    }
  };
  

  const validateRecipient = () => {
    // Assuming a simple check for a valid Ethereum address format
    const isValid = ethers.isAddress(recipient);
    setRecipientIsValid(isValid);
  };
  

  // const setMax = async () => {
  //   try {
  //     if (!avatarInfo) {
  //       throw new Error("Avatar not found");
  //     }

  //     const maxAmount = await maxTransferableAmount ?? BigInt(0);
  //     setValueString(crcToTc(new Date(), maxAmount).toFixed(2));
  //   } catch (error) {
  //     console.error("Error setting max transferable amount:", error);
  //   }
  // };



  useEffect(() => {
    if (isConnected) {
      handleAvatarCheckAndRegister();
    }
  }, [isConnected]);

  


  const trustNewCircle = async () => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }
  
      await avatarInfo.trust(newCircle);
      setTrustedCircles([...trustedCircles, newCircle]);
      setUntrustedCircles(untrustedCircles.filter((c) => c !== newCircle));
      setNewCircle("");
      logTrustRelations();
  
    } catch (error) {
      console.error("Error trusting new circle:", error);
    }
  };
  
  const untrustCircle = async (circle) => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }
  
      await avatarInfo.untrust(circle);
      setUntrustedCircles([...untrustedCircles, circle]);
      setTrustedCircles(trustedCircles.filter((c) => c !== circle));
      logTrustRelations();
  
      // Call getTrustRelations after updating circles
    } catch (error) {
      console.error("Error untrusting circle:", error);
    }
  };
  




  return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <header className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome to Circles Dev Playground</h1>
            {isLoggedIn && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-sm font-medium">User Balance : {userBalance.slice(0, 6)} xDAI</div>
                  <Button onClick={disconnectWallet} className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-2 rounded">
                    Disconnect Wallet
                  </Button>
                  <Button onClick={handleNavigateToDashboard} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-2 rounded">
                    Dashboard</Button>
                </div>
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
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        onBlur={validateRecipient}
                      />
                       {!recipientIsValid && <p className="text-red-500">Please enter a valid recipient address</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount to Send</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to send"
                        value={valueString}
                        onChange={(e) => setValueString(e.target.value)}
                      />
                    </div>
                    <Button onClick={send} disabled={!recipientIsValid} className="w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                      Send CRC
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-6">Circles Avatar Info</h2>
                  <div className="flex items-center gap-4">
                    {avatarInfo?.image ? (
                      <img src={avatarInfo.image} alt="Avatar" className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Label className="block text-sm font-medium">Address: {avatarInfo?.address}</Label>
                      <Label className="block text-sm font-medium">Total Balance: {totalBalance}</Label>
                      {avatarInfo ? (
                        <Button onClick={personalMint} className="mt-2 bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-6 rounded">
                          Mint Circles
                        </Button>
                      ) : (
                        <Button onClick={handleAvatarCheckAndRegister} className="mt-2 bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                          Get your Circles Avatar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg h-full md:col-span-2">
                  <h2 className="text-xl font-bold mb-4">Trust new circles avatar</h2>
                  <ScrollArea style={{ maxHeight: '300px', overflowY: 'auto' }} className="custom-scroll-area">
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <Input
                        id="newCircle"
                        type="text"
                        placeholder="Enter new circle address"
                        value={newCircle}
                        onChange={(e) => setNewCircle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            trustNewCircle(newCircle);
                          }
                        }}
                      />
                      <Button onClick={() => trustNewCircle(newCircle)} className="bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                        Trust
                      </Button>
                    </div>
                    {[...trustedCircles, ...untrustedCircles].map((circle, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                        <div>{circle}</div>
                        {trustedCircles.includes(circle) ? (
                          <Button onClick={() => untrustCircle(circle)} variant="outline" size="sm">
                            Untrust
                          </Button>
                        ) : (
                          <Button onClick={() => trustNewCircle(circle)} variant="outline" size="sm">
                            Trust
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
  );
}


function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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



