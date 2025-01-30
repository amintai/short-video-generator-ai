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
import useVideoList from "./hooks/useVideoList";

const Dashboard = () => {
  const [{ videoList, isLoading }, { getVideoList }] = useVideoList();

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <div className="mt-10">
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
