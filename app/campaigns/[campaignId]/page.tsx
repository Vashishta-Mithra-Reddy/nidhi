"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import this to track auth changes
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Contribute from "@/components/Contribute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loading from "@/app/loading";

// Type definitions remain the same
interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string;
  amountRaised: number;
  userId: string;
  isActive: boolean;
  createdAt: string;
  transactionHash?: string;
}

interface Reply {
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

interface CommentData {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

interface Contribution {
  contributorName: string;
  amount: number;
  timestamp: string;
}

export default function CampaignDetailsPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser); // Track current user dynamically

  // Forum states
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Contributions states
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [showAllContributions, setShowAllContributions] = useState(false);

  // 1. Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update currentUser when auth state changes
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // 2. Fetch the campaign details
  useEffect(() => {
    if (!campaignId) return;
    const fetchCampaign = async () => {
      try {
        const campaignRef = doc(db, "campaigns", campaignId as string);
        const snapshot = await getDoc(campaignRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as Campaign;
          setCampaign(data);
        } else {
          console.error("No campaign found with ID:", campaignId);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]); // Removed currentUser from dependencies since it’s handled separately

  // 3. Real-time listener for comments subcollection
  useEffect(() => {
    if (!campaignId) return;
    const commentsRef = collection(db, "campaigns", campaignId as string, "comments");

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const updatedComments: CommentData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        updatedComments.push({
          id: docSnap.id,
          authorId: data.authorId,
          authorName: data.authorName,
          text: data.text,
          createdAt: data.createdAt,
          replies: data.replies || [],
        });
      });
      updatedComments.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setComments(updatedComments);
    });

    return () => unsubscribe();
  }, [campaignId]);

  // 4. Real-time listener for contributions
  useEffect(() => {
    if (!campaignId) return;
    const cIdNumber = parseInt(campaignId as string, 10);

    const q = query(
      collection(db, "contributions"),
      where("campaignId", "==", cIdNumber),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const updatedContributions: Contribution[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        updatedContributions.push({
          contributorName: data.contributorName,
          amount: data.amount,
          timestamp: data.timestamp?.toDate()?.toISOString() || "",
        });
      });
      setContributions(updatedContributions);
    });

    return () => unsub();
  }, [campaignId]);

  // 5. Post a new comment
  const handlePostComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    try {
      const commentsRef = collection(db, "campaigns", campaignId as string, "comments");
      await addDoc(commentsRef, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        text: commentText,
        createdAt: new Date().toISOString(),
        replies: [],
      });
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const calculateProgress = (amountRaised: number, targetAmount: string) => {
    return (amountRaised / Number.parseFloat(targetAmount)) * 100 < 100
      ? (amountRaised / Number.parseFloat(targetAmount)) * 100
      : 100;
  };

  // 6. Post a reply to an existing comment
  const handlePostReply = async (commentDocId: string) => {
    if (!replyText.trim() || !currentUser) return;
    try {
      const commentRef = doc(db, "campaigns", campaignId as string, "comments", commentDocId);
      await updateDoc(commentRef, {
        replies: arrayUnion({
          authorId: currentUser.uid,
          authorName: currentUser.displayName || "Creator",
          text: replyText,
          createdAt: new Date().toISOString(),
        }),
      });
      setReplyText("");
      setActiveReplyId(null);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // Loading or no campaign found
  if (loading) {
    return <Loading />;
  }
  if (!campaign) {
    return <div className="p-4 px-32 py-28">Campaign not found.</div>;
  }

  // Check if current user is the campaign owner
  const isOwner = currentUser && currentUser.uid === campaign.userId;

  return (
    <div className="container mx-auto px-32 py-28 transition-all animate-in fade-in duration-700">
      {/* Campaign Details */}
      <Card key={campaign.campaignId} className="max-w-full w-full overflow-hidden rounded-2xl py-2 px-2">
        <CardContent className="pt-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-3xl font-bold pb-2">{campaign.title}</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 text-sm border-blue-300 px-3 py-1">
              Ξ {parseFloat(campaign.amountRaised.toFixed(4)) || "0"}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <p className="line-clamp-2 text-lg pb-2 text-gray-700">{campaign.description}</p>
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
        <CardFooter>
          <Contribute campaignId={campaign.campaignId} />
        </CardFooter>
      </Card>

      {/* Latest Contributions Section */}
      <div className="mt-6 p-6">
        <h3 className="text-2xl font-semibold">Latest Contributions</h3>
        {contributions.length === 0 ? (
          <p className="text-gray-500 py-12">No contributions yet.</p>
        ) : (
          <div className="mt-2 space-y-2 py-8">
            {contributions
              .slice(0, showAllContributions ? contributions.length : 3)
              .map((c, idx) => (
                <div key={idx} className="border-b pb-2">
                  <p className="text-sm">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 text-sm border-blue-300 px-3 py-1">
                      <span className="font-semibold"> {c.amount} ETH</span>
                    </Badge>
                    <span className="pl-1 text-gray-700"> {c.contributorName}</span>
                  </p>
                </div>
              ))}
            {contributions.length > 3 && (
              <button
                onClick={() => setShowAllContributions(!showAllContributions)}
                className="text-gray-600 text-sm mt-1"
              >
                {showAllContributions ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Forum Section */}
      <section className="mt-1 p-6">
        <h2 className="text-2xl font-bold text-black mb-4">Forum</h2>

        {/* New Comment Input (only if logged in) */}
        {currentUser ? (
          <div className="mb-6">
            <Textarea
              placeholder="Ask a question about this project..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button className="mt-2 bg-gray-500 text-sm" onClick={handlePostComment}>
              Post Comment
            </Button>
          </div>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-400 text-sm border-red-200 px-4 py-2 font-semibold mb-4">
              You must be signed in to post comments.
            </Badge>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white py-4 px-2 rounded shadow">
              <p className="text-gray-800 ml-4">
                <span className="font-semibold">{comment.authorName}:</span> {comment.text}
              </p>
              <div className="ml-6 mt-4 space-y-4">
                {comment.replies.map((reply, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-gray-800">
                    <p className="text-gray-700">
                      <span className="font-semibold">{reply.authorName}:</span> {reply.text}
                    </p>
                  </div>
                ))}

                {/* Reply input only if logged in */}
                {currentUser && (
                  <div className="mt-2">
                    {activeReplyId === comment.id ? (
                      <div>
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="mt-2 space-x-2">
                          <Button variant="default" onClick={() => handlePostReply(comment.id)}>
                            Reply
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="text-blue-400"
                        onClick={() => setActiveReplyId(comment.id)}
                      >
                        Reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Textarea component
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full p-3 border border-gray-300 rounded-xl" {...props} />;
}