"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// TypeScript interface for a campaign
interface Campaign {
  campaignId: number
  title: string
  description: string
  targetAmount: string
  amountRaised: number
  userId: string
  isActive: boolean
  createdAt: string
  transactionHash?: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "mostFunded" | "leastFunded">("newest")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "campaigns"))
        const fetched: Campaign[] = []
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          fetched.push(doc.data() as Campaign)
        })
        fetched.sort((a, b) => b.campaignId - a.campaignId)
        setCampaigns(fetched)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const sortedCampaigns = [...filteredCampaigns]
  if (sortOption === "newest") {
    sortedCampaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortOption === "oldest") {
    sortedCampaigns.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (sortOption === "mostFunded") {
    sortedCampaigns.sort((a, b) => b.amountRaised - a.amountRaised)
  } else if (sortOption === "leastFunded") {
    sortedCampaigns.sort((a, b) => a.amountRaised - b.amountRaised)
  }

  const calculateProgress = (amountRaised: number, targetAmount: string) => {
    return (amountRaised / Number.parseFloat(targetAmount)) * 100 < 100
      ? (amountRaised / Number.parseFloat(targetAmount)) * 100
      : 100
  }

  return (
    <div className="flex flex-col items-start justify-start min-h-screen text-black p-6 mt-10 wrapper px-32 py-28">
      <h1 className="text-4xl font-bold mb-12">Explore Campaigns</h1>

      <div className="mb-12 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 w-full px-1">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-xl py-3 px-5 w-full md:w-1/4"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "newest" | "oldest" | "mostFunded" | "leastFunded")}
          className="p-2 border border-gray-300 rounded-lg py-3 px-5 cursor-pointer"
        >
          <option value="newest" className="hover:cursor-pointer">Newest</option>
          <option value="oldest" className="hover:cursor-pointer">Oldest</option>
          <option value="mostFunded" className="hover:cursor-pointer">Most Funded</option>
          <option value="leastFunded" className="hover:cursor-pointer">Least Funded</option>
        </select>
      </div>

      {sortedCampaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full place-items-center">
          {sortedCampaigns.map((campaign) => (
            <Card
              key={campaign.campaignId}
              className={`max-w-sm w-full overflow-hidden rounded-2xl py-2 px-2 ${!campaign.isActive ? "opacity-50" : ""}`}
            >
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
                {campaign.isActive ? (
                  <Link className="w-full" href={`/campaigns/${campaign.campaignId}`} passHref>
                    <Button className="w-full bg-blue-400 font-semibold rounded-xl py-6 hover:bg-blue-500">
                      Contribute
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-500 font-semibold rounded-xl py-6">
                    Campaign Closed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

