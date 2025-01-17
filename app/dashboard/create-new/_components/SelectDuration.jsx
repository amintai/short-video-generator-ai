import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../@/components/ui/select";

const SelectDuration = ({ onHandleInputChange = () => {} }) => {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl text-primary">Duration</h2>
      <p className="text-gray-500">Select the duration of your video</p>

      <Select
        onValueChange={(value) => {
          onHandleInputChange("duration", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <SelectItem
            value="30 Seconds"
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            30 Seconds
          </SelectItem>
          <SelectItem
            value="60 Seconds"
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            60 Seconds
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDuration;
