"use client";
import { useQuery } from "@tanstack/react-query";
import { cn, imageFromBackend } from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { useUser } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
import { User } from "~/types";
import { Button } from "~/components/ui/button";
function Client() {
  const user = useUser();
  const { data: dataUser } = useQuery<User>({
    queryKey: ["user", user.id],
    queryFn: async () => {
      return axiosInstance.get(`/user/${user.id}`).then((data) => data.data);
    },
    enabled: !!user.id,
  });
  return (
    dataUser && (
      <div>
        <div
          className={cn(
            "relative flex items-center justify-between",
            `bg-[url('${imageFromBackend(
              dataUser.backgroundImage ?? "public/img/place/default.PNG"
            )}')]`
          )}
        >
          <div>
            <SkeletonImage
              src={imageFromBackend(
                dataUser.image ?? "public/img/user/default.png"
              )}
              className="rounded-full border-2"
              alt={dataUser.name}
              width={400}
              height={400}
            />
          </div>
          <div>
            <Button>Edit Profil</Button>
            <div className="flex">
              <div className="border-r-2">
                <span>0</span>
                <p>Ulasan</p>
              </div>
              <div>
                <span>0</span>
                <p>Pengikut</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Client;
