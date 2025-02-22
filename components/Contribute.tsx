"use client";

import { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { db,auth } from "@/lib/firebase";
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ContributeProps {
  campaignId: number;
}

const contractABI = [
  {
    inputs: [{ internalType: "uint256", name: "_listingId", type: "uint256" }],
    name: "fundListing",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export default function Contribute({ campaignId }: ContributeProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  const handleContribute = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid contribution amount.");
      return;
    }

    try {
      setLoading(true);
      if (!window.ethereum) throw new Error("MetaMask is not installed.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress(); // Get contributor's wallet address

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.fundListing(campaignId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();

      const campaignRef = doc(db, "campaigns", campaignId.toString());
      const campaignSnap = await getDoc(campaignRef);

      if (campaignSnap.exists()) {
        const currentAmountRaised = campaignSnap.data().amountRaised || 0;
        const newAmountRaised = currentAmountRaised + Number(amount);

        await updateDoc(campaignRef, { amountRaised: newAmountRaised });

        // ✅ Save the contribution to Firestore
        await addDoc(collection(db, "contributions"), {
          campaignId,
          contributorName: currentUser?.displayName || userAddress, // Can later be replaced with ENS name if needed
          amount: Number(amount),
          timestamp: serverTimestamp(),
        });

        toast.success("Contribution successful! Amount updated.");
      } else {
        console.error("Campaign not found in Firestore.");
        toast.error("Campaign not found in Firestore.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Transaction failed.");
    } finally {
      setLoading(false);
      setAmount("");
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
        className="border p-2 rounded"
      />
      <button
        onClick={handleContribute}
        disabled={loading}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        {loading ? "Contributing..." : "Contribute"}
      </button>
    </div>
  );
}
