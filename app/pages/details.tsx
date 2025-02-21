import Link from "next/link";

const projects = [
  { id: 1, name: "Project Alpha", description: "A decentralized AI startup.", owner: "Alice" },
  { id: 2, name: "Project Beta", description: "Blockchain-based crowdfunding.", owner: "Bob" },
  { id: 3, name: "Project Gamma", description: "AI-powered healthcare analytics.", owner: "Charlie" }
];

export default function ExploreProjects() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Link href="/"><a className="text-blue-500 underline">Back to Home</a></Link>
      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="p-6 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <p className="text-gray-500 mt-1">By {project.owner}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
