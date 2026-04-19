"use client";

export default function ScanAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative h-32 w-32">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
        {/* Inner pulse */}
        <div className="absolute inset-4 animate-pulse rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Bezig met scannen...</p>
        <p className="text-sm text-gray-500 mt-1">AI analyseert je zoldervondst</p>
      </div>
    </div>
  );
}
