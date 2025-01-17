import Link from "next/link";
import { Button } from "../../../components/ui/button";
import React from "react";

const EmptyState = () => {
  return (
    <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dashed">
      <h2>You Don't have any short video created</h2>
      <Link href="/dashboard/create-new">
        <Button className="mt-5">Create New Short Video</Button>
      </Link>
    </div>
  );
};

export default EmptyState;
