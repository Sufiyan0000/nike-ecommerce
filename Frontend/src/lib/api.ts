import axiosClient from "./axiosClient";

export async function signIn(email: string,password:string){
    const body = new URLSearchParams({ email,password}).toString();
    return axiosClient.post("/auth/sign-in/",body);
}

export async function signUp(email: string,password:string,name:string){
    const body = new URLSearchParams({ email,password,name}).toString();
    return axiosClient.post("/auth/sign-up/",body);
}

export async function signOut(){
    return axiosClient.post("/auth/sign-out/","");
}

export async function ensureGuestSession(){
    return axiosClient.get("/auth/guest-session/");
}

export async function getCheckout(){
    return axiosClient.get("/auth/checkout/");
}