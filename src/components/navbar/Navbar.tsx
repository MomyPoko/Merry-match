import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="absolute border-[1px] w-screen h-[88px] flex flex-row justify-around items-center gap-[500px]">
      <Link href="/">
        <span className="text-[40px]">Merry</span>
        <span className="text-[40px]">Match</span>
      </Link>

      <div className="flex gap-[32px]">
        <Link href="/">
          <span>Why Merry Match?</span>
        </Link>

        <Link href="/">
          <span>How to Merry</span>
        </Link>

        <Link href="/auth/login">
          <button className="border-[1px]">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
