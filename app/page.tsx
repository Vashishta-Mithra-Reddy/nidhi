"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import CircularText from "@/components/CircularText";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

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

  const calculateProgress = (amountRaised: number, targetAmount: string) => {
    return (amountRaised / Number.parseFloat(targetAmount)) * 100 < 100
      ? (amountRaised / Number.parseFloat(targetAmount)) * 100
      : 100
  }

  return (
    <div className="px-32 py-28 bg-white transition-all duration-300">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto pb-20 pt-3">
      
      <CircularText
        text="PROJECT*NIDHI*"
        onHover="speedUp"
        spinDuration={20}
        className="custom-class"
      />
        <h1 className="text-[36px] font-bold text-gray-900 pt-20 pb-4">
          Empowering Startups with Decentralized Funding
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Leverage blockchain-powered smart contracts for transparent funding,
          gain token incentives, and connect with expert mentors.
        </p>
        <div className="mt-4 space-x-4 py-12">
          <Link
            href="/campaigns"
            className="px-16 py-6 bg-gray-400 font-bold text-white rounded-2xl hover:bg-gray-600"
          >
            Explore Projects
          </Link>
        </div>
      </section>

      {/* Trending Projects */}
      {/* Trending Projects Section */}
      <section className="w-full mt-12 mb-2">
        <h2 className="text-3xl font-bold mb-6">Trending Projects</h2>
        {1<0 ? (
          <p>Loading trending projects...</p>
        ) : trendingCampaigns.length === 0 ? (
          <p>No trending projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-16">
            {trendingCampaigns.map((campaign) => (
              <Card key={campaign.campaignId} className="max-w-sm w-full overflow-hidden rounded-2xl py-2 px-2">
                <CardContent className="pt-4 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{campaign.title}</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 text-sm border-blue-300 px-3 py-1">
                      Ξ {Number.parseFloat(campaign.amountRaised.toFixed(4)) || "0"}
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
                      <span>Raised: Ξ {Number.parseFloat(campaign.amountRaised.toFixed(4)) || "0"}</span>
                      <span>Target: Ξ {campaign.targetAmount || "0"}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4">
                  <Link className="w-full" href={`/campaigns/${campaign.campaignId}`} passHref>
                    <Button className="w-full bg-blue-400 font-semibold rounded-xl py-6 hover:bg-blue-500">
                      Contribute
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
