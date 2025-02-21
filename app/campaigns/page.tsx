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
  targetAmount: string;  // or number, depending on your storage
  amountRaised: number;  // or string
  userId: string;        // Owner's UID
  isActive: boolean;
  createdAt: string;     // ISO string or a Firestore Timestamp (if string, then ISO format)
  transactionHash?: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New states for search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "mostFunded" | "leastFunded">("newest");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "campaigns"));
        const fetched: Campaign[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          fetched.push(doc.data() as Campaign);
        });
        setCampaigns(fetched);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns by search term (case-insensitive)
  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort the filtered campaigns based on selected option
  let sortedCampaigns = [...filteredCampaigns];
  if (sortOption === "newest") {
    sortedCampaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortOption === "oldest") {
    sortedCampaigns.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortOption === "mostFunded") {
    sortedCampaigns.sort((a, b) => b.amountRaised - a.amountRaised);
  } else if (sortOption === "leastFunded") {
    sortedCampaigns.sort((a, b) => a.amountRaised - b.amountRaised);
  }

  if (loading) {
    return <div className="p-4">Loading campaigns...</div>;
  }

  return (
    <div className="px-28 py-28 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Campaigns</h1>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 ">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full md:w-1/4"
        />
        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as "newest" | "oldest" | "mostFunded" | "leastFunded")
          }
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostFunded">Most Funded</option>
          <option value="leastFunded">Least Funded</option>
        </select>
      </div>

      {sortedCampaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCampaigns.map((campaign) => (
            <Link
              key={campaign.campaignId}
              href={`/campaigns/${campaign.campaignId}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 block"
            >
              <h2 className="text-xl font-bold text-gray-800">{campaign.title}</h2>
              <p className="text-gray-600 mt-2">{campaign.description}</p>
              <div className="mt-4 text-gray-700">
                <div>
                  <span className="font-semibold">Target Amount:</span> {campaign.targetAmount} ETH
                </div>
                <div>
                  <span className="font-semibold">Amount Raised:</span> {campaign.amountRaised} ETH
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
