"use client"
import { cn } from "~/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ReviewMenu from "./ulasan/components/review-menu";
import ReviewPlace from "./ulasan/components/review-place";
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
            Tempat Makan
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className={cn(
              "data-[state=active]:bg-puce data-[state=active]:text-white",
              "rounded-md font-light tracking-wider text-puce",
            )}
          >
            Menu
          </TabsTrigger>
        </TabsList>
        <TabsContent value="place">
          {/* <ReviewPlace /> */}
        </TabsContent>
        <TabsContent value="menu">
          {/* <ReviewMenu /> */}
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Review;
