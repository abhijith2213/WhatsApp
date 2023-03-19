import axios from "axios";
import jwt_decode from "jwt-decode";
import { getNewToken } from "../apis/refreshToken";

const baseUrl = process.env.REACT_APP_API_URL

const privateInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

privateInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    let currentDate = new Date();
    if (token) {
      const decodedToken = jwt_decode(token);
      console.log(decodedToken, "token dedcoded");
      if(config.data instanceof FormData){
        config.headers['Content-Type'] = 'multipart/form-data'
      }
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const refreshToken = localStorage.getItem("refreshToken") ;
        console.log(refreshToken, "token expired");
        const data = await getNewToken(refreshToken);
        config.headers["authorization"] = `Bearer ${data.accessToken}`;
        return config;
      } else {
        console.log(token, "hhhh");
        config.headers["authorization"] = `Bearer ${token}`; 
        return config;
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default privateInstance;
