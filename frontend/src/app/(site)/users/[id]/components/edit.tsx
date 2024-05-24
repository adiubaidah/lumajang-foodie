import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "~/components/ui/form";
import { userSchema } from "~/schema";
import { axiosInstance } from "~/lib/utils";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import React from "react";

const editSchema = userSchema.pick({
  description: true,
  email: true,
  gender: true,
  isPrivate: true,
  name: true,
});

type Edit = z.infer<typeof editSchema>;
interface EditProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Edit({ isOpen, setIsOpen }: EditProps) {
  const form = useForm<Edit>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      description: "",
      email: "",
      gender: undefined,
      isPrivate: false,
      name: "",
    },
  });
  const userMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.put("/").then((data) => data.data);
    },
  });

  const onSubmit = (values: Edit)=> {

  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Edit;
