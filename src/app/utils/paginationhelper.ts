type TPaginationQueryOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};
type TCalculatePaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const calculatePagination = (
  paginationQueryOptions: TPaginationQueryOptions,
): TCalculatePaginationResult => {
  const page = Number(paginationQueryOptions.page) || 1;
  const limit = Number(paginationQueryOptions.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = paginationQueryOptions.sortBy || 'id';
  const sortOrder = paginationQueryOptions.sortOrder || 'asc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelper = {
  calculatePagination,
};
