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

const PaginationComponent = ({
  data,
  path,
  query,
}: {
  data: PaginationType;
  query: string;
  path: string;
}) => {
  if (!data.pageCount) return null;
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

  const exceptPage = () => {
    const url = new URLSearchParams(query);
    url.delete("page");
    return url.toString();
  };

  return (
    <Pagination>
      <PaginationContent>
        {data.prev && (
          <PaginationItem>
            <PaginationPrevious
              href={
                !!query
                  ? `${path}?${exceptPage()}&page=${data.prev}`
                  : `${path}?page=${data.prev}`
              }
            />
          </PaginationItem>
        )}
        {pageNumbers.map((number, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={
                !!query
                  ? `${path}?${exceptPage()}&page=${number}`
                  : `${path}?page=${number}`
              }
              isActive={data.page === number}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {data.pageCount > 10 && data.page < data.pageCount - 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {data.pageCount > 10 && (
          <PaginationItem>
            <PaginationLink
              href={
                !!query
                  ? `${path}${exceptPage()}&page=${data.pageCount}`
                  : `${path}?page=${data.pageCount}`
              }
              isActive={data.page === data.pageCount}
            >
              {data.pageCount}
            </PaginationLink>
          </PaginationItem>
        )}
        {data.next && (
          <PaginationItem>
            <PaginationNext
              href={
                !!query
                  ? `${path}?${exceptPage()}&page=${data.next}`
                  : `${path}?page=${data.next}`
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
