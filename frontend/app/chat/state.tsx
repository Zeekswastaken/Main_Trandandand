import { create } from "zustand";

interface MyStore {
    myBoolean: Boolean;
    currUserData:any;
    userData:any;
    token:any;
    message:string;
    getChat:any[];
    updateChat:any;
    chanelType:Boolean;
    setMyBoolean: (value: Boolean) => void;
    setCurrUserData: (data: any) => void;
    setUserData: (data: any) => void;
    setToken: (data: any) => void;
    setMessage: (data: string) => void;
    setGetChat: (data: any[]) => void;
    setUpdateChat: (data: any) => void;
    setChanelType: (value: Boolean) => void;
  }
  
  export const useMyStore = create<MyStore>((set) => ({
    myBoolean: false,
    currUserData:[],
    userData: [],
    token:"",
    message:"",
    getChat:[],
    updateChat:[],
    chanelType:false,
    setMyBoolean: (value: Boolean) => set({ myBoolean: value }),
    setCurrUserData: (data: any) => set({ currUserData: data }),
    setUserData: (data: any) => set({ userData: data }),
    setToken: (data: any) => set({ token: data }),
    setMessage: (data: string) => set({ message: data }),
    setGetChat: (data) => set({ getChat: data }),
    setUpdateChat: (data:any) => set({ updateChat: data }),
    setChanelType: (value: Boolean) => set({ chanelType: value }),
  }));