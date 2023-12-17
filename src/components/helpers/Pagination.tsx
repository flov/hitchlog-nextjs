import React, { FC } from 'react';
import { Pagination } from 'flowbite-react';

type PaginationProps = {
  currentPage: number;
  layout?: string;
  onPageChange: (page: number) => void;
  showIcons?: boolean;
  totalPages: number;
  page: number;
};

export const Pagination: FC<PaginationProps> = ({
  handlePageChange,
  totalPages,
  page,
}) => {
  return (
    <div className="flex justify-center my-4">
      <Pagination
        onPageChange={handlePageChange}
        currentPage={page}
        showIcons={true}
        layout="pagination"
        totalPages={totalPages}
        page={0}
      />
    </div>
  );
};
