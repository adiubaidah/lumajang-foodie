"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ReviewMenu from "./components/review-menu";
import ReviewPlace from "./components/review-place";
import { cn } from "~/lib/utils";
function Review() {
  return (
    <>
      <h3 className="font-helvetica text-2xl font-medium">Ulasan</h3>
      <Tabs defaultValue="place">
        <TabsList className="my-5 flex w-fit items-center gap-x-3 bg-transparent">
          <TabsTrigger
            value="place"
            className={cn(
              "data-[state=active]:bg-puce data-[state=active]:text-white",
              "rounded-md font-light tracking-wider text-puce",
            )}
          >
            Pengikut
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className={cn(
              "data-[state=active]:bg-puce data-[state=active]:text-white",
              "rounded-md font-light tracking-wider text-puce",
            )}
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
    </>
  );
}

export default Review;
