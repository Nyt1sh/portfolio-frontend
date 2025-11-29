{// // src/Components/Skeleton.jsx
// import React from "react";

// export const HeroSkeleton = () => (
//   <div className="pt-32 pb-16 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between min-h-screen">
//     <div className="max-w-lg mb-10 md:mb-0 space-y-6">
//       <div className="h-[60px] w-3/4 bg-gray-700 rounded-lg animate-pulse" /> {/* title */}
//       <div className="h-8 w-1/3 bg-gray-700 rounded-lg animate-pulse" /> {/* subtitle */}
//       <div className="h-36 bg-gray-800 rounded-2xl border border-gray-700 p-4 animate-pulse" /> {/* desc box */}
//       <div className="flex items-center space-x-4">
//         <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
//         <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
//         <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
//       </div>
//       <div className="mt-6 h-12 w-36 rounded-full bg-gray-700 animate-pulse" />
//     </div>

//     <div className="relative w-full md:w-1/2 flex items-center justify-center px-6">
//       {/* Make this circular: equal width & height, rounded-full */}
//       <div
//         className="rounded-full bg-gradient-to-r from-purple-700 via-pink-500 to-pink-300 opacity-20 animate-pulse"
//         style={{
//           width: 'min(60vh, 520px)',
//           height: 'min(60vh, 520px)', 
//           maxWidth: 620,
//           maxHeight: 620,
//           minWidth: 240,
//           minHeight: 240,
//         }}
//       />
//     </div>
//   </div>
// );

// export const ProjectsSkeleton = ({ cols = 3, rows = 2 }) => {
//   const items = Array.from({ length: cols * rows });
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {items.map((_, i) => (
//         <div key={i} className="h-48 rounded-lg bg-gray-800 border border-gray-700 p-4 animate-pulse" />
//       ))}
//     </div>
//   );
// };

// export default function SkeletonScreen() {
//   return (
//     <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-900">
//       <HeroSkeleton />
//       <div className="px-4 md:px-10 py-10">
//         <div className="h-8 w-40 bg-gray-700 rounded-md animate-pulse mb-6" />
//         <ProjectsSkeleton />
//       </div>
//     </div>
//   );
// }

}
// src/Components/Skeleton.jsx
import React from "react";

export const HeroSkeleton = () => (
  <div className="pt-32 pb-16 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between min-h-screen">
    <div className="max-w-lg mb-10 md:mb-0 space-y-6">
      <div className="h-[60px] w-3/4 bg-gray-700 rounded-lg animate-pulse" /> {/* title */}
      <div className="h-8 w-1/3 bg-gray-700 rounded-lg animate-pulse" /> {/* subtitle */}
      <div className="h-36 bg-gray-800 rounded-2xl border border-gray-700 p-4 animate-pulse" /> {/* desc box */}
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
        <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
        <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
      </div>
      <div className="mt-6 h-12 w-36 rounded-full bg-gray-700 animate-pulse" />
    </div>

    <div className="relative w-full md:w-1/2 flex items-center justify-center px-6">
      <div
        className="rounded-full bg-gradient-to-r from-purple-700 via-pink-500 to-pink-300 opacity-20 animate-pulse aspect-square"
        style={{
          width: 'min(80vw, 60vh, 520px)',
          height: 'min(80vw, 60vh, 520px)', 
          maxWidth: 620,
          maxHeight: 620,
          minWidth: 200, 
          minHeight: 200,
        }}
      />
    </div>
  </div>
);

export const ProjectsSkeleton = ({ cols = 3, rows = 2 }) => {
  const items = Array.from({ length: cols * rows });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-gray-800 border border-gray-700 p-4 animate-pulse" />
      ))}
    </div>
  );
};

export default function SkeletonScreen() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-900">
      <HeroSkeleton />
      <div className="px-4 md:px-10 py-10">
        <div className="h-8 w-40 bg-gray-700 rounded-md animate-pulse mb-6" />
        <ProjectsSkeleton />
      </div>
    </div>
  );
}