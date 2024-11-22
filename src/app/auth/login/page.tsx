import LoginPage from "@/components/login/LoginPage";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";

async function login() {
  const session = await getServerSession();
  return (
    <>
      <Navbar session={session} />
      <LoginPage />
    </>
  );
}

export default login;
