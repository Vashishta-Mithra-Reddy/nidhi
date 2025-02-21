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
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type for a campaign document
interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string;  // or number
  amountRaised: number;  // or string
  userId: string;        // campaign owner's UID
  isActive: boolean;
  createdAt: string;     // or a Firestore Timestamp
  transactionHash?: string;
}

// Type for a reply
interface Reply {
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string; // or a Firestore Timestamp
}

// Type for a comment
interface CommentData {
  id: string;       // doc ID
  authorId: string; // UID of the person who asked the question
  authorName: string;
  text: string;
  createdAt: string; // or a Firestore Timestamp
  replies: Reply[];
}



export default function CampaignDetailsPage() {
  const { campaignId } = useParams(); // from the dynamic route
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  // For new comment
  const [commentText, setCommentText] = useState("");
  // For replying
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const currentUser = auth.currentUser; // might be null if not logged in

  // 1. Fetch the campaign details
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
  }, [campaignId]);

  // 2. Real-time listener for comments subcollection
  useEffect(() => {
    if (!campaignId) return;
    const commentsRef = collection(db, "campaigns", campaignId as string, "comments");

    // Listen to changes in the "comments" subcollection
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
          replies: data.replies || []
        });
      });
      // Sort by creation time if needed
      updatedComments.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setComments(updatedComments);
    });

    return () => unsubscribe();
  }, [campaignId]);

  // 3. Post a new comment
  const handlePostComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    try {
      const commentsRef = collection(db, "campaigns", campaignId as string, "comments");
      await addDoc(commentsRef, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        text: commentText,
        createdAt: new Date().toISOString(),
        replies: []
      });
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // 4. Post a reply to an existing comment
  const handlePostReply = async (commentDocId: string) => {
    if (!replyText.trim() || !currentUser) return;
    try {
      const commentRef = doc(db, "campaigns", campaignId as string, "comments", commentDocId);
      // We'll push a new reply object into the "replies" array
      await updateDoc(commentRef, {
        replies: arrayUnion({
          authorId: currentUser.uid,
          authorName: currentUser.displayName || "Creator",
          text: replyText,
          createdAt: new Date().toISOString()
        })
      });
      setReplyText("");
      setActiveReplyId(null);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // If still loading or no campaign found
  if (loading) {
    return <div className="p-4">Loading campaign...</div>;
  }
  if (!campaign) {
    return <div className="p-4">Campaign not found.</div>;
  }

  // Check if current user is the campaign owner
  const isOwner = currentUser && currentUser.uid === campaign.userId;

  return (
    <div className="container mx-auto px-32 py-28">
      {/* Campaign Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* If you have a campaign image field, display it here */}
        {/* Example: <Image src={campaign.imageUrl} alt={campaign.title} ... /> */}

        <h1 className="text-3xl font-bold mt-4">{campaign.title}</h1>
        <p className="mt-2 text-gray-700">{campaign.description}</p>
        <div className="mt-4 flex space-x-8">
          <div>
            <span className="font-semibold">Target Amount:</span> {campaign.targetAmount} ETH
          </div>
          <div>
            <span className="font-semibold">Amount Raised:</span> {parseFloat(campaign.amountRaised.toFixed(4))} ETH
          </div>
        </div>
      </div>

      {/* Forum Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Forum</h2>

        {/* New Comment Input (only if logged in) */}
        {currentUser ? (
          <div className="mb-6">
            <Textarea
              placeholder="Ask a question about this project..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button className="mt-2" onClick={handlePostComment}>
              Post Comment
            </Button>
          </div>
        ) : (
          <p className="mb-6 text-red-500">
            You must be signed in to post comments.
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded shadow">
              <p className="text-gray-800">
                <span className="font-semibold">{comment.authorName}:</span> {comment.text}
              </p>
              <div className="text-sm text-gray-500">
                Posted on {new Date(comment.createdAt).toLocaleString()}
              </div>

              {/* Replies */}
              <div className="ml-6 mt-4 space-y-4">
                {comment.replies.map((reply, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded border-l-4 border-blue-600"
                  >
                    <p className="text-gray-700">
                      <span className="font-semibold">{reply.authorName}:</span> {reply.text}
                    </p>
                    <div className="text-sm text-gray-500">
                      Replied on {new Date(reply.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}

                {/* If the user is the campaign owner, allow replying */}
                {isOwner && (
                  <div className="mt-2">
                    {activeReplyId === comment.id ? (
                      <div>
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="mt-2 space-x-2">
                          <Button
                            variant="default"
                            onClick={() => handlePostReply(comment.id)}
                          >
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
                        className="text-blue-600 hover:underline"
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

// A basic Textarea component if you don't already have one
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full p-3 border border-gray-300 rounded"
      {...props}
    />
  );
}
