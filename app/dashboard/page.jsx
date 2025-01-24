"use client";
import { Button } from "../../components/ui/button";
import React, { useEffect, useState } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { db } from "../../configs/db";
import { VideoData } from "../../configs/schema";
import { eq } from "drizzle-orm";
import VideoList from "./_components/VideoList";
import FullScreenLoader from "./_components/FullScreenLoader";

const Dashboard = () => {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getVideoList();
    }
  }, [user]);

  const getVideoList = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress));

    setLoading(false);
    setVideoList(result);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <div>
      <div className="flex justify-between items-center ">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Create New</Button>
        </Link>
      </div>
      {!videoList.length ? <EmptyState /> : <VideoList videoList={videoList} />}
    </div>
  );
};

export default Dashboard;
