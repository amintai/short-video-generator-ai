"use client";

import { eq } from "drizzle-orm";
import { db } from "../configs/db";
import { Users } from "../configs/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "./redux/sclices/userDetailsSlice";

const Providers = ({ children }) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  const isNewUser = async () => {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

      dispatch(userDetails(result.at(0)))
    
    if (!result.length) {
      await db.insert(Users).values({
        name: user.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
      });
    }
  };

  useEffect(() => {
    if (user) isNewUser();
  }, [user]);

  return <div>{children}</div>;
};

export default Providers;
