import { SignUp } from "@clerk/nextjs";
import HomePageHeader from "../../../_components/Header";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="w-full object-contain"></div>
      <div className="flex justify-center items-center h-screen">
        <HomePageHeader />
        <SignUp />
      </div>
    </div>
  );
}
