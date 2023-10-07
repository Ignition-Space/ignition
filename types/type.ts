export class PaginationParams {
  currentPage: number;
  pageSize: number;
}

export type Payload = {
  status?: number;
  gitAccessToken: string;
  gitUserId: number;
  userId: number;
  username: string;
  name: string;
  email: string;
  feishuAccessToken: string;
  feishuUserId: string;
  department?: string;
  departmentId?: string;
};
