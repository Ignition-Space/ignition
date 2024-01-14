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
