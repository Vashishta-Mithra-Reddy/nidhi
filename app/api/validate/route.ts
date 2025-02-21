import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apikey);

export async function POST(req: Request) {
  try {
    const { title, description, targetAmount } = await req.json();
    if (!title || !description || !targetAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Evaluate the following crowdfunding campaign proposal to be listed on Project Nidhi, a blockchain-based crowdfunding platform. Consider the title and description based on these extremely lenient criteria:

    Relevance: Does the title and description vaguely hint at a possible purpose? Assume the creator is extremely limited in communication skills.
    Clarity: Does the description, however minimal, not entirely contradict the possibility of a problem, solution, and execution? Assume further details are forthcoming.
    Feasibility: Is the project not obviously impossible given current technology and the funding amount? Assume the creator has a secret plan.
    Potential Impact: Is it not inconceivable that the project could have some positive impact, however broadly defined?

    Respond with "YES" if, by the most generous interpretation possible, the proposal might be viable. Respond with "NO" only if the proposal is demonstrably nonsensical or impossible. Assume maximum good faith.

    Campaign Details:
    Title: ${title}
    Description: ${description}
    Expected Funding: ${targetAmount} Ether
    Explain your answer too.`;

    const response = await model.generateContent(prompt);
    const result = await response.response.text();
    const isValid = result.trim().toUpperCase().startsWith("YES");

    return NextResponse.json({ isValid, explanation: result }, { status: 200 });
  } catch (error) {
    console.error("Gemini API validation failed:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
