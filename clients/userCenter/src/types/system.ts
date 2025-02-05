export interface SystemItem {
  id: number;
  name: string;
  description: string;
  status: number;
  creatorName: string;
  createTime: string;
  updateName: string;
  updateTime: string;
}

export interface SystemState {
  list: SystemItem[];
  loading: boolean;
  error: string | null;
  searchInfo: {
    name?: string;
    status?: number;
  };
  modal: {
    visible: boolean;
    type: 'add' | 'edit' | 'view';
    loading: boolean;
    currentItem: SystemItem | null;
  };
}
