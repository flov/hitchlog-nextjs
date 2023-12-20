import React, { FC } from 'react';

import { Pagination as FlowPagination } from 'flowbite-react';

type PaginationProps = {
  currentPage: number;
  layout?: 'navigation' | 'pagination' | 'table';
  onPageChange: (page: number) => void;
  totalPages: number;
};

export const Pagination: FC<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
}) => {
  return (
    <div className="flex justify-center my-4">
      <FlowPagination
        onPageChange={onPageChange}
        currentPage={currentPage}
        showIcons={true}
        layout="pagination"
        totalPages={totalPages}
      />
    </div>
  );
};
