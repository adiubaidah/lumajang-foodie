import { Pagination as PaginationType } from "~/types";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";
import { ChevronsLeft, ChevronRight, ChevronLeft } from "lucide-react";
import React, { SetStateAction } from "react";
import { cn } from "~/lib/utils";

const PaginationComponent = ({
  data,
  page,
  setPage,
}: {
  data: PaginationType;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (data.pageCount <= 10) {
      // Tampilkan semua nomor halaman jika jumlah halaman total 10 atau kurang
      startPage = 1;
      endPage = data.pageCount;
    } else {
      // Jika halaman saat ini kurang dari 6, maka 10 halaman dari awal.
      if (data.page < 6) {
        startPage = 1;
        endPage = 10;
      } else if (data.page + 4 >= data.pageCount) {
        startPage = data.pageCount - 9;
        endPage = data.pageCount;
      } else {
        startPage = data.page - 5;
        endPage = data.page + 4;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {data.prev && (
          <PaginationItem>
            <Button variant={"ghost"} onClick={() => setPage(page - 1)}>
              <ChevronLeft />
            </Button>
          </PaginationItem>
        )}
        {pageNumbers.map((number, index) => (
          <PaginationItem key={index}>
            <Button
              variant={number === data.page ? "default" : "ghost"}
              onClick={() => setPage(number)}
            >
              {number}
            </Button>
          </PaginationItem>
        ))}
        {data.pageCount > 10 && data.page < data.pageCount - 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {data.pageCount > 10 && (
          <PaginationItem>
            <Button>{data.pageCount}</Button>
          </PaginationItem>
        )}
        {data.next && (
          <PaginationItem>
            <Button variant={"ghost"} onClick={() => setPage(page + 1)}>
              <ChevronRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
