"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { IoIosCube } from "react-icons/io";
import { FaTriangleExclamation } from "react-icons/fa6";
import { AiFillHeart } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa6";

const Navbar = ({ session }: { session: Session | null }) => {
  const { data: clientSession, status } = useSession();
  const router = useRouter();

  const userImage = clientSession?.user?.image?.[0]?.url;
  const userName = clientSession?.user?.name;

  useEffect(() => {
    if (status === "loading") {
      // หากยังโหลดอยู่ ไม่ต้องทำอะไร
      return;
    }

    if (!session) {
      // ถ้าไม่มี session
      if (status === "authenticated") {
        router.push("/"); // ผู้ใช้ล็อกอินแล้ว ให้ไปหน้าโฮม
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
          <button
            onClick={() => {
              router.push("/matching");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Start Matching!
          </button>

          <button
            onClick={() => {
              router.push("/matching");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Merry Membership
          </button>

          <div className="flex items-center gap-[12px]">
            <div className="dropdown">
              <button className="p-[10px] bg-gray-100 rounded-[100%]">
                <FaBell className="text-[20px] text-red-200" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>

            <div className="dropdown dropdown-end">
              {userImage ? (
                <Avatar
                  alt={userName || undefined}
                  src={userImage}
                  className="cursor-pointer"
                  tabIndex={0}
                />
              ) : null}

              {/* Drop down */}
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a href="/profile">
                    <BsPeopleFill className="text-red-100" /> Profile
                  </a>
                </li>
                <li>
                  <a href="/settings">
                    <AiFillHeart className="text-red-100" /> Merry List
                  </a>
                </li>
                <li>
                  <a href="/profile">
                    <IoIosCube className="text-red-100" /> Merry Memberhip
                  </a>
                </li>
                <li>
                  <a href="/settings">
                    <FaTriangleExclamation className="text-red-100" /> Compliant
                  </a>
                </li>
                <hr className="w-full border-[1px]" />
                <li>
                  <button onClick={() => signOut()}>
                    <IoIosLogOut className="text-[15px]" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
