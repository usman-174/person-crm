"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
}
const SearchBar = ({ setQuery, query,placeholder }: SearchBarProps) => {
  const [input, setInput] = React.useState("");
  return (
    <div className="flex items-center w-full ">
      <Input
        type="text"
        placeholder={placeholder||"Search ..."}
        className="w-full sm:w-1/2" // Adjust margin-right to create space between input and button
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button
        // className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
        onClick={() => setQuery(input)}
      >
        <SearchIcon className="h-5 w-5" /> {/* Render the search icon */}
      </Button>
    </div>
  );
};

export default SearchBar;
