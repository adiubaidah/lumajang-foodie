"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Follower from "./components/follower";
import Following from "./components/following";
import { cn } from "~/lib/utils";
function Conenction() {
  return (
    <Tabs className="w-full px-2  md:px-8" defaultValue="follower">
      <h3 className="font-helvetica text-2xl font-medium">Koneksi</h3>
      <TabsList className="flex items-center gap-x-3 my-5 bg-transparent w-fit">
        <TabsTrigger
          value="follower"
          className={cn("data-[state=active]:bg-puce data-[state=active]:text-white", 'text-puce rounded-md font-light tracking-wider')}
        >
          Pengikut
        </TabsTrigger>
        <TabsTrigger
          value="following"
          className={cn("data-[state=active]:bg-puce data-[state=active]:text-white", 'text-puce rounded-md font-light tracking-wider')}
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
  );
}

export default Conenction;
