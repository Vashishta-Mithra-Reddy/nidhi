import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-6 text-center text-white px-24">
      <div className="h-52 rounded-3xl w-full px-12 py-5 flex items-center justify-between bg-gray-400/60 bg-[url('/gradientx.png')] bg-left-bottom">
      <Link href={"/"}>
      <p className="font-samarkan text-left text-8xl text-white">nidhi</p>
      </Link>
      <p className="text-white text-lg">© 2025 <span className="font-samarkan">nidhi</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
