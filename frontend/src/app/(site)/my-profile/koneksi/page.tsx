"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Follower from "./components/follower";
import Following from "./components/following";
import { cn } from "~/lib/utils";
function Conenction() {
  return (
    <>
      <h3 className="font-helvetica text-2xl font-medium">Koneksi</h3>
      <Tabs defaultValue="follower">
        <TabsList className="my-5 flex w-fit items-center gap-x-3 bg-transparent">
          <TabsTrigger
            value="follower"
            className={cn(
              "data-[state=active]:bg-puce data-[state=active]:text-white",
              "rounded-md font-light tracking-wider text-puce",
            )}
          >
            Pengikut
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className={cn(
              "data-[state=active]:bg-puce data-[state=active]:text-white",
              "rounded-md font-light tracking-wider text-puce",
            )}
          >
            Mengikuti
          </TabsTrigger>
        </TabsList>
        <TabsContent value="follower">
          <Follower />
        </TabsContent>
        <TabsContent value="following">
          <Following />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Conenction;
