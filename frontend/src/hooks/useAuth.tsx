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
  id: "",
  email: "",
  role: Role[1],
  name: "",
  image: "",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const user = (await axiosInstance.post("/auth/is-auth")).data;

      user.image = imageFromBackend(
        user.image ?? "public/img/user/default.png"
      );
      return user;
    },
    staleTime: Infinity,
    retry: false,
  });

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
const useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;
