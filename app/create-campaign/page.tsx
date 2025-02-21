"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { useRouter } from "next/navigation"
import { db, auth } from "@/lib/firebase"
import { doc, setDoc, runTransaction } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

const CreateCampaign = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const contractAddress = "0x0C3DDeE094caEa602D06F559fC855b6FB7f59c6F"
  const abi = [
    {
      inputs: [
        { internalType: "string", name: "_title", type: "string" },
        { internalType: "string", name: "_description", type: "string" },
        { internalType: "uint256", name: "_targetAmount", type: "uint256" }
      ],
      name: "createListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        toast.error("User is not authenticated")
        return
      }

      if (!window.ethereum) throw new Error("Metamask is not installed")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(contractAddress, abi, signer)
      const tx = await contract.createListing(title, description, ethers.parseEther(targetAmount))
      await tx.wait()

      // Firestore transaction
      const campaignCounterRef = doc(db, "campaign_counter", "counter")
      await runTransaction(db, async (transaction) => {
        const campaignCounterDoc = await transaction.get(campaignCounterRef)
        if (!campaignCounterDoc.exists()) throw new Error("Campaign counter document does not exist")

        const campaignId = campaignCounterDoc.data().campaign_id + 1
        transaction.update(campaignCounterRef, { campaign_id: campaignId })

        await transaction.set(doc(db, "campaigns", campaignId.toString()), {
          campaignId,
          title,
          description,
          targetAmount,
          amountRaised: 0,
          creator: await signer.getAddress(),
          isActive: true,
          createdAt: new Date().toISOString(),
          transactionHash: tx.hash,
          userId: user.uid,
        })
      })

      toast.success("Campaign created successfully!")
      router.push("/campaigns")
    } catch (err: any) {
      console.error(err)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto mt-40 mb-32 rounded-2xl py-5 px-4">
      <CardHeader>
        <CardTitle className="text-2xl">Create Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} className="py-5" onChange={(e) => setTitle(e.target.value)} placeholder="Enter campaign title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} className="py-5" onChange={(e) => setDescription(e.target.value)} placeholder="Enter campaign description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (ETH)</Label>
            <Input id="targetAmount" type="number" className="py-5" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Enter target amount in ETH" required />
          </div>
          <Button type="submit" className="w-full py-6 rounded-xl" disabled={loading}>
            {loading ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateCampaign
