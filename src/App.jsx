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

const chainConfig = {
  circlesRpcUrl: 'rpc.helsinki.aboutcircles.com',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543",
  v2HubAddress: "0xFFfbD3E62203B888bb8E09c1fcAcE58242674964",
  migrationAddress: "0x0A1D308a39A6dF8972A972E586E4b4b3Dc73520f"
};


export default function Component() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendAmount, setSendAmount] = useState(0)
  const [avatarImage, setAvatarImage] = useState(null)

  


  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      setIsConnected(true)
      setIsLoggedIn(true)
      updateBalance()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }
  const updateBalance = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
      const balanceInEther = window.web3.utils.fromWei(balance, "ether")
      setUserBalance(balanceInEther)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }
  const generateAvatar = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setAvatarImage(canvas.toDataURL())
  }
  const sendEther = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: recipientAddress,
            value: window.web3.utils.toWei(sendAmount.toString(), "ether"),
          },
        ],
      })
      updateBalance()
    } catch (error) {
      console.error("Error sending Ether:", error)
    }
  }
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
              <div className="text-sm font-medium">{userBalance} CRC </div>
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
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Send</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to send"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
            />
          </div>
          <Button onClick={sendEther} className="w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
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
            <div className="text-2xl font-bold">{userBalance} CRC</div>
            <Button onClick={generateAvatar} className="mt-2 bg-blue-800 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
              Create Avatar
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