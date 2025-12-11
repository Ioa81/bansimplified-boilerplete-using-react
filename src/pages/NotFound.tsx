// src/components/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => (
  <main className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 className="text-7xl font-extrabold text-red-600">404</h1>
    <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
    <p className="mt-2 text-gray-500">
      Sorry, we couldn’t find the page you’re looking for.
    </p>
    <Link
      to="/"
      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
    >
      Return Home
    </Link>
  </main>
);
