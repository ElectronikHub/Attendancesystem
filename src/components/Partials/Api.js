import axios from "axios";

const api = axios.create({
    baseURL: "https://api.ehub.ph", // Your hosted PHP backend domain (no trailing slash)
    withCredentials: true, // Allows sending cookies/auth if needed
    headers: {
        "Content-Type": "application/json",
    },
});

export { api };
