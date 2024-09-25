import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed z-10 border-[1px] w-full h-[88px] bg-white flex flex-row justify-around items-center gap-[500px]">
      <Link href="/">
        <img src="/images/logo.png" alt="logo" className="w-[220px]" />
      </Link>

      <div className="flex items-center gap-[32px]">
        <Link
          href="/#Why-Merry-Match"
          className="text-purple-800 text-[16px] font-[700]"
        >
          <span>Why Merry Match?</span>
        </Link>

        <Link
          href="/#How-to-Merry"
          className="text-purple-800 text-[16px] font-[700]"
        >
          <span>How to Merry</span>
        </Link>

        <Link href="/auth/login">
          <button className="p-[12px_24px_12px_24px] text-white text-[16px] font-[700] rounded-[99px] bg-red-500 active:scale-95">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
