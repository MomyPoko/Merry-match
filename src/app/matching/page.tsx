"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "swiper/swiper-bundle.css";

const MatchingPage = () => {
  const [matchingId, setMatchingId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [matchingStatus, setMatchingStatus] = useState("pending");
  const [sexPref, setSexpref] = useState<string | null>(null);
  const [dateOfBirth, setDateofbirth] = useState<string | null>(null);

  const createMatching = async () => {
    try {
      const response = await axios.post("/api/matching", {
        requesterUser: { id: "requester_id" },
        receiverUser: { id: "receiver_id" },
      });
      setMatchingId(response.data.matching_data._id);
      console.log("Mtaching created: ", response);
    } catch (error) {
      console.log("Error creating matching: ", error);
    }
  };

  const updateMatching = async (status: "matched" | "rejected") => {
    try {
      const response = await axios.put(`api/matching/${matchingId}`, {
        updateStatus: status,
      });
      setMatchingStatus(status);
      console.log("Matching status update: ", response.data);
    } catch (error) {}
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("/api/users/index", {
        params: { sexPref, dateOfBirth },
      });
      setUserData(response.data);
      console.log("Users data fetched: ", response.data);
    } catch (error) {
      console.log("Error fetching users data: ", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [sexPref, dateOfBirth]);

  return (
    <div className="w-screen h-screen flex">
      {userData && (
        <>
          <div className="pt-[88px] w-[20%] h-screen bg-gray-100">
            <div className="w-[100%] h-[259px] border-b-[1px] border-gray-300 flex justify-center items-center">
              <button className="p-[24px] w-[282px] h-[187px] border-[1px] border-gray-400 text-center bg-gray-200 rounded-[16px] flex flex-col justify-center items-center gap-[4px]">
                <img
                  src="/images/icon-findheart.png"
                  alt="icon-findheart"
                  className="w-[60px] h-[60px]"
                />
                <div className="text-[24px] font-[700] text-red-600">
                  Discover New Match
                </div>
                <div className="text-[14px] font-[500] text-gray-700">
                  Start find and Merry to get know and connect with new friend!
                </div>
              </button>
            </div>
            <div className="w-[100%] h-[194px] flex justify-center">
              <div className="w-[281px] h-full flex flex-col justify-center gap-[16px]">
                <div className="text-[24px] text-gray-900 font-[700]">
                  Merry Match!
                </div>
                <div className="flex gap-[12px]">
                  <div className="relative w-[100px] h-[100px]">
                    <img
                      src="/images/image-loginpage.png"
                      className="w-full h-full rounded-[24px]"
                    />
                    <img
                      src="/images/icon-doubleheart.png"
                      className="absolute bottom-0 left-16"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="py-[24px] w-[281px] flex flex-col gap-[16px]">
                <div className="text-[24px] font-[700] text-gray-900">
                  Chat with Merry Match
                </div>
                {/* ถ้ากะลัง chat อยู่กับใครจะมี border ถ้าอยู่หน้า matching เดี๋ยวมาแก้ไม่ต้องมี border */}
                <div className="flex flex-col gap-[10px]">
                  <div className="px-[12px] py-[16px] bg-gray-100 border-[1px] border-purple-500 rounded-[16px] flex gap-[12px]">
                    <img
                      src="/images/image-loginpage.png"
                      className="w-[60px] h-[60px] rounded-[99px]"
                    />
                    <div className="flex flex-col gap-[8px]">
                      <div className="text-[16px] font-[400] text-gray-900">
                        name
                      </div>
                      <div className="text-[14px] font-[500] text-gray-700">
                        current chat
                      </div>
                    </div>
                  </div>

                  {/* test เดี๋ยวรอ loop เพื่อเพิ่มแชท */}
                  <div className="px-[12px] py-[16px] bg-gray-100 border-[1px] border-purple-500 rounded-[16px] flex gap-[12px]">
                    <img
                      src="/images/image-loginpage.png"
                      className="w-[60px] h-[60px] rounded-[99px]"
                    />
                    <div className="flex flex-col gap-[8px]">
                      <div className="text-[16px] font-[400] text-gray-900">
                        name
                      </div>
                      <div className="text-[14px] font-[500] text-gray-700">
                        current chat
                      </div>
                    </div>
                  </div>
                  {/* test เดี๋ยวรอ loop เพื่อเพิ่มแชท */}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-[88px] w-[65%] h-screen bg-BG">
            <div className="w-full h-full bg-red-200/60 flex flex-col justify-center items-center">
              carousel
            </div>
            <div></div>
          </div>
          <div className="pt-[88px] w-[15%] h-screen bg-gray-100">
            <div className="pt-[20px] w-full flex justify-center">
              <div className="w-[200px] h-[400px] flex flex-col gap-[60px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="text-[16px] font-[700] text-gray-900">
                    Sex you interest
                  </div>
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex gap-[12px]">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                      />
                      <div className="text-[16px] font-[500] text-gray-700">
                        Male
                      </div>
                    </div>

                    <div className="flex gap-[12px]">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                      />
                      <div className="text-[16px] font-[500] text-gray-700">
                        Female
                      </div>
                    </div>

                    <div className="flex gap-[12px]">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                      />
                      <div className="text-[16px] font-[500] text-gray-700">
                        Other
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[16px]">
                  <div className="text-[16px] font-[700] text-gray-900">
                    Age Range
                  </div>
                  <div>----------</div>
                  <div>18-50</div>
                </div>
              </div>
            </div>
            <div className="border-t-[1px] border-gray-300 flex justify-center gap-[16px]">
              <div className="pt-[20px] h-[80px] flex justify-center items-center gap-[16px]">
                <button className="w-[40px] h-[20px] text-[16px] font-[700] text-red-500">
                  Clear
                </button>
                <button className="w-[99px] h-[48px] text-[16px] font-[700] text-white bg-red-500 rounded-[99px]">
                  Search
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchingPage;
