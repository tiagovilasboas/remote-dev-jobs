import React from 'react';

interface Props {
  list: React.ReactNode;
  detail: React.ReactNode;
}

export default function JobsLayout({ list, detail }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-12 gap-4 p-4 bg-gray-50">
      <div className="col-span-12 md:col-span-4 overflow-y-auto border-r border-gray-200 pr-4">
        {list}
      </div>
      <div className="col-span-12 md:col-span-8 overflow-y-auto pl-4">
        {detail}
      </div>
    </div>
  );
} 