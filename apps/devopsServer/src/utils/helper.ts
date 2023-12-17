export const getIOS8601Time = () => {
  return new Date().toISOString();
};

export const getBranchPrefix = (
  projectType: string,
  multiBranch: boolean,
  projectTypes: string[],
) => {
  let prefix = '';
  // 多分支管理的条件
  if (projectType === 'rn' && multiBranch && projectTypes.length > 1) {
    prefix = 'rn/';
  }
  return prefix;
};
