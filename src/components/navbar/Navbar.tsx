"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // ถ้าไม่มี session ให้ redirect ไปหน้า login
      router.push("/auth/login");
    }
  }, [status, router]);

  console.log("Session status: ", status, "Session data: ", session);
  return (
    <div className="fixed z-10 border-[1px] w-full h-[88px] bg-white flex flex-row justify-around items-center gap-[500px]">
      <Link href="/">
        <img src="/images/logo.png" alt="logo" className="w-[220px]" />
      </Link>

      {!session ? (
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
      ) : (
        <div className="flex items-center gap-[32px]">
          <Link
            href="/#Why-Merry-Match"
            className="text-purple-800 text-[16px] font-[700]"
          >
            <span>Start Matching!</span>
          </Link>

          <Link
            href="/#How-to-Merry"
            className="text-purple-800 text-[16px] font-[700]"
          >
            <span>Merry Membership</span>
          </Link>

          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
