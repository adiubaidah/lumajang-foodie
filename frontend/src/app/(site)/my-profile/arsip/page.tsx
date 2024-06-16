"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ArchiveMenu from "./components/archive-menu";
import ArchivePlace from "./components/archive-place";
import { cn } from "~/lib/utils";
function Archive() {
  return (
    <>
      <h3 className="font-helvetica text-2xl font-medium">Arsip</h3>
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
          <ArchivePlace />
        </TabsContent>
        <TabsContent value="menu">
          <ArchiveMenu />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Archive;
