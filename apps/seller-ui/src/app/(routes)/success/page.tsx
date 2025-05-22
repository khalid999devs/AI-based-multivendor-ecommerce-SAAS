import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="white"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12.5l3 3 5-5"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
          Stripe Account Connected!
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Your Stripe account has been successfully connected.
          <br />
          You can now start receiving payments on your store.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-150"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default Page;
