import { useMemo } from "react";

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return Array.from(
        {
          length: totalPageCount,
        },
        (_, idx) => idx + 1
      );
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [
        ...Array.from({ length: 3 + 2 * siblingCount }, (_, idx) => idx + 1),
        "...",
        totalPageCount,
      ];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [
        ...Array.from(
          { length: 3 + 2 * siblingCount },
          (_, idx) => totalPageCount - (3 + 2 * siblingCount) + idx + 1
        ),
      ];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        "...",
        ...Array.from(
          {
            length: rightSiblingIndex + 1,
          },
          (_, idx) => leftSiblingIndex + idx
        ),
        "...",
        totalPageCount,
      ];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);
  return paginationRange;
};
