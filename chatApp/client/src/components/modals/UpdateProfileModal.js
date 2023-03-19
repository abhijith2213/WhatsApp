import React from "react";

export default function UpdateProfileModal({
  setModal,
  showImage,
  handleNewProfilePic,
  setProfilePic
}) {

  const handleClose =()=>{
    setProfilePic('')
    setModal(false)
  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-lg">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full dark:bg-[#111a21]  outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold dark:text-gray-300 mx-10">Update Profile Picture</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleClose}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative px-6 flex gap-2 items-center justify-center p-6">
              <img className="rounded-full w-52 h-52" src={showImage} alt="new image" />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end px-6 py-2 border-t border-solid  rounded-b">
              <button
                className="text-blue-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleNewProfilePic}
              >
                Update 
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
