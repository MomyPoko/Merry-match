import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/user";
import bcrypt from "bcrypt";
import { connectMongoDB } from "../../../../utils/mongodb";
import { Session } from "inspector";
import { signIn } from "next-auth/react";
import { newDate } from "react-datepicker/dist/date_utils";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connectMongoDB();
        try {
          const user = await User.findOne({ email: credentials.email });
          console.log("check user response: ", user);

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          console.log("Error in authorize: ", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 15 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      console.log("Check token JWT: ", token);
      console.log("Check user JWT: ", user);
      return token;
    },
    async sessionStorage({ session, token }) {
      session.user.id = token.sub;
      session.user.email = token.email;
      session.user.name = token.name;
      // session.expires = new Date(token.exp * 1000).toISOString();

      console.log("Check session sessionStorage: ", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  page: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
