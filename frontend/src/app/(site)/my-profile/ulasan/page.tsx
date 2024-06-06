"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ReviewMenu from "./components/review-menu";
import ReviewPlace from "./components/review-place";
import { cn } from "~/lib/utils";
function Review() {
  return (
    <Tabs className="px-2" defaultValue="place">
          <TabsList className="flex items-center gap-x-3 my-5 bg-transparent w-fit">
        <TabsTrigger
          value="place"
          className={cn("data-[state=active]:bg-puce data-[state=active]:text-white", 'text-puce rounded-md font-light tracking-wider')}
        >
          Pengikut
        </TabsTrigger>
        <TabsTrigger
          value="menu"
          className={cn("data-[state=active]:bg-puce data-[state=active]:text-white", 'text-puce rounded-md font-light tracking-wider')}
        >
          Mengikuti
        </TabsTrigger>
      </TabsList>
      <TabsContent value="place">
        <ReviewPlace />
      </TabsContent>
      <TabsContent value="menu">
        <ReviewMenu />
      </TabsContent>
    </Tabs>
  );
}

export default Review;
