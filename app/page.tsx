import { div } from "framer-motion/client";
import Image from "next/image";
import SignInPage from "./auth/signin/page";

export default function Home() {
  return (
    <div>
      <SignInPage />
    </div>
  );
}
