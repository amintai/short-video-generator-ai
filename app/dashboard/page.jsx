"use client";
import { Button } from "../../components/ui/button";
import React from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import VideoList from "./_components/VideoList";
import FullScreenLoader from "./_components/FullScreenLoader";
import useVideoList from "./hooks/useVideoList";

const Dashboard = () => {
  const [
    { videoList, openPlayDialog, videoData,hasNext, isLoading },
    {  handleDeleteVideo, handleCancelVideoPlayerCb,throttledFetch,getVideoData }
  ] = useVideoList();


  return (
    <div className="mt-10">
      <div className="flex justify-between items-center ">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Create New</Button>
        </Link>
      </div>
      {!videoList.length ? <EmptyState /> :
        <VideoList
          videoList={videoList}
          openPlayDialog={openPlayDialog}
          videoData={videoData}
          hasNext={hasNext}
          handleDeleteVideo={handleDeleteVideo}
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          getVideoList={throttledFetch}
          isLoading={isLoading}
          getVideoData={getVideoData}
        />
      }
    </div>
  );
};

export default Dashboard;
