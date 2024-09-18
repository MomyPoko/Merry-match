"use client";

// import Link from "next/link";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useFormContext, FormRegister } from "@/app/context/register/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PropsInput {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<PropsInput> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-[4px]">
    <div>{label}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
    />
  </div>
);

const Register: React.FC = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [avatarImage, setAvatarImage] = useState<{
    [key: string]: File | string;
  }>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const router = useRouter();

  const { allData, updateFormData, currentStep, setCurrentStep } =
    useFormContext();

  // console.log("check formData", formData);

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.isoCode === code);
    return country ? country.name : "";
  };

  const getStateName = (code: string) => {
    const state = states.find((s) => s.isoCode === code);
    return state ? state.name : "";
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key_images: string
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatarImage((prevImages) => {
        const updatedImages = { ...prevImages, [key_images]: file };
        // console.log("check avatarimage", updatedImages);
        return updatedImages;
      });
    }
  };

  const handleDeleteImage = (key_images: string) => {
    setAvatarImage((prevImages) => {
      const updatedImages = { ...prevImages };
      updatedImages[key_images] = "";
      // console.log("check avatarimage", updatedImages);
      return updatedImages;
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const results = new FormData();
    results.append("name", allData.name);
    results.append("username", allData.username);
    results.append("email", allData.email);
    results.append("password", allData.password);
    results.append("confirmPassword", allData.confirmPassword);
    results.append("dateOfBirth", allData.dateOfBirth);
    results.append("country", getCountryName(allData.country));
    results.append("state", getStateName(allData.state));
    results.append("sexIdent", allData.sexIdent);
    results.append("sexPref", allData.sexPref);
    results.append("recailPref", allData.recailPref);
    results.append("meeting", allData.meeting);
    results.append("hobbies", allData.hobbies);
    Object.keys(avatarImage).forEach((key_image) => {
      if (
        avatarImage[key_image] &&
        typeof avatarImage[key_image] !== "string"
      ) {
        results.append("image", avatarImage[key_image]);
      }
      // console.log(avatarImage[key_image]);
    });

    // console.log("result check client", allData);

    try {
      const response = await axios.post(`/api/auth/register`, results, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("User registered:", response.data);
    } catch (error) {
      console.log("Can't register now error", error);
    }
    // console.log("Form submitted:", results);
    router.push("/auth/login");
  };

  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (allData.country) {
      const stateList = State.getStatesOfCountry(allData.country);
      setStates(stateList);
    } else {
      setStates([]);
    }
  }, [allData.country]);

  return (
    <div className="w-screen">
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col justify-between"
      >
        <div className="flex flex-col justify-center items-center">
          <div
            className={`w-[65%] flex flex-col justify-center items-center gap-[40px] ${
              currentStep === 1
                ? "mt-[120px]"
                : currentStep === 2
                ? "mt-[120px]"
                : currentStep === 3
                ? "mt-[120px]"
                : ""
            }`}
          >
            <div className="w-full flex justify-between">
              <div className="flex flex-col">
                <div>REGISTER</div>
                <div className="w-[80%] text-[46px] text-purple-500 font-bold">
                  Join us and start matching
                </div>
              </div>
              <div className="h-[80px] flex gap-[12px]">
                {currentStep === 1 ? (
                  <>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-[12px]">Step 1/3</div>
                        <div>Basic Information</div>
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                    </div>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-[12px]">Step 2/3</div>
                        <div>Identities and Interests</div>
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-[12px]">Step 3/3</div>
                        <div>Upload Photos</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {currentStep === 1 && (
              <div className="w-full flex flex-col gap-[24px]">
                <div className="text-[24px] text-purple-500">
                  Basic Information
                </div>
                <div className="w-full grid grid-cols-2 gap-[40px]">
                  <InputField
                    label="Name"
                    placeholder="John Snow"
                    type="text"
                    value={allData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />

                  <InputField
                    label="Date of birth"
                    placeholder="01/01/2022"
                    type="date"
                    value={allData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData({ dateOfBirth: e.target.value })
                    }
                  />

                  <div className="flex flex-col gap-[4px]">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      value={allData.country}
                      onChange={(e) =>
                        updateFormData({ country: e.target.value })
                      }
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Select Country</option>
                      {countries.map((countries) => (
                        <option
                          key={countries.isoCode}
                          value={countries.isoCode}
                        >
                          {countries.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <label htmlFor="state">State</label>
                    <select
                      id="state"
                      value={allData.state}
                      onChange={(e) =>
                        updateFormData({ state: e.target.value })
                      }
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Username"
                    placeholder="At least 6 characters"
                    type="text"
                    value={allData.username}
                    onChange={(e) =>
                      updateFormData({ username: e.target.value })
                    }
                  />

                  <InputField
                    label="Email"
                    placeholder="name@website.com"
                    type="email"
                    value={allData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                  />

                  <InputField
                    label="Password"
                    placeholder="At least 8 characters"
                    type="text"
                    value={allData.password}
                    onChange={(e) =>
                      updateFormData({ password: e.target.value })
                    }
                  />

                  <InputField
                    label="Confirm password"
                    placeholder="At least 8 characters"
                    type="text"
                    value={allData.confirmPassword}
                    onChange={(e) =>
                      updateFormData({ confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="border-[1px] w-full flex flex-col gap-[24px]">
                <div className="text-[24px] text-purple-500">
                  Identities and Interests
                </div>

                <div className="w-full grid grid-cols-2 gap-[40px]">
                  <div className="flex flex-col gap-[4px]">
                    <div>Sexual Identities</div>
                    <select
                      id="sexualIden"
                      value={allData.sexIdent}
                      onChange={(e) =>
                        updateFormData({ sexIdent: e.target.value })
                      }
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Sexual</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Sexual preferences</div>
                    <select
                      id="sexualPref"
                      value={allData.sexPref}
                      onChange={(e) => {
                        updateFormData({ sexPref: e.target.value });
                      }}
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Sexual</option>
                      <option>All Genders</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Racial preferences</div>
                    <select
                      id="racialPref"
                      value={allData.recailPref}
                      onChange={(e) => {
                        updateFormData({ recailPref: e.target.value });
                      }}
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Types</option>
                      <option>Any Race/Ethnicity</option>
                      <option>Caucasian/White</option>
                      <option>Hispanic/Latino</option>
                      <option>Any Race/Ethnicity</option>
                      <option>Caucasian/White</option>
                      <option>Hispanic/Latino</option>
                      <option>Any Race/Ethnicity</option>
                      <option>Caucasian/White</option>
                      <option>Hispanic/Latino</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Meeting interests</div>
                    <select
                      id="Meeting"
                      value={allData.meeting}
                      onChange={(e) => {
                        updateFormData({ meeting: e.target.value });
                      }}
                      className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    >
                      <option value="">Meeting Types</option>
                      <option>Outdoor Activities</option>
                      <option>Social Events</option>
                      <option>Cultural Activities</option>
                      <option>Sports and Fitness</option>
                      <option>Dining Out</option>
                      <option>Travel and Adventure</option>
                      <option>Home-Based Activities</option>
                      <option>Learning and Development</option>
                      <option>Volunteer Work</option>
                      <option>Relaxation and Wellness</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex flex-col gap-[4px]">
                    <div>Hobbies / Interests (Maximum 10)</div>
                    <input
                      id="hobbies"
                      value={allData.hobbies}
                      onChange={(e) => {
                        updateFormData({ hobbies: e.target.value });
                      }}
                      className="h-[50px] border-[1px] border-[black] rounded-[8px]"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="border-[1px] w-full flex flex-col gap-[24px]">
                <div className="text-[24px] text-purple-500">
                  Profile pictures
                </div>
                <div className="text-[16px] font-400">
                  Upload at least 2 photos
                </div>
                <div className="border-[1px] border-[pink] flex justify-between gap-[20px]">
                  {Object.keys(avatarImage).map((key_images, index_image) => (
                    <>
                      <div
                        key={index_image}
                        className="border-[1px] border-[green] w-[200px] h-[200px] flex justify-center items-center"
                      >
                        {avatarImage[key_images] instanceof File ? (
                          <div>
                            <img
                              src={URL.createObjectURL(avatarImage[key_images])}
                              alt={"uploaded photo" + index_image}
                            />
                            <button
                              type="button"
                              id={"remove-image" + index_image}
                              onClick={() => {
                                handleDeleteImage(key_images);
                              }}
                              className=""
                            >
                              x
                            </button>
                          </div>
                        ) : (
                          <div className="border-[1px] border-[green] flex flex-col justify-center items-center relative">
                            <div>+</div>
                            <div>Upload photo</div>
                            <input
                              type="file"
                              onChange={(event) => {
                                // event.preventDefault();
                                handleFileChange(event, key_images);
                              }}
                              className="text-[13px] absolute left-[-30px] opacity-0"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="h-[100px] px-[200px] border-[1px] align-bottom flex justify-between items-center">
            <div>1/3</div>
            <div className="flex gap-[24px]">
              <button onClick={handleBack} disabled>
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="h-[100px] px-[200px] border-[1px] flex justify-between items-center">
            <div>2/3</div>
            <div className="flex gap-[24px]">
              <button onClick={handleBack}>Back</button>
              <button
                onClick={handleNext}
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="h-[100px] px-[200px] border-[1px] flex justify-between items-center">
            <div>3/3</div>
            <div className="flex gap-[24px]">
              <button onClick={handleBack}>Back</button>
              <button
                type="submit"
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const RegisterPage: React.FC = () => (
  <FormRegister>
    <Register />
  </FormRegister>
);

export default RegisterPage;