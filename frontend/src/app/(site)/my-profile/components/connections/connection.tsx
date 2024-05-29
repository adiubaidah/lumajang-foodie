import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Follower from "./fragments/follower";
import Following from "./fragments/following";
function Conenction() {
  return (
    <Tabs className="px-2" defaultValue="follower">
      <TabsList>
        <TabsTrigger value="follower">Pengikut</TabsTrigger>
        <TabsTrigger value="following">Mengikuti</TabsTrigger>
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
