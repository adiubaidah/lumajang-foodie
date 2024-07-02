"use client"
import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { Role } from "~/constant";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext({
  user: {
    id: "",
    email: "",
    role: Role[1],
    name: "",
    image: "",
  },
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const user = (await axiosInstance.post("/auth/is-auth")).data;
      if(user.isAuth === false) return null;
      user.image = user.image ? imageFromBackend(
        user.image,
      ): "/assets/avatar.png";
      return user;
    },
    retry: false,
  });

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;
