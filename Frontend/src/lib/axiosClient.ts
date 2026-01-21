// lib/axiosClient.ts
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
})

axiosClient.interceptors.request.use((config) => {

  if (typeof window !== "undefined"){

    const token = localStorage.getItem("access_token");
    if (token){
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestId = localStorage.getItem("guest_id");
    if (guestId){
      config.headers["X-Guest-Id"]= guestId;
    }
  }
    return config;
}, 
(error) => {
  return Promise.reject(error)
})

axiosClient.interceptors.response.use(
  (response) => {

    if (typeof window !== "undefined"){
      if (response.data?.guest_id){
        localStorage.setItem("guest_id",response.data.guest_id);
      }
    }
    return response
  },
)


