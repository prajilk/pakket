import axios from "axios";

export default axios.create({
    baseURL: process.env.URL,
    withCredentials: true,
});
