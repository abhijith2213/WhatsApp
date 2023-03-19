import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import loginBg from "../../assets/images/loginBG.png";
import { postCreate } from "../../apis/userApis";

const schema = yup.object({
  name: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      "Provide a valid name!"
    ),
  phone: yup
    .string()
    .required()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      // /^[+]{1}(?:[0-9\-\(\)\/\.]\s?){6, 15}[0-9]{1}$/,
      "Provide a valid phone number"
    ),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/,
      "Password must be combination of letters and numbers only & in between 8 - 15 letters"
    ),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

export default function Signup() {
  const [error, setError] = useState("");
  const [value, setValue] = useState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    console.log(formData, "op");
    try {
      const { data } = await postCreate(formData);
      console.log(data);
      navigate('/login')
    } catch (error) {
      if (error?.response?.status === 409) {
        setError(error?.response?.data?.message);
      }
      console.log(error);
    }
  };

  return (
    <div className=" w-full lg:h-screen dark:bg-[#081229]">
      <section className="">
        <div className="">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <img src={loginBg} className="w-full" alt="loginBg" />
            </div>
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 min-h-full">
              <h2 className="mb-10 text-teal-500 dark:text-white">
                Create Account
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative lg:mb-6" data-te-input-wrapper-init>
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                    id="exampleFormControlInput2"
                    placeholder="enter your name"
                    {...register("name")}
                  />
                  <p className="mb-4 ml-2 text-red-400 text-sm">
                    {errors.name?.message}
                  </p>
                </div>
                <div className="relative lg:mb-6" data-te-input-wrapper-init>
                  <label
                    htmlFor="exampleFormControlInput23"
                    className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                    id="exampleFormControlInput23"
                    placeholder="phone number"
                    {...register("phone")}
                  />

                  <p className="mb-4 ml-2 text-red-400 text-sm">
                    {errors.phone?.message}
                  </p>
                </div>

                <div className="relative lg:mb-6" data-te-input-wrapper-init>
                  <label
                    htmlFor="exampleFormControlInput223"
                    className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                    // className=" block min-h-[auto] w-full rounded border-b-2 lg:w-4/5 bg-transparent py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-200 dark:placeholder:text-neutral-50 placeholder:opacity-50 "
                    id="exampleFormControlInput223"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <p className="mb-4 ml-2 text-red-400 text-sm">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <label
                    htmlFor="exampleFormControlInput22"
                    className="pointer-events-none ml-3   mb-0   truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out  dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className=" block min-h-[auto] w-full rounded-md  border lg:w-4/5 bg-white py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear  dark:text-neutral-800 dark:placeholder:text-black placeholder:opacity-50 "
                    id="exampleFormControlInput22"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                  />
                  <p className="mb-4 ml-2 text-red-400 text-sm">
                    {errors.confirmPassword?.message}
                  </p>
                </div>

                <div className="text-center lg:text-left flex flex-col items-start mb-3">
                  <div>
                    {" "}
                    <button
                      type="submit"
                      className="inline-block rounded bg-[#25D366] px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      Create Account
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
                    Already have an account?
                    <Link className="no-underline " to={"/login"}>
                      {" "}
                      <span className="text-blue-400 ml-2 transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700">
                        Login
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
