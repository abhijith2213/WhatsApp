import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import jwt_decode from "jwt-decode";
import loginBg from "../../assets/images/loginBG.png";
import { postLogin } from "../../apis/userApis";
import { UserContext } from "../../context/UserDetailsProvider";

const schema = yup.object({
  phone: yup
    .string()
    .required()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Provide a valid phone number"
    ),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/,
      "Password must be combination of letters and numbers only & in between 8 - 15 letters"
    ),
});
export default function Login() {
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    console.log(formData, "op");
    try {
      const { data } = await postLogin(formData);
      console.log(data, "data login");
      if(data.accessToken){
        const decoded = jwt_decode(data?.accessToken)
        setUser(decoded.id)
        localStorage.setItem('accessToken',data?.accessToken)
        localStorage.setItem('refreshToken',data?.refreshToken)
        localStorage.setItem('user',JSON.stringify(decoded.id))
        navigate('/')
      }
    } catch (error) {
      if (error?.response?.status === 401 || 404) {
        setError(error?.response?.data?.message);
      }
      console.log(error);
    }
  };
  return (
    <div className=" w-full lg:h-screen  dark:bg-[#081229]">
      <section className="">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img src={loginBg} className="w-full" alt="loginBg" />
          </div>
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 min-h-full">
            <h2 className="mb-10 dark:text-white">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mb-6" data-te-input-wrapper-init>
                <label
                  htmlFor="exampleFormControlInput2"
                  className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                  id="exampleFormControlInput2"
                  placeholder="phone number"
                  {...register("phone")}
                />
                <p className="mb-4 ml-2 text-red-400 text-sm">
                  {errors.phone?.message}
                </p>
              </div>

              <div className="relative mb-6" data-te-input-wrapper-init>
                <label
                  htmlFor="exampleFormControlInput22"
                  className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                  id="exampleFormControlInput22"
                  placeholder="Password"
                  {...register("password")}
                />
                <p className="mb-4 ml-2 text-red-400 text-sm">
                  {errors.password?.message}
                </p>
              </div>

              <div className="text-center lg:text-left flex flex-col items-start pt-3 mb-4">
                <div>
                  <button
                    type="submit"
                    className="inline-block rounded bg-[#25D366] px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                  >
                    Login
                  </button>
                  {error ? (
                    <p className="inline p-0 mt-2 mb-0 ml-4 text-red-400">
                      {error}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <p className="mt-2 mb-0 pt-1 text-sm font-semibold dark:text-white">
                  Don't have an account?
                  <Link className="no-underline" to={"/create"}>
                    <span className="text-blue-400  ml-2 transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700">
                      Register
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
