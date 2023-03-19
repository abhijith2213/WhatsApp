import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
export default function UserStructure() {
  return (
    <section className="">
      <Navbar />
      <Outlet />
    </section>
  );
}
