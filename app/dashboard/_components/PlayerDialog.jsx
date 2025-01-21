import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "../../../components/ui/button";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";

const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpenDialog(true);
    getVideoData();
  }, [playVideo, videoId]);

  const getVideoData = async () => {
    setIsLoading(true);
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));

    setIsLoading(false);
    setVideoData(result[0]);
  };

  if (isLoading) {
    return <p>Loading....</p>;
  }

  console.log("AMIN", openDialog);
  return (
    <Dialog open={openDialog}>
      <DialogContent className="flex flex-col items-center absolute right-4 top-4 rounded-sm  ring-offset-background bg-white fixed left-[50%] top-[50%] z-50  max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <DialogHeader className=" flex flex-col">
          <DialogTitle className="leading-none tracking-tight">
            Your video is ready!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground"></DialogDescription>
        </DialogHeader>
        <Player
          component={RemotionVideo}
          durationInFrames={Number(durationInFrame.toFixed(0))}
          compositionWidth={300}
          compositionHeight={450}
          fps={30}
          inputProps={{
            ...videoData,
            setDurationInFrame: (frameValue) => setDurationInFrame(frameValue),
          }}
          controls
        />
        <div className="flex gap-10">
          <Button variant="secondary">Cancel</Button>
          <Button>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
