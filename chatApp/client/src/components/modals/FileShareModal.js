import React from "react";
import Buttons from "../commonButton/Buttons";
import { MdSend } from "react-icons/md";

export default function FileShareModal({ setModal, showImage, setImage, handleImageSend }) {
  return (
    <>
      <div className="justify-center w-full items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative  my-6 mx-auto max-w-lg w-1/2">
          {/*content*/}
          <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full dark:bg-[#111a21]  outline-none focus:outline-none">
            {/*body*/}
            <div className="relative px-6 flex gap-2 items-center max-w-screen justify-center p-6">
              <img
                className="w-1/2 h-64 object-fill"
                src={showImage}
                alt="new-image"
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end px-6 py-2 border-t border-solid  rounded-b">
              <button
                className="text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <Buttons
                icon={<MdSend />}
                onClick={handleImageSend}
                className="bg-green-500 text-white text-xl active:bg-green-600 font-bold uppercase  px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
