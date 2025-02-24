"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import toast from "react-hot-toast";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { OtpComponent } from "@/components/OtpHandler";
import Loading from "../loading";
import { useRouter } from "next/navigation"; 

const ProfilePage = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<{ type: "close"; campaignId: string } | null>(null);
  const { user } = useAuth();
  const router = useRouter(); 

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
  const abi = [
    {
      inputs: [
        { internalType: "string", name: "_title", type: "string" },
        { internalType: "string", name: "_description", type: "string" },
        { internalType: "uint256", name: "_targetAmount", type: "uint256" },
      ],
      name: "createListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_listingId", type: "uint256" }],
      name: "closeListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      try {
        if (!user) return;

        const userId = user.uid;
        const q = query(collection(db, "campaigns"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const userCampaigns = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCampaigns(userCampaigns.reverse());
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to fetch campaigns.");
      }
    };

    fetchUserCampaigns();
  }, [user]);

  const handleCampaignClose = async (campaignId: string) => {
    setCurrentAction({ type: "close", campaignId });
    setShowOtpModal(true);
  };

  const performActionAfterOtpVerification = async () => {
    if (!currentAction) return;

    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("Metamask is not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.closeListing(currentAction.campaignId);
      await tx.wait();

      const campaignRef = doc(db, "campaigns", currentAction.campaignId);
      await updateDoc(campaignRef, {
        isActive: false,
      });

      toast.success("Campaign closed successfully.");
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === currentAction.campaignId ? { ...campaign, isActive: false } : campaign
        )
      );
    } catch (error: any) {
      console.error("Error closing campaign:", error);
      toast.error(`Failed to close campaign: ${error.message}`);
    } finally {
      setLoading(false);
      setShowOtpModal(false);
      setCurrentAction(null);
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setCurrentAction(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const calculateProgress = (amountRaised: number, targetAmount: number) => {
    return ((amountRaised / targetAmount) * 100) < 100 ? (amountRaised / targetAmount) * 100 : 100;
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen text-black p-6 mt-10 wrapper px-32 py-28">
      <h1 className="text-4xl font-bold mb-12">Your Campaigns</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="max-w-sm w-full overflow-hidden rounded-2xl py-2 px-2 cursor-pointer" // Add cursor-pointer
            onClick={() => router.push(`/campaigns/${campaign.id}`)} // Navigate on card click
          >
            {/* Uncomment if you want to include the image */}
            {/* <div className="relative h-16">
              <img
                src={campaign.image || "/placeholder-campaign.jpg"}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              <Badge 
                className={`absolute top-3 right-3 ${
                  campaign.isActive ? 'bg-green-300' : 'bg-gray-500'
                } text-white text-sm font-bold px-2 py-1`}
              >
                {campaign.isActive ? 'Active' : 'Closed'}
              </Badge>
            </div> */}

            <CardContent className="pt-4 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{campaign.title}</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 text-sm border-blue-300 px-3 py-1">
                  Ξ {parseFloat(campaign.amountRaised.toFixed(4)) || "0"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p className="line-clamp-2">{campaign.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculateProgress(campaign.amountRaised, campaign.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Raised: Ξ {parseFloat(campaign.amountRaised.toFixed(4)) || "0"}</span>
                  <span>Target: Ξ {campaign.targetAmount || "0"}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4">
              {campaign.isActive && (
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card navigation
                    handleCampaignClose(campaign.id);
                  }}
                  className="w-full bg-red-400 font-semibold rounded-xl py-6"
                >
                  Close Campaign
                </Button>
              )}
              {!campaign.isActive && (
                <Button
                  disabled
                  className="w-full bg-gray-400 font-semibold rounded-xl py-6 hover:bg-gray-500/80"
                >
                  Campaign Closed
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <p className="text-center text-gray-500">You have no active campaigns.</p>
        )}
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <OtpComponent
            email={auth.currentUser?.email || ""}
            onVerified={performActionAfterOtpVerification}
            onClose={closeOtpModal}
            className="rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;