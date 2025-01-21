"use client";

import { eq } from "drizzle-orm";
import { db } from "../configs/db";
import { Users } from "../configs/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

const Provider = ({ children }) => {
  const { user } = useUser();

  const isNewUser = async () => {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

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

export default Provider;
