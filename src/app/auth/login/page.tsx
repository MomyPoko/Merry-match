import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div>
      <Link href="/auth/register">
        <div className="pt-[100px]">register</div>
      </Link>
    </div>
  );
};

export default Login;
