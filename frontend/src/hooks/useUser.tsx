import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { axiosInstance } from "~/lib/utils";
import { Role } from "~/constant";

const UserContext = createContext({
  id: "",
  email: "",
  role: Role[1],
  name: "",
  image: "",
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    role: Role[1],
    name: "",
    image: "",  
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axiosInstance
          .post("/auth/is-auth")
          .then((data) => data.data);
        setUser(result);
      } catch (err) {
        setUser({email: '', id: '', image: '', role: "foodie", name: ''})
      }
    };
    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
const useUser = () => {
  return useContext(UserContext);
};
export default useUser;
