"use client";

import React, { FormEvent, use, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import ProfileSvgs from "@/components/tools/ProfileSvgs";
import Link from "next/link";
import { getCookie } from "cookies-next";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useUserDataContext } from "../../userDataProvider";
import socket from "@/app/socket";
import { set } from "date-fns";
import { io } from "socket.io-client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";


interface Props {
  styles: string;
  title: string;
  link: string;
}

const ProfileTabs: React.FC<Props> = ({ title, link, styles }) => {
  const pathname = usePathname();
  useEffect(() => {}, [pathname]);
  return (
    <div className={styles}>
      {pathname === link ? (
        <div className=" text-primary-pink-300 flex space-x-3 pb-4 duration-300">
          <ProfileSvgs SvgColor="#FF1382" SvgName={title} />
          <p className=" pt-1 font-Heading text-2xl tracking-widest ">
            {title}
          </p>
        </div>
      ) : (
        <div className=" text-white flex space-x-3 pb-4 hover:text-primary-pink-300 duration-300">
          <ProfileSvgs SvgColor="#fff" SvgName={title} />
          <p className=" pt-1 font-Heading text-2xl tracking-widest ">
            {title}
          </p>
        </div>
      )}
    </div>
  );
};

interface ToggleTextButtonProps {
  initialText: string;
  newText: string;
  styles: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const User = useParams().username;
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserID, setCurrentUserID] = useState<number>(0);
  const Data = useUserDataContext();
  const userData = Data?.user ;
  // const userData = useAppSelector((state) => state.userDataReducer.value)
  const token = getCookie("accessToken");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUsername(user.username)
        setCurrentUserID(user.id)
      }
      // setCurrentUsername(jwt.decode(token).username);
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])

  // console.log(userData);
  const isPrivate = !userData?.privacy;
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isClicked, setIsClicked] = React.useState(true);
  const [receiver, setReceiverUsername] = useState("");

  // socket.on("checkFriend" , (data) => {
  //   console.log(data);
  // })

  const [check, setCheck] = useState<any>(null);

  useEffect(() => {
    socket.on("ispending", (data) => {
      if (!data) {
        console.log("data = ", data)
        setIsPending(false)
      }
      else {
        setReceiverUsername(data.receiver_username);
        setIsPending(data.state);
        console.log("state = ", isPending)
      }
    })
  },[socket])
  socket.emit("checkPending", { userID: currentUserID, recipientID: userData?.id });

  

  const SetButtonText: React.FC<ToggleTextButtonProps> =  ( {initialText, newText, styles} ) => {
    const buttonText = isClicked ?  initialText : newText;
    return (
      <button
      onClick={handleAddFriend}
      className={styles}
    >
      {buttonText}
    </button>
    )
  }

  const handleAddFriend = () => {
    if (isClicked) {
      console.log("send Friend Request");
      socket.emit("sendFriendRequest", { userID: currentUserID, recipientID: Data?.user?.id });
    } else {
      socket.emit("Unfriend", { userID: currentUserID, recipientID: userData?.id });
      // console.log("socket " + socket.id);
    }
    setIsClicked(!isClicked);
  };
  return (
    <div className=" bg-[url('/neon-background2.jpeg')] bg-cover bg-center bg-no-repeat h-screen overflow-y-scroll no-scrollbar w-full">
        <div className=" 2xl:mt-[270px] lg:mt-[160px] mt-[50px] min-w-[400px] overflow-y-scroll w-full h-[75vh] no-scrollbar ">
          <div className=" grid grid-cols-1 2xl:grid-cols-3 mb-10">
            {isPrivate && !isFriend && (userData?.username !== currentUsername)  ?  (
              <div className=" 2xl:order-1 order-2 col-span-2  p-20">
                <div className=" flex items-center place-content-center glass w-full 2xl:h-full">
                  <h1 className=" text-3xl font-Heading text-white tracking-wider">
                    This account is Private
                  </h1>
                </div>
              </div>
            ) : (
              <div className=" h-auto 2xl:order-1 order-2 col-span-2 lg:mx-20 px-2 min-w-[400px]">
                {children}
              </div>
            )}
            <div className=" animate-fade-up mt-20 lg:mt-0 order-1 flex place-content-center">
              <div className="  bg-[#321B38]/[0.7] shadow-2xl rounded-2xl w-[85%]">
                <div className=" 2xl:mb-0 mt-[50px] grid place-content-center ">
                  <div className=" w-[150px] h-[150px] border-4 border-primary-pink-300 rounded-full">
                    <img
                      src={userData?.avatar_url}
                      alt="avatar"
                      className=" whandleAddFriend-full h-full rounded-full"
                    />
                  </div>
                  <div className=" text-center pt-4 space-y-2 font-Heading tracking-wider">
                    <p className=" text-3xl text-white overflow-hidden text-ellipsis ">{User}</p>
                  </div>
                </div>
                <div className=" grid place-items-center">
                  {userData?.Bio ? (
                  <div className="  bg-[#411941]/[0.8]  shadow-xl overflow-hidden whitespace-wrap mt-5 w-[75%] h-auto rounded-xl">
                    {/* max 180 character */}
                    <p className=" shadow-none text-white text-center font-Heading text-xl leading-9 tracking-normal p-5 ">{userData?.Bio}</p>
                  </div>

                  ) : ("")}
                  {isPrivate && !isFriend && (userData?.username !== currentUsername) ? (
                    <div className=" bg-[#411941]/[0.8]  shadow-xl overflow-hidden whitespace-wrap mt-10 w-[75%] rounded-xl mb-10">
                      <div className=" grid place-items-center items-center  h-[200px]">
                        <img
                          src="/eye.png"
                          width={50}
                          height={50}
                          alt="private"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className=" bg-[#411941]/[0.8]  shadow-xl mb-5 overflow-hidden whitespace-wrap mt-10 w-[75%] rounded-xl">
                      <div className=" px-14 pt-4 cursor-pointer">
                        <Link href={`/users/${User}`}>
                          <ProfileTabs
                            link={`/users/${User}`}
                            styles="animate-fade-right animate-delay-[150ms]"
                            title="Overview"
                          />
                        </Link>
                        {/* /* if current user is the same as the user in the url then show the settings tab */}
                        {currentUsername === User ? (
                          <Link href={`/users/${User}/settings`}>
                            <ProfileTabs
                              link={`/users/${User}/settings`}
                              styles="animate-fade-right animate-delay-[350ms]"
                              title="Settings"
                            />
                          </Link>
                        ) : (
                          ""
                        )}
                        <Link href={`/users/${User}/friends`}>
                          <ProfileTabs
                            link={`/users/${User}/friends`}
                            styles="animate-fade-right animate-delay-[550ms]"
                            title="Friends"
                          />
                        </Link>
                        <Link href={`/users/${User}/groups`}>
                          <ProfileTabs
                            link={`/users/${User}/groups`}
                            styles="animate-fade-right animate-delay-[750ms]"
                            title="Channels"
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                  { currentUsername !== User && !isFriend && (
                    <div className=" mt-10 mb-5 ">
                      {isPending && currentUsername === receiver ? (
                        <div className=" flex space-x-2">
                          <div><XMarkIcon className=" h-7 w-7 text-red-600"/> </div>
                          <div><CheckIcon className=" h-7 w-7 text-green-400"/></div>
                        </div>
                      ) : (
                        <>
                          {isPending && currentUsername !== receiver ? (
                            <>
                             {isClicked ? (
                              <button
                                className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                onClick={handleAddFriend}
                              >
                                Add Friend
                              </button>
                             ) : (
                              <button
                                className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                onClick={handleAddFriend}
                              >
                                Cancel Request
                              </button>
                             )}
                            </>
                            // <button
                            //   onClick={handleAddFriend}
                            //   className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                            // >
                            //   {isClicked ? (
                            //     <p>Add friend</p>
                            //     ) : (
                            //       <p>Cancel Request</p>
                            //   )}

                            // </button>
                          ) : (
                            <>
                              {isClicked && !isPending ? (
                              <button
                                className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                onClick={handleAddFriend}
                              >
                                Add friend
                              </button>
                             ) : (
                               <button
                               className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                               onClick={handleAddFriend}
                               >
                                cancel Request
                              </button>
                             )}
                            </>
                            // <button
                            //   onClick={handleAddFriend}
                            //   className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                            // >
                            //   {isClicked  ? (
                            //     <p>Add friend</p>
                            //     ) : (
                            //     <p>Cancel Request</p>
                            //     )}
                            // </button>
                          ) }
                        </>
                      )}
                    </div>
                  )}
                  { currentUsername !== User && isFriend ? (
                    <div className=" mt-20 flex space-x-5">
                      <SetButtonText styles="text-white font-Bomb text-xl px-5 pt-2 pb-1 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300 w-[135px]" initialText="Friends" newText="Add Friend" />
                      <button className=" text-white font-Bomb text-xl px-5 pt-3 pb-2 rounded-2xl bg-[#AF0D63] hover:text-gray-100 hover:bg-[#cd237e] shadow-inner duration-300 w-[135px]">
                        Message
                      </button>
                    </div>
                  ) : ("")}
                </div>
              </div>
            </div>
          </div>
          {/* <UserCard /> */}
        </div>
      </div>
  );
}