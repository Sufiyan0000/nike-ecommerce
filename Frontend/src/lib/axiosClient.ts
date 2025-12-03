// lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true, // 🔥 SEND + RECEIVE cookies (sessionid, guest_session)
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default axiosClient;
