import { motion } from 'motion/react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-12">
      {/* Profile Skeleton */}
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-vapor-pink" />
        <div className="space-y-4 flex-1 w-full">
          <div className="h-8 bg-gray-200 animate-pulse w-1/3" />
          <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
          <div className="flex space-x-4">
            <div className="h-6 bg-gray-200 animate-pulse w-24" />
            <div className="h-6 bg-gray-200 animate-pulse w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coding Stats Skeleton */}
        <div className="lg:col-span-1 bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6">
          <div className="h-8 bg-gray-200 animate-pulse w-1/2 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 animate-pulse w-12" />
                </div>
                <div className="h-3 bg-gray-200 animate-pulse w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Contribution History Skeleton */}
        <div className="lg:col-span-2 bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6">
          <div className="h-8 bg-gray-200 animate-pulse w-1/3 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-4">
                <div className="space-y-2 w-2/3">
                  <div className="h-5 bg-gray-200 animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 animate-pulse w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repository Info Skeleton */}
      <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6">
        <div className="h-8 bg-gray-200 animate-pulse w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-2 border-vapor-pink p-4 space-y-4">
              <div className="h-6 bg-gray-200 animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse w-full" />
              <div className="h-4 bg-gray-200 animate-pulse w-5/6" />
              <div className="flex justify-between pt-4">
                <div className="h-4 bg-gray-200 animate-pulse w-12" />
                <div className="h-4 bg-gray-200 animate-pulse w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
