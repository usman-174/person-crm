"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
interface SearchBarProps {
  query?: string;
  handleSelect: (e: string, x: any) => void;
  placeholder?: string;
}
const SearchBar = ({ placeholder, handleSelect }: SearchBarProps) => {
  const searchParams = useSearchParams();

  const [input, setInput] = React.useState(searchParams.get("query") || "");

  return (
    <div className="flex items-center">
      <Input
        type="text"
        placeholder={placeholder || "Search ..."}
        className=" w-full md:w-72" // Adjust margin-right to create space between input and button
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button
        // className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
        onClick={() => handleSelect(input!, "query")}
      >
        <SearchIcon className="h-5 w-5" /> {/* Render the search icon */}
      </Button>
    </div>
  );
};

export default SearchBar;
