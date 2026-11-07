import { useState, useMemo } from "react";
import { ITEMS_PER_PAGE } from "../constant";


export function usePagination(items = [], itemsPerPage = ITEMS_PER_PAGE) {
    const [currentPage , setCurrentPage] = useState(1);

      const totalPages = Math.ceil(items.length / itemsPerPage); 

       const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const displayRange = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, items.length);
    return { start, end, total: items.length };
  }, [currentPage, itemsPerPage, items.length]);


    const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

   const resetPage = () => setCurrentPage(1);

   return {
    currentPage,
    totalPages,
    paginatedItems,
    displayRange,
    
    // Navigation
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPage,
    
    // Helpers for button states
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    showPagination: totalPages > 1,
  };
}