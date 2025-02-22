"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import CircularText from "@/components/CircularText";

// Define a TypeScript interface for a campaign
interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string; // or number
  amountRaised: number; // or string
  isActive: boolean;
  // other fields as needed...
}

export default function Home() {
  const [trendingCampaigns, setTrendingCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCampaigns = async () => {
      try {
        // Query for active campaigns ordered by amountRaised (descending)
        const q = query(
          collection(db, "campaigns"),
          where("isActive", "==", true),
          orderBy("amountRaised", "desc"),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const campaigns: Campaign[] = [];
        snapshot.forEach((doc) => {
          campaigns.push(doc.data() as Campaign);
        });
        setTrendingCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching trending campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCampaigns();
  }, []);

  return (
    <div className="px-32 py-28 bg-white transition-all duration-300">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pb-20">
      <CircularText
        text="PROJECT*NIDHI*"
        onHover="speedUp"
        spinDuration={20}
        className="custom-class"
      />
        <h1 className="text-4xl font-bold text-gray-900 pt-20 pb-4">
          Empowering Startups with Decentralized Funding
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Leverage blockchain-powered smart contracts for transparent funding,
          gain token incentives, and connect with expert mentors.
        </p>
        <div className="mt-4 space-x-4 py-12">
          <Link
            href="/campaigns"
            className="px-8 py-6 bg-gray-400 font-bold text-white rounded-2xl hover:bg-gray-600"
          >
            Explore Projects
          </Link>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="mt-12 max-w-5xl mx-auto py-12">
        <h2 className="text-4xl font-bold text-gray-900 py-4">Trending Projects</h2>
        {loading ? (
          <p>Loading trending projects...</p>
        ) : trendingCampaigns.length === 0 ? (
          <p>No trending projects found.</p>
        ) : (
          <div className="mt-6 grid md:grid-cols-3 gap-6 ">
            {trendingCampaigns.map((campaign) => (
              <Link
                key={campaign.campaignId}
                href={`/campaigns/${campaign.campaignId}`}
                className="bg-white px-8 py-6 rounded-xl shadow hover:shadow-lg "
              >
                <h3 className="text-lg font-semibold text-gray-900 py-2">
                  {campaign.title}
                </h3>
                <p className="text-gray-400">{campaign.description}</p>
                <div className="mt-4 text-gray-700">
                  <div>
                    <span className="font-semibold text-gray-400">Target Amount:</span> {campaign.targetAmount} ETH
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
