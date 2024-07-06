
"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function Dashboard() {
  const [trusts, setTrusts] = useState([])
  useEffect(() => {
    const fetchTrusts = async () => {
      try {
        const response = await fetch("YOUR_API_URL")
        const data = await response.json()
        setTrusts(data)
      } catch (error) {
        console.error("Error fetching trusts:", error)
      }
    }
    fetchTrusts()
  }, [])
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-full max-w-none bg-white dark:bg-gray-800 shadow-lg rounded-none overflow-hidden">
        <header className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trusts</h1>
        </header>
        <main className="p-6 h-[calc(100vh-60px)]">
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg h-full">
            <h2 className="text-xl font-bold mb-4">Trusts</h2>
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trusts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(row.timestamp * 1000).toLocaleString()}</TableCell>
                      <TableCell>
                        {row.relation === "trustedBy" ? "Incoming" : row.relation === "trusts" ? "Outgoing" : "Mutual"}
                      </TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>
                        {row.relation === "trustedBy" ? "+" : "-"} {row.amount} ETH
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  )
}