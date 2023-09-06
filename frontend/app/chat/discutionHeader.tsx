import React from "react";
import Image from "next/image";
import { useMyStore } from "./state";


const discutionHeader = () => {
  const {setMyBoolean , myBoolean} = useMyStore();
  return (
    <div>
      <div className="relative h-[80px] flex-shrink-0 rounded-tl-xl rounded-tr-xl rounded-br-0 rounded-bl-0 bg-[#2D0130] ">
        {/* <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        {/* <Image src="/icons.png" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        <div className="w-[50px] h-full lg:hidden">

        <button onClick={() =>setMyBoolean(!myBoolean)} type="button" className=" mx-2 rounded-2xl absolute bottom-5 left-2 hover:bg-primary-purple-100">
      <div className=" h-[40px] flex items-center">
        <svg className="w-8 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
        </svg>
      </div>
    </button>
        </div>
        <Image
          src="/avatars/avatar1.png"
          width={50}
          height={50}
          alt="pic"
          className="absolute mx-4 left-4 max-lg:left-10 bottom-4"
        />
        <h1 className=" absolute chat_text_username max-sm:text-sm max-sm:py-2 bottom-7 left-24 max-lg:left-28">
          Judith
        </h1>
        <p className=" absolute chat_text_p max-sm:text-sm bottom-3 left-24 max-lg:left-28">judith juanita</p>
      </div>
    </div>
  );
};

export default discutionHeader;