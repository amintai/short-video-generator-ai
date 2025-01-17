import React from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "../../../../@/components/ui/alert-dialog";
import Image from "next/image";

const CustomLoading = ({ loading }) => {
  return (
    <AlertDialog
      open={loading}
      className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <AlertDialogTitle></AlertDialogTitle>
      <AlertDialogContent className="bg-white fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <div className="bg-white flex flex-col items-center my-10 justify-center">
          <Image
            src={"/loading.gif"}
            height={100}
            width={100}
            alt="Loading..."
          />
          <h2>Generating your video... Do not refresh</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomLoading;
