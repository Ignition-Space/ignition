export interface CreateApprovalParams {
  approval_code: string;
  user_id: string;
  form: string;
}

export interface GetApprovalDefinedParams {
  approval_code: string;
}

export interface GetApprovalInstanceParams {
  instance_code: string;
  user_id?: string;
  open_id?: string;
}
