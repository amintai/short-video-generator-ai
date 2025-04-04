import { SignIn } from "@clerk/nextjs";
import HomePageHeader from "../../../_components/Header";
import Image from "next/image";
import Signup from "../../../../public/signup.jpeg"

export default function Page() {
  return (
<div className="grid grid-cols-1 md:grid-cols-2 h-screen">
  <div className="w-full h-full">
    <Image src={Signup} alt="Image" className="mt-10 w-full h-full object-cover" />
  </div>
  <div className="mt-20 flex justify-center items-center h-full">
    <HomePageHeader />
    <SignIn />
  </div>
</div>
  );
}
