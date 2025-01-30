import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";

const useVideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getVideoList();
    }
  }, [user]);

  const getVideoList = async (page = 1, pageSize = 4) => {
    setLoading(true);
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress));
    // .limit(pageSize)
    // .offset((page - 1) * pageSize);

    setLoading(false);
    setVideoList(result);
  };

  return [{ videoList, isLoading }];
};

export default useVideoList;
