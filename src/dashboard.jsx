"use client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function Dashboard() {
  const location = useLocation();
  const [trustRelations, setTrustRelations] = useState([]);

  useEffect(() => {
    if (location.state && location.state.trustRelations) {
      setTrustRelations(location.state.trustRelations);
    }
  }, [location.state]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-full max-w-none bg-white dark:bg-gray-800 shadow-lg rounded-none overflow-hidden">
        <header className="bg-gray-950 text-white px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trusts</h1>
        </header>
        <main className="p-6 h-[calc(100vh-60px)]">
          <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg h-full">
            {console.log(trustRelations)}
            {trustRelations.length === 0 ? (
              <p>No trust relations found!</p>
            ) : (
              <ScrollArea className="h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Relation</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Add/Remove Trust</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trustRelations.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(row.timestamp * 1000).toLocaleString()}</TableCell>
                        <TableCell>{row.relations}</TableCell>
                        <TableCell>{row.objectAvatar}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
