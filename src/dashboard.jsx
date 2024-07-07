"use client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function Dashboard({ avatarInfo }) {
  const location = useLocation();
  const [trustRelations, setTrustRelations] = useState([]);

  useEffect(() => {
    if (location.state && location.state.trustRelations) {
      setTrustRelations(location.state.trustRelations);
    }
  }, [location.state]);

//   const handleRemoveTrust = async (address) => {
//     try {
//       if (!avatarInfo) {
//         throw new Error("Avatar not found");
//       }
//       await avatarInfo.untrust(address);
//       setTrustRelations(trustRelations.filter((rel) => rel.objectAvatar !== address));
//     } catch (error) {
//       console.error("Error removing trust:", error);
//     }
//   };

//   const handleAddTrust = async (address) => {
//     try {
//       if (!avatarInfo) {
//         throw new Error("Avatar not found");
//       }
//       await avatarInfo.trust(address);
//       setTrustRelations([...trustRelations, { objectAvatar: address, relation: "trusts", timestamp: Math.floor(Date.now() / 1000) }]);
//     } catch (error) {
//       console.error("Error adding trust:", error);
//     }
//   };

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
                    {trustRelations.map((row, index) => {
                      const date = new Date(row.timestamp * 1000);
                      const isIncoming = row.relation === "trustedBy";
                      const isOutgoing = row.relation === "trusts";
                      const isMutual = row.relation === "mutuallyTrusts";
                      return (
                        <TableRow key={index}>
                          <TableCell>{date.toLocaleString()}</TableCell>
                          <TableCell>
                            {isMutual ? "Mutually Trusted" : isIncoming ? "Incoming Trust" : "Outgoing Trust"}
                          </TableCell>
                          <TableCell>{row.objectAvatar}</TableCell>
                          <TableCell>
                            {isOutgoing || isMutual ? (
                              <Button onClick={() => handleRemoveTrust(row.objectAvatar)}>
                                Remove Trust
                              </Button>
                            ) : (
                              <Button onClick={() => handleAddTrust(row.objectAvatar)}>
                                Add Trust
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
