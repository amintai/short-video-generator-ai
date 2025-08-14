"use client"
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./provider";
import { Outfit } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Analytics } from "@vercel/analytics/next"

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

  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={outfit.className}>
          <PersistGate loading={null} persistor={persistor}>
            <ClerkProvider publishableKey={publishableKey}>
              <Providers>{children}</Providers>
              <Toaster />
              <Analytics />
            </ClerkProvider>
          </PersistGate>
        </body>
      </html>
    </Provider>
  );
}
