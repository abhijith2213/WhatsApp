import React, { useContext, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiPencil } from "react-icons/hi";
import { MdCameraAlt } from "react-icons/md";
import UpdateProfileModal from "../modals/UpdateProfileModal";
import { UserContext } from "../../context/UserDetailsProvider";
import { setProfilePicture } from "../../apis/userApis";

export default function Profile({ setProfile }) {
  const [profilePic, setProfilePic] = useState("");
  const [modal, setModal] = useState(false);
  const [showImage, setShowImage] = useState("");
  const { user, setUser } = useContext(UserContext);
  const PF = process.env.REACT_APP_IMAGE_URL;

  const handleImage = (e) => {
    console.log("handle image called");
    setShowImage(URL.createObjectURL(e.target.files[0]));
    setProfilePic(e.target.files[0]);
    setModal(true);
  };

  const handleNewProfilePic = async (e) => {
    console.log("handle profile pic called");
    setModal(false);
    let datas;
    if (profilePic) {
      datas = new FormData();
      datas.append("file", profilePic);
      try {
        const { data } = await setProfilePicture(datas);
        console.log(data, "oooo data");
        alert(data.message);
        setUser(data?.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        /* -------------------------- //add context update -------------------------- */
      } catch (error) {
        console.log(error);
        if (
          error?.response?.data ===
          "Only support jpg, jpeg, png, webp file Types"
        ) {
          alert(error?.response?.data);
        }
      }
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center bg-[#202d33] h-[160px] p-3">
        {/* Profile picture */}
        <IoMdArrowRoundBack
          className="dark:text-white text-3xl cursor-pointer"
          onClick={() => setProfile(false)}
        />
        <h4 className="dark:text-white m-0">Profile</h4>
      </div>

      <div className="flex items-center justify-center mt-12">
        <p className="relative m-0 w-[220px] h-[220px]  group">
          <img
            className="absolute inset-0  rounded-full w-full h-full group-hover:opacity-50"
            src={PF + user?.profile}
          />
          <div className="relative p-5">
            <div
              className="transition-all transform 
                        translate-y-8 opacity-5  group-hover:opacity-100 group-hover:translate-y-0"
            >
              <div className="flex flex-col items-center">
                <p className=" text-white text-lg m-0 inline-block text-center">
                  update profilePic
                </p>
                <label htmlFor="profilePic" className=" cursor-pointer">
                  <MdCameraAlt className=" rounded-md text-white font-medium text-3xl   cursor-pointer" />
                </label>
                <input
                  type="file"
                  name="profile"
                  hidden
                  id="profilePic"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>
            </div>
          </div>
        </p>
      </div>

      <div className="dark:bg-[#202d33] flex flex-col px-5 mt-4">
        <div className="mt-2">
          <h5 className="text-[#128c7e]">Your Name</h5>
        </div>
        <div className="mb-4 flex justify-between">
          <p className="dark:text-gray-400 text-lg">{user?.name}</p>
          <HiPencil className="dark:text-gray-400 text-xl cursor-pointer" />
        </div>
      </div>
      <div className="mx-5 my-3">
        <p className="text-gray-400">
          This is not your username or pin. This name will be visible to your
          whatsapp contacts
        </p>
      </div>
      <div className="dark:bg-[#202d33] flex flex-col px-5 mt-4">
        <div className="mt-2">
          <h5 className="text-[#128c7e]">Your Phone</h5>
        </div>
        <div className="mb-4 flex justify-between">
          <p className="dark:text-gray-400 text-lg">{user?.phone}</p>
        </div>
      </div>

      {/* Chats */}
      <div className="flex flex-col overflow-y-scroll cursor-pointer h-100"></div>
      {modal ? (
        <UpdateProfileModal
          setModal={setModal}
          showImage={showImage}
          handleNewProfilePic={handleNewProfilePic}
          setProfilePic={setProfilePic}
        />
      ) : (
        ""
      )}
    </>
  );
}
