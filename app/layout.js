"use client"
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./provider";
import { Outfit } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

// export const metadata = {
//   title: "AI Short Video Generator",
//   description: "Generated Short Videos using AI in few clicks!",
// };

const outfit = Outfit({
  subsets: ["latin"],
});

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk publishable key");
}

export default function RootLayout({ children }) {
  console.log('store', store.getState())
  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={publishableKey}>
        <html lang="en">
          <body className={outfit.className}>
            <Providers>{children}</Providers>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </Provider>
  );
}
