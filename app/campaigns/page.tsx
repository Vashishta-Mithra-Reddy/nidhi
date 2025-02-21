"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// TypeScript interface for a campaign
interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string;  // or number, depending on how you store it
  amountRaised: number;  // or string
  userId: string;        // Owner's UID
  isActive: boolean;
  createdAt: string;     // or a Firestore Timestamp
  transactionHash?: string;
}

// A simple listing page that fetches campaigns from Firestore and displays them
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "campaigns"));
        const fetched: Campaign[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          fetched.push(doc.data() as Campaign);
        });
        // Sort campaigns by newest first, if desired
        fetched.sort((a, b) => b.campaignId - a.campaignId);
        setCampaigns(fetched);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="p-4">Loading campaigns...</div>;
  }

  return (
    <div className="px-32 py-32 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-16">Explore Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.campaignId}
              href={`/campaigns/${campaign.campaignId}`}
              className="bg-white px-8 py-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 block"
            >
              <h2 className="text-xl font-bold text-gray-800">{campaign.title}</h2>
              <p className="text-gray-500 mt-2">{campaign.description}</p>
              <div className="mt-4 text-gray-400">
                <div>
                  <span className="font-semibold">Target Amount:</span> <span className="text-gray-800">{campaign.targetAmount} Ξ</span>
                </div>
                <div>
                  <span className="font-semibold">Amount Raised:</span> <span className="text-gray-800">{parseFloat(campaign.amountRaised.toFixed(4))} Ξ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
