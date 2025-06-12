// Helper for windowed pagination
export function getPaginationWindow(page: number, totalPages: number) {
  const windowSize = 5;
  let pages: (number | string)[] = [];
  if (totalPages <= windowSize) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (page >= totalPages - 2) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  }
  return pages;
} 