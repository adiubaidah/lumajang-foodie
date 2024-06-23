"use client";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function SearchInput() {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const search = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("q", inputValue); // Set or update the "q" parameter
    const queryString = newSearchParams.toString();
    if (path !== "/tempat-makan" && path !== "/menu") {
      const targetPath = `/tempat-makan?${queryString}`;
      router.push(targetPath);
    } else {
      const updatedPath = `${path}?${queryString}`;
      router.replace(updatedPath);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex w-full max-w-lg items-center space-x-3 rounded-lg bg-white px-2 py-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <Search />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Cari makanan atau tempat makan"
        className="w-full outline-none placeholder:font-thin placeholder:text-stroke"
      />
    </form>
  );
}

export default SearchInput;
