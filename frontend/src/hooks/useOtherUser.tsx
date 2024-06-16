import useAuth from "./useAuth";
import { useMemo } from "react";
import { FullConversationType, User } from "~/types";


const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const {user: currentUser} = useAuth();

  const otherUser = useMemo(() => {
    const currentUserId = currentUser && currentUser.id

    const otherUser = conversation.users.filter(
      (currentUser) => currentUser.id !== currentUserId
    );

    return otherUser[0];
  }, [currentUser, conversation.users]);

  return otherUser;
};

export default useOtherUser;
