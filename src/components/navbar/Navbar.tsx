"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { IoIosCube } from "react-icons/io";
import { FaTriangleExclamation } from "react-icons/fa6";
import { AiFillHeart } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface MatchingRequest {
  id: string;
  username: string;
  name: string;
  image: { url: string; publicId: string }[];
  status?: "pending" | "matched" | "rejected";
}

interface MatchingData {
  id: string;
  requesterUser: MatchingRequest;
  receiverUser: MatchingRequest[];
}

const Navbar = ({ session }: { session: Session | null }) => {
  const [matchingData, setMatchingData] = useState<MatchingData[]>([]);
  const [selectedUser, setSelectedUser] = useState<MatchingRequest | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { data: clientSession, status } = useSession();
  const swiperRef = useRef<any>(null);
  const router = useRouter();

  const userImage = clientSession?.user?.image?.[0]?.url;
  const userName = clientSession?.user?.name;

  const getMatchingData = async () => {
    try {
      const response = await axios.get("/api/matching/index");
      setMatchingData(response.data.receivedRequests);

      console.log("Matching user data fetch: ", response.data);
    } catch (error) {
      console.log("Error fetching matching: ", error);
    }
  };

  const handleShowModal = (user: MatchingRequest) => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    setSelectedUser(user);
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal not found!");
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getMatchingData(); // เรียก API เฉพาะเมื่อผู้ใช้ล็อกอินแล้ว
    }

    if (status === "loading") {
      // หากยังโหลดอยู่ ไม่ต้องทำอะไร
      return;
    }
  }, [status]);

  return (
    <div className="sticky top-0 z-50 px-[200px] border-[1px] w-full h-[88px] bg-white flex flex-row justify-between items-center shadow-md">
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
              router.push("/package");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Merry Membership
          </button>

          <div className="flex items-center gap-[12px]">
            {matchingData && (
              <div className="dropdown">
                <button className="p-[10px] bg-gray-100 rounded-[100%]">
                  <FaBell className="text-[20px] text-red-200" />
                </button>
                <div
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[250px] p-2 shadow"
                >
                  {matchingData.length > 0 ? (
                    <div className="carousel carousel-vertical rounded-box h-[222px]">
                      {matchingData.map((invitation, index_invitation) => {
                        const requesterStatus = invitation.receiverUser.find(
                          (user) => user.id === clientSession?.user?.id
                        )?.status;

                        return (
                          <button
                            key={index_invitation}
                            className="carousel-item px-[14px] py-[12px] w-full border-b-[1px] flex items-start gap-[10px] hover:bg-gray-100"
                            onClick={() =>
                              handleShowModal(invitation.requesterUser)
                            }
                          >
                            <span className="w-[40px] h-[40px] relative">
                              <img
                                src={invitation.requesterUser.image[0].url}
                                className="absolute w-[40px] h-[40px] rounded-[100%]"
                              />
                              {requesterStatus === "pending" ? (
                                <img
                                  src="/images/icon-oneheart.png"
                                  className="absolute right-0 bottom-0 w-[10px] h-[10px]"
                                  alt="Pending"
                                />
                              ) : requesterStatus === "matched" ? (
                                <img
                                  src="/images/icon-doubleheart.png"
                                  className="absolute right-0 bottom-0 w-[20px] h-[10px]"
                                  alt="Matched"
                                />
                              ) : null}
                            </span>
                            {requesterStatus === "pending" ? (
                              <span className="text-left flex flex-col justify-start">
                                <div>
                                  '{invitation.requesterUser.name}' Just Merry
                                  you`
                                </div>
                                <div>Click here to see profile</div>
                              </span>
                            ) : requesterStatus === "matched" ? (
                              <span className="text-left flex flex-col justify-start">
                                <div>
                                  '{invitation.requesterUser.name}' Merry you
                                  back`
                                </div>
                                <div>Let’s start conversation now</div>
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div>empty!</div>
                  )}
                </div>
              </div>
            )}

            {selectedUser && (
              <dialog id="my_modal_3" className="modal">
                <div
                  className="modal-box"
                  style={{ width: "1000px", maxWidth: "100%", height: "650px" }}
                >
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <div className="bg-red-800 w-full h-full flex justify-between">
                    <Swiper
                      slidesPerView={1.75}
                      centeredSlides={true}
                      ref={swiperRef}
                      className="bg-red-300 w-full h-full overflow-hidden"
                    >
                      <SwiperSlide>
                        <div>
                          {selectedUser.image.map((image, index_image) => (
                            <img key={index_image} src={image.url} />
                          ))}
                        </div>
                      </SwiperSlide>
                    </Swiper>
                    <div className="text-white">
                      <div>
                        <div>
                          <span>{selectedUser.name}</span>
                          <span>24</span>
                        </div>
                        <div>
                          <img src="" alt="" />
                          <span>
                            {selectedUser.state},{selectedUser.country}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <span>Sexual identities</span>
                          <span>{selectedUser.sexIdent}</span>
                        </div>
                        <div>
                          <span>Sexual preferences</span>
                          <span>{selectedUser.sexPref}</span>
                        </div>
                        <div>
                          <span>Racial preferences</span>
                          <span></span>
                        </div>
                        <div>
                          <span>Meeting interests</span>
                          <span>{selectedUser.meeting}</span>
                        </div>
                      </div>
                      <div>
                        <div>hobies and interest</div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </dialog>
            )}

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
