import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="pt-[88px] w-full flex justify-center">
      <div className=" mt-[80px] w-[1150px] flex justify-between items-center">
        <img src="/images/image-loginpage.png" alt="image-loginpage" />
        <div className="w-[455px] flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[8px]">
            <div className="text-beige-700 text-[14px] font-[600]">Login</div>
            <div
              className="text-purple-500 text-[46px] font-[800]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Welcome back to Merry Match
            </div>
          </div>
          <div className="flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[4px]">
              <div>Username or Email</div>
              <input
                type="text"
                placeholder="Enter Username or Email"
                className="border-gray-400 border-[1px] p-[12px_16px_12px_12px] w-[100%]"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <div>Password</div>
              <input
                type="text"
                placeholder="Enter Password"
                className="border-gray-400 border-[1px] p-[12px_16px_12px_12px] w-[100%]"
              />
            </div>
            <button className="p-[12px_24px_12px_24px] text-white text-[16px] font-[700] bg-red-500 rounded-[99px]">
              Log in
            </button>
            <span>
              Don’t have an account?{" "}
              <Link href="/auth/register" className="text-red-500 font-[700]">
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
