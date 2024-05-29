import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ReviewMenu from "./fragments/review-menu";
import ReviewPlace from "./fragments/review-place";
function Review() {
  return (
    <Tabs className="px-2" defaultValue="place">
      <TabsList>
        <TabsTrigger value="place">Tempat Makan</TabsTrigger>
        <TabsTrigger value="menu">Makanan</TabsTrigger>
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
