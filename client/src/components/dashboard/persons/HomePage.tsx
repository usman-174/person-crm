"use client";
import { PERSON } from "@/types/COMMON";
import React, { useState } from "react";
import PersonCard from "./PersonCard";
import ReactPaginate from "react-paginate";
type props = {
  persons: PERSON[];
};

const HomePage = ({ persons }: props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // Adjust this number as needed

  // Calculate the current items to display based on pagination
  const offset = currentPage * itemsPerPage;
  const currentPersons = persons.slice(offset, offset + itemsPerPage);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 justify-items-stretch sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-auto">
        {currentPersons?.map((person, i) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
      <div className="mt-4">
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(persons.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default HomePage;
