import React from "react";

interface Props {
  list: React.ReactNode;
  detail: React.ReactNode;
}

export default function JobsLayout({ list, detail }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-12 gap-4 bg-gray-50 p-4">
      <div className="col-span-12 overflow-y-auto border-r border-gray-200 pr-4 md:col-span-5">
        {list}
      </div>
      <div className="col-span-12 overflow-y-auto pl-4 md:col-span-7">
        {detail}
      </div>
    </div>
  );
}
