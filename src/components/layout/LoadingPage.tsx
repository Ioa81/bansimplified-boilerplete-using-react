import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f3ef]">
      <div className="flex flex-col items-center gap-4">

        {/* Coffee Cup Animation */ }
        <div className="relative">
          <div className="w-20 h-24 bg-white rounded-b-xl rounded-t-md shadow-lg border relative overflow-hidden">
            {/* Coffee liquid */ }
            <div className="absolute bottom-0 left-0 w-full bg-[#8b4513] h-1/2 animate-fillCup"></div>
          </div>

          {/* Steam */ }
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col gap-1">
            <span className="block w-2 h-4 bg-gray-400 rounded-full opacity-50 animate-steam"></span>
            <span className="block w-2 h-4 bg-gray-400 rounded-full opacity-40 animate-steam delay-200"></span>
            <span className="block w-2 h-4 bg-gray-400 rounded-full opacity-30 animate-steam delay-300"></span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 tracking-wide">
          Brewing your experience…
        </h2>
      </div>
    </div>
  );
};

export default LoadingPage;
