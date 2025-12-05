// ⚠️ NOTE:
// This Axios instance is intended **only** for projects using:
// - React (TSX) for frontend
// - PHP for backend
// - MySQL for database
//
// It assumes a PHP backend structure (e.g., '/backend' route) and may not work correctly
// with other tech stacks without modifications.

import axios from 'axios';

const apiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL;

if (!apiUrl) {
  throw new Error(
    'VITE_API_URL or VITE_API_BASE_URL must be defined in environment variables.'
  );
}

const axiosInstance = axios.create({
  baseURL: apiUrl.replace(/\/$/, '') + '/backend',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

export default axiosInstance;
