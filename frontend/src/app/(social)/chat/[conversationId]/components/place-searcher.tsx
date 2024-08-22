import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Home } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "~/components/ui/command";
import { CommandLoading } from "cmdk";
import { axiosInstance } from "~/lib/utils";
import { Input } from "~/components/ui/input";

function PlaceSearcher({ handleSubmit }: { handleSubmit: (placeId: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["places", null, "", query, "", ""],
    queryFn: async () => {
      return (await axiosInstance.get(`/place?q=${query}`)).data;
    },
  });

  const handleInputChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    500,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Home />
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput onChangeCapture={handleInputChange} />
          <CommandList>
            {isLoading ? (
              <CommandLoading>Mengambil data</CommandLoading>
            ) : (
              data.result && data.result.map((place: any) => (
                <CommandItem key={place._id.$oid} value={place._id.$oid} onSelect={(value)=> {
                  handleSubmit(value);
                  setOpen(false);
                }}> 
                    {place.name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default PlaceSearcher;
