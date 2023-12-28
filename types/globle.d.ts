declare type PaginationParams = {
  currentPage: number;
  pageSize: number;
};

declare type CustomPaginationMeta = {
  pageSize: number;
  totalCounts: number;
  totalPages: number;
  currentPage: number;
};

declare type IPayloadUser = {
  status?: number;
  gitAccessToken?: string;
  gitUserId?: number;
  userId?: number;
  username?: string;
  name: string;
  email: string;
  feishuAccessToken?: string;
  feishuUserId?: string;
  department?: string;
  departmentId?: string;
};
