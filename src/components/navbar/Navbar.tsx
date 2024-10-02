"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = ({ session }: { session: any }) => {
  const { data: clientSession, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status === "authenticated") {
      router.push("/");
      if (!session && status === "unauthenticated") {
        router.push("/auth/login"); // redirect เมื่อ token หมด
      }
    }
  }, [status, session, router]);

  console.log("Session status: ", status, "Session data: ", clientSession);
  return (
    <div className="fixed z-10 border-[1px] w-full h-[88px] bg-white flex flex-row justify-around items-center gap-[500px]">
      <Link href="/">
        <img src="/images/logo.png" alt="logo" className="w-[220px]" />
      </Link>

      {!clientSession ? (
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

          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className="p-[12px_24px_12px_24px] text-white text-[16px] font-[700] rounded-[99px] bg-red-500 active:scale-95"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-[32px]">
          <span
            onClick={() => {
              router.push("/matching");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Start Matching!
          </span>

          <span
            onClick={() => {
              router.push("/matching");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Merry Membership
          </span>

          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
