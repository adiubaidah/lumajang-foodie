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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, data.page - 1);
    let endPage = Math.min(data.pageCount, data.page + 2);

    if (data.page > 2) {
      pageNumbers.push(
        <PaginationItem>
          <PaginationLink
            href={!!query ? `${path}?${exceptPage()}&page=1` : `${path}?page=1`}
            isActive={data.page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (data.page > 3) {
        pageNumbers.push(
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={
              !!query
                ? `${path}?${exceptPage()}&page=${i}`
                : `${path}?page=${i}`
            }
            isActive={data.page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (data.page < data.pageCount - 2) {
      if (data.page < data.pageCount - 3) {
        pageNumbers.push(
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      pageNumbers.push(
        <PaginationItem>
          <PaginationLink
            href={
              !!query
                ? `${path}?${exceptPage()}&page=${data.pageCount}`
                : `${path}?page=${data.pageCount}`
            }
            isActive={data.page === data.pageCount}
          >
            {data.pageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pageNumbers;
  };

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
        {renderPageNumbers()}
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
