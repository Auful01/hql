"use client"


import { Loader2 } from "lucide-react";
import React from "react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}


// full screen loading component
// export default Loading;
export function FullScreenLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <p className="mt-4 text-gray-300">Loading...</p>
    </div>
  );
}