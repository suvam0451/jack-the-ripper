import config from "../config/config"
import axios from "axios"

export const APIClient = () => axios.create({
        headers: {
        },
        baseURL: 'https://api.suvam0451.com/v1'
    });