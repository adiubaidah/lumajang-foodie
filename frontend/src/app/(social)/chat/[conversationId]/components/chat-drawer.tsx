import React, { useState, useMemo } from "react";
import { X, Trash2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { axiosInstance } from "~/lib/utils";
import { Conversation, User } from "~/types";
import { useOtherUser, useActiveList, useConversation } from "~/hooks";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import Avatar from "../../components/avatar";
import Link from "next/link";

interface ProfileDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: Conversation & {
    users: User[];
  };
}

const ChatDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  setIsOpen,
}) => {
  const otherUser = useOtherUser(data);

  const title = useMemo(() => {
    return otherUser.name;
  }, [otherUser.name]);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    return isActive ? "Active" : "Offline";
  }, [isActive]);

  const deleteConversationMutation = useMutation({
    mutationFn: async () => {
      return (await axiosInstance.delete(`/conversation/${data.id}`)).data;
    },
    onSuccess: () => {
      toast.success("Chat deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <div className="flex h-full flex-col py-6">
            <div className="mt-6 flex-1 px-4 sm:px-6">
              <div className="flex flex-col items-center">
                <Link href={`/user-detail/${otherUser.id}`} className="block mb-2">
                  <Avatar user={otherUser} />
                </Link>
                <div>{title}</div>
                <div className="text-sm text-gray-500">{statusText}</div>
                <div className="my-8 flex gap-10">
                  <div
                    onClick={() => {
                      deleteConversationMutation.mutate();
                      setIsOpen(false);
                    }}
                    className="flex cursor-pointer flex-col items-center gap-3 hover:opacity-75"
                  >
                    <div className="dark:bg-lightgray flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:text-gray-200">
                      {deleteConversationMutation.isPending ? (
                        <Loader2 size={20} className="animate-spin"/>
                      ) : (
                        <Trash2 />
                      )}
                    </div>
                    <div className="text-sm font-light text-neutral-600">
                      {deleteConversationMutation.isPending
                        ? "Menghapus..."
                        : "Hapus"}
                    </div>
                  </div>
                </div>
                <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                  <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                        {otherUser.email}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatDrawer;
