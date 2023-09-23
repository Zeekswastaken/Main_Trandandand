"use client"
import React, { useState, useEffect } from 'react';
import ChatList from './chatList';
import EmptyChatList from './emptyChatList';
import ChatContent from './chatContent';
import EmptyChatContent from './emptyChatContent';
import { getCookie } from 'cookies-next';
import { io } from 'socket.io-client';
import { SocketProvider, useSocketContext } from '../socket';
import jwt, { JwtPayload } from "jsonwebtoken";
import { useMyStore } from "./state";
import { useRouter } from 'next/navigation';


const page = () => {
  
  const {myBoolean, setToken, setCurrUserData, setMyBoolean} = useMyStore();
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserID, setCurrentUserID] = useState<number>(0);
  const router = useRouter()
  const {socket} = useSocketContext();

  // useEffect(() => {
  //   socket?.on("isjoined", (data:any) => {
  //     if (data === true){
  //       console.log("++++++++++++++++++++++++++++++++");
  //       router.refresh();
  //     }
  //   })
  // }, [socket]);
  useEffect(() => {
    setMyBoolean(false);
    const token = getCookie("accessToken");
    setToken(token);
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrUserData(user);
        setCurrentUsername(user.username)
        setCurrentUserID(user.id)
      }
      // setCurrentUsername(jwt.decode(token).username);
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  const [userFriends, setUserFriends] = useState<any>([]);
  const [userGroups, setUserGroups] = useState<any>([]);

  useEffect(() => {
      const token = getCookie("accessToken");
      socket?.emit("getFriendsWithChannels", {user: currentUsername});
      socket?.emit("getChannelsJoined", {userID: currentUserID});
      socket?.emit("getSocketId&JoinRoom", {token: token});
  }, [currentUserID]);

  useEffect(() => {
    socket?.on("getfriendswithchannels", (data:any) => {
      setUserFriends(data);
    })
    socket?.on("getchannelsjoined", (data:any) => {
      console.log(data);
      setUserGroups(data);
    })
  },[currentUsername])
  // socket?.emit("Duo", {token:token,name:'Oussama'});
  // console.log("group goes heer");
  // console.log(userGroups);
  // console.log("group goes heer");

  return (
    <div className=" w-screen h-screen mx-4 max-sm:mx-0 bg-opacity-80 shadow-md">
    <div className=" mt-[100px] h-[85%] flex gap-4 justify-center my-8 mx-20 max-xl:mx-4 max-sm:mx-0 bg-opacity-80 shadow-md rounded-3xl place-items-center"> {/* chat and friends */}
      <ChatList userFriends={userFriends} userGroups={userGroups}/>
      {myBoolean ? <ChatContent /> : <EmptyChatContent />}
    </div>
  </div>
  );
  }
  
  export default page
  