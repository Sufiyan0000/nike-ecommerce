import { axiosClient } from "./axiosClient";

export async function signIn(email: string,password:string){

    const res = await axiosClient.post("/auth/login/",{
        email,
        password
    });

    localStorage.setItem("access_token",res.data.access)
    localStorage.setItem("refresh_token",res.data.refresh)

    return res.data;
}

export async function signUp(email: string,password:string,name:string){
    
    const res = await axiosClient.post("/auth/login/",{
        email,
        password,
        name
    });

    localStorage.setItem("access_token",res.data.access_token)
    localStorage.setItem("refresh_token",res.data.refresh_token)

    return res.data;
}

export async function getMe() {
    const res = await axiosClient.get("/auth/me/");
    return res.data;
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

//  -------CART RELATED APIS'--------

// 🛒 Get current cart
export async function getCart() {
    const res = await axiosClient.get('/api/carts/current/');
    return res.data
}

// ➕ Add item to cart
export async function addToCart(
    productVariantId: string,
    quantity: number = 1
) {
    const res = await axiosClient.post('/api/carts/current/add-item/', {
        product_variant: productVariantId,
        quantity
    })

    return res.data
}

// ➖ Remove item (quantity -1)
export async function removeFromCart(productVariantId: string,quantity: number = 1) {
    const res = await axiosClient.post('/api/carts/current/remove-item/', {
         product_variant: productVariantId,
         quantity,
    })

    return res.data;
}

// 🧹 Clear cart
export async function clearCart() {
    const res = await axiosClient.post('/api/carts/current/clear/', {})
    return res.data;
}