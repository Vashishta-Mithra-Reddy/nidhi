import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-20 py-16 bg-white">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-20">
        <h1 className="text-4xl font-bold text-gray-900 py-10">Empowering Student Startups with Decentralized Funding</h1>
        <p className="mt-8 text-lg text-gray-700">Leverage blockchain-powered smart contracts for transparent funding, gain token incentives, and connect with expert mentors.</p>
        <div className="mt-4 space-x-4 py-12">
          <Link href="/campaigns" className="px-8 py-3 bg-gray-400 font-bold text-white rounded-lg hover:bg-gray-600">Explore Projects</Link>
        </div>
      </section>

      {/* Key Benefits */}
        <h1 className="text-left max-w-5xl mx-auto text-4xl font-bold text-gray-900">Why Us?</h1>
      <section className="mt-6 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto ">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Transparent Funding</h3>
          <p className="text-gray-700 mt-2">Smart contracts ensure secure and transparent transactions.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Token Incentives</h3>
          <p className="text-gray-700 mt-2">Earn rewards and engage investors through blockchain tokens.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">AI Verification</h3>
          <p className="text-gray-700 mt-2">AI-driven project authentication ensures credibility.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Mentorship Hub</h3>
          <p className="text-gray-700 mt-2">Connect with industry experts and grow your startup.</p>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="mt-16 max-w-5xl mx-auto py-12">
        <h2 className="text-4xl font-bold text-gray-900">Trending Projects</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900">Project Alpha</h4>
            <p className="text-gray-700">A decentralized marketplace for student entrepreneurs.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900">EduChain</h4>
            <p className="text-gray-700">Blockchain-powered academic credential verification.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900">FundFlow</h4>
            <p className="text-gray-700">Secure and transparent crowdfunding for student-led startups.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
