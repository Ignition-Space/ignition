import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { assign, pick, values } from 'lodash';

/**
 * 把用户的已关注的项目，标记到列表里
 */
export async function addUserStarProjectStatusToList(
  user: IPayloadUser,
  projectList: Project[],
  projectService: ProjectService,
) {
  let newList = projectList;

  const projectIds = projectList.map((p) => p.id);
  const userStarProjectList = await projectService.getStarProjectListByIds(
    projectIds,
    user,
  );
  if (Array.isArray(userStarProjectList) && userStarProjectList.length > 0) {
    const starProjectIds = userStarProjectList.map((item) => item.projectId);
    newList = projectList.map((project) => {
      if (starProjectIds.includes(project.id)) {
        project['stared'] = true;
      } else {
        project['stared'] = false;
      }
      return project;
    });
  }

  return newList;
}

export const transformProjectToJob = (project: Partial<Project>) => {
  if (!project) return null;
  const transform = {
    id: { fid: String(project.id) },
    usName: { fjobName: project.usName },
    gitProjectId: { fgitlabProjectId: project.gitProjectId },
    gitProjectUrl: { fgitlabUrl: project.gitProjectUrl },
    gitProjectName: { gitProjectName: project.gitProjectName },
    gitProjectDesc: { gitProjectDesc: project.gitProjectDesc },
    gitNamespace: { gitNamespace: project.gitNamespace },
    desc: { fremark: project.desc },
    createTime: {
      fcreateTime: project.createTime
        ? new Date(project.createTime)
        : project.createTime,
    },
    creatorId: { feid: project.creatorId },
    creatorName: { fcreateUser: project.creatorName },
    zhName: { zhName: project.zhName },
    deployConfig: { deployConfig: project.deployConfig },
    nacosConfig: { nacosConfig: project.nacosConfig },
    lastIterationVersion: {
      lastIterationVersion: project.lastIterationVersion,
    },
    projectTypes: { projectTypes: project.projectTypes },
    secretToken: { secretToken: project.secretToken },
    appId: { appId: project.appId },
    status: { status: project.status },
    chatIds: { chatIds: project.chatIds },
    microserviceIds: { microserviceIds: project.microserviceIds },
  };
  return assign(
    { appType: 'web' },
    ...values(pick(transform, Object.keys(project))),
  );
};
