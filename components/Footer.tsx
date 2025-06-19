import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-6 text-center text-white px-0 md:px-24 pb-16 md:pb-6">
      <div className="h-52 rounded-none md:rounded-3xl w-full px-12 py-5 flex flex-col md:flex-row items-center justify-center md:justify-between bg-gray-400/60 bg-[url('/gradientx.png')] bg-left-bottom">
      <Link href={"/"}>
      <p className="font-samarkan text-left  text-6xl md:text-8xl text-white">nidhi</p>
      </Link>
      <p className="text-white text-md mx:text-lg pt-4 md:pt-0">© 2025 <span className="font-samarkan">nidhi</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
