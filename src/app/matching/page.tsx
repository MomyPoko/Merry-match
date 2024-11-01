"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import axios from "axios";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface UserData {
  _id: string;
  id: string;
  name: string;
  dateOfBirth: string;
  image: { url: string }[];
}

const MatchingPage = () => {
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData[] | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<
    "pending" | "matched" | "rejected"
  >("pending");
  const [selectedSexIdent, setSelectedSexIdent] = useState<string[]>([]);
  const [sexIdent, setSexIdent] = useState<string[]>([]);
  // const [dateOfBirth, setDateofbirth] = useState<string | null>(null);
  const [noUsersFoundMessage, setNoUsersFoundMessage] = useState<string | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<number[]>([18, 50]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<number[]>([18, 50]);
  const [hideButtons, setHideButtons] = useState<boolean[]>([]);

  const { data: session } = useSession();
  const swiperRef = useRef<any>(null);

  let sex_Identities: Array<string> = ["Male", "Female", "Other"];

  const createMatching = async () => {
    try {
      const requesterUser = { id: session?.user?.id }; // ใช้ session เพื่อดึง id ของผู้ใช้งาน
      const receiverUser = { id: userData?.[activeIndex]?._id }; // ใช้ id ของผู้ใช้งานที่เลือกใน Swiper

      const response = await axios.post("/api/matching/index", {
        requesterUser,
        receiverUser,
      });
      setMatchingId(response.data.matching_data._id);
      setHideButtons((prev) => {
        const updatedHideButtons = [...prev];
        updatedHideButtons[activeIndex] = true; // ซ่อนปุ่มสำหรับการ์ดที่ถูกกด
        return updatedHideButtons;
      });
      handleNextSlide();
      console.log("Matching created: ", response);
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
    } catch (error) {
      console.log("Error updating matching: ", error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("/api/users/index", {
        params: {
          sexIdent: sexIdent.join(","),
          minAge: ageRange[0],
          maxAge: ageRange[1],
        },
      });

      if (response.data.length === 0) {
        setNoUsersFoundMessage("User not found");
        setUserData(null);
      } else {
        setUserData(response.data);
        setNoUsersFoundMessage(null); // ลบข้อความเมื่อพบผู้ใช้
      }

      setUserData(response.data);
      setHideButtons(Array(response.data.length).fill(false));

      console.log("Users data fetched: ", response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNoUsersFoundMessage("User not found");
        setUserData(null); // หากไม่พบผู้ใช้
      } else {
        console.log("Error fetching users data: ", error);
      }
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleRemoveUser = async (rejectedUserId: string) => {
    try {
      if (!rejectedUserId) {
        console.log("Rejected user ID is missing");
        return;
      }

      await axios.put("/api/users/index", { rejectedUserId });

      setUserData((prevUserData) => {
        if (!prevUserData) return null;

        const updatedUserData = prevUserData.filter(
          (user) => user._id !== rejectedUserId
        );

        if (activeIndex >= updatedUserData.length) {
          setActiveIndex(updatedUserData.length - 1);
        }

        return updatedUserData;
      });

      // handleNextSlide();
    } catch (error) {
      console.log("Error rejecting user: ", error);
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

  const handleCheckboxChange = (gender: string) => {
    // เลือก/ยกเลิกเลือกเพศ
    setSelectedSexIdent((prev) =>
      prev.includes(gender)
        ? prev.filter((sex) => sex !== gender)
        : [...prev, gender]
    );
  };

  const handleSearch = () => {
    setSexIdent([...selectedSexIdent]);
    setSelectedAgeRange(ageRange);
  };

  const handleClear = () => {
    // Reset parameters
    setSelectedSexIdent([]);
    setSexIdent([]);
    setSelectedAgeRange([18, 50]);
    setAgeRange([18, 50]);
    getUserData();
  };

  const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
    setAgeRange(newValue as number[]);
  };

  const handleInputAgeRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...ageRange];
    newRange[index] = Number(event.target.value);
    setAgeRange(newRange as number[]);
  };

  useEffect(() => {
    if (session) {
      getUserData();
    }

    if (sexIdent.length > 0) {
      getUserData();
    }
  }, [sexIdent, selectedAgeRange, session, matchingStatus]);

  return (
    <div className="w-screen h-screen flex">
      {userData && (
        <>
          <div className="pt-[88px] w-[20%] h-screen bg-gray-100 flex flex-col">
            <div className="py-[30px] w-[100%] border-b-[1px] border-gray-300 flex justify-center items-center">
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
            <div className="w-[100%] py-[24px] flex justify-center">
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
            <div className="w-full h-full flex justify-center">
              <div className="pt-[24px] w-[281px] flex flex-col gap-[16px]">
                <div className="text-[24px] font-[700] text-gray-900">
                  Chat with Merry Match
                </div>

                <div className="carousel carousel-vertical rounded-box h-[322px]">
                  <div className="pb-[10px] carousel-item">
                    <div className="px-[12px] py-[16px] w-full bg-gray-100 border-[1px] border-purple-500 rounded-[16px] flex gap-[12px]">
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
                  </div>

                  <div className="pb-[10px] carousel-item">
                    <div className="px-[12px] py-[16px] w-full bg-gray-100 border-[1px] border-purple-500 rounded-[16px] flex gap-[12px]">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-[88px] w-[65%] h-screen bg-BG">
            {userData && userData.length > 0 ? (
              <>
                <div className="w-full h-full flex flex-col justify-center items-center overflow-visible">
                  <Swiper
                    slidesPerView={1.75}
                    centeredSlides={true}
                    spaceBetween={200}
                    onSlideChange={(swiper) =>
                      setActiveIndex(swiper.activeIndex)
                    }
                    ref={swiperRef}
                    className="w-[100%] h-[80%] overflow-visible"
                  >
                    {userData.map((data, index_data) => (
                      <SwiperSlide
                        key={index_data}
                        className="overflow-visible"
                      >
                        <div
                          className={`relative w-[110%] h-[90%] transition-all duration-500 ${
                            activeIndex === index_data
                              ? "scale-100 z-20"
                              : "scale-90 z-10 opacity-30"
                          }`}
                        >
                          <img
                            src={data.image[0].url}
                            alt={data.name}
                            className="w-[100%] h-[100%] rounded-[32px]"
                          />

                          <div className="absolute bottom-0 bg-gradient-to-t from-[#390741] to-[070941]/0 px-[6%] w-full h-[30%] text-white rounded-[30px] flex justify-between items-center">
                            <div className="flex items-center gap-[16px]">
                              <span className="flex gap-[8px]">
                                <span className="text-[32px] font-[700]">
                                  {data.name}
                                </span>
                                <span className="text-[32px] font-[700]">
                                  {calculateAge(data.dateOfBirth)}
                                </span>
                              </span>

                              <button className="w-[32px] h-[32px] text-[20px] bg-white/20 rounded-[100%] flex justify-center items-center active:text-[18px]">
                                <AiFillEye />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                onClick={handlePrevSlide}
                                className="w-[40px] text-[24px] active:text-[23px]"
                              >
                                <FaArrowLeft />
                              </button>
                              <button
                                onClick={handleNextSlide}
                                className="w-[40px] text-[24px] active:text-[23px]"
                              >
                                <FaArrowRight />
                              </button>
                            </div>
                          </div>

                          {!hideButtons[index_data] && (
                            <div className="absolute bottom-[-40px] z-100 w-[100%] flex justify-center overflow-visible">
                              <div className="flex gap-[24px]">
                                <button
                                  onClick={() => handleRemoveUser(data._id)}
                                  className="w-[80px] h-[80px] text-[64px] text-gray-700 bg-white rounded-[24px] flex justify-center items-center active:text-[63px]"
                                >
                                  <IoClose />
                                </button>
                                <button
                                  onClick={createMatching}
                                  className="w-[80px] h-[80px] text-[48px] text-red-500 bg-white rounded-[24px] flex justify-center items-center active:text-[47px]"
                                >
                                  <IoHeart />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div></div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-2xl font-bold text-red-800">
                  {noUsersFoundMessage}
                </p>
              </div>
            )}
          </div>
          <div className="pt-[88px] w-[15%] h-screen bg-gray-100">
            <div className="pt-[20px] w-full flex justify-center">
              <div className="w-[200px] h-[400px] flex flex-col gap-[60px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="text-[16px] font-[700] text-gray-900">
                    Sex you interest
                  </div>
                  <div className="flex flex-col gap-[16px]">
                    {sex_Identities.map((genders, index_sex) => {
                      return (
                        <div key={index_sex} className="flex gap-[12px]">
                          <input
                            type="checkbox"
                            checked={selectedSexIdent.includes(genders)}
                            onChange={() => handleCheckboxChange(genders)}
                            className="checkbox checkbox-secondary"
                          />
                          <div className="text-[16px] font-[500] text-gray-700">
                            {genders}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-[16px]">
                  <div className="text-[16px] font-[700] text-gray-900">
                    Age Range
                  </div>
                  <div className="w-full flex justify-center">
                    <Box sx={{ width: "95%" }}>
                      <Slider
                        getAriaLabel={() => "Age range"}
                        value={ageRange}
                        onChange={handleAgeRangeChange}
                        valueLabelDisplay="auto"
                        min={18}
                        max={50}
                        sx={{
                          color: "pink", // เปลี่ยนสี Slider เป็นสีชมพู
                          "& .MuiSlider-thumb": {
                            width: "11px",
                            height: "11px",
                            border: "2px solid #A62D82",
                            backgroundColor: "#DF89C6", // สีชมพูสำหรับ thumb
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: "#A62D82", // สีชมพูสำหรับ track
                          },
                        }}
                      />
                    </Box>
                  </div>

                  <div className="flex justify-center items-center gap-[10px]">
                    <input
                      type="text"
                      className="w-[100%] h-[48px] pl-[12px] rounded-[8px] outline-[1px] outline-purple-500"
                      value={ageRange[0]}
                      onChange={(e) => handleInputAgeRangeChange(e, 0)}
                    />
                    <span> - </span>
                    <input
                      type="text"
                      className="w-[100%] h-[48px] pl-[12px] rounded-[8px] outline-[1px] outline-purple-500"
                      value={ageRange[1]}
                      onChange={(e) => handleInputAgeRangeChange(e, 1)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-[1px] border-gray-300 flex justify-center gap-[16px]">
              <div className="pt-[20px] h-[80px] flex justify-center items-center gap-[16px]">
                <button
                  onClick={handleClear}
                  className="w-[40px] h-[20px] text-[16px] font-[700] text-red-500"
                >
                  Clear
                </button>
                <button
                  onClick={handleSearch}
                  className="w-[99px] h-[48px] text-[16px] font-[700] text-white bg-red-500 rounded-[99px]"
                >
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
