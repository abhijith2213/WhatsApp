import axios from "../axiosConfig/axios";

export const getNewToken = async (token) => {
  try {
    const res = await axios.post("/refresh", { token: token });
    console.log(res, "resllllllll");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
