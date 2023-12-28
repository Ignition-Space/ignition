import { Injectable } from '@nestjs/common';

import {
  acceptMR,
  closeMR,
  createMR,
  getProjectMRList,
  getSingleMR,
  getSingleMRChanges,
  getSingleMRCommits,
  listOpenedMR,
  searchMR,
  deleteMR,
} from '@devopsServer/helper/gitlab/merge';

import {
  createProject,
  getProject,
  getUserProjectList,
  starProject,
  getStarredUserProjectList,
  unStarProject,
  getAllProjectList,
  getProjectUsers,
  getProjectTree,
  getProjectFiles,
  getProjectCompare,
} from '@devopsServer/helper/gitlab/project';

import {
  createBranch,
  getBranchList,
  getSingleBranch,
  delBranch,
} from '@devopsServer/helper/gitlab/branch';

import {
  GitProjectDto,
  BranchDto,
  MergeRequestDto,
  MRSearchConditionDto,
  UserDto,
  GetProjectDto,
  NamespaceDto,
  MergeRequestChangeDto,
  GetUserProjectListDto,
  GetGitAllProjectListDto,
  AutoMergeDto,
  CloseMergeDto,
  Page,
  IGitCommitsDto,
} from './repository.dto';
import {
  createPersonalAccessToken,
  getAllUsers,
  getToken,
  getTokenInfo,
  getUser,
} from '@devopsServer/helper/gitlab/user';
import { getNamespace } from '@devopsServer/helper/gitlab/namespace';
import { createTag } from '@devopsServer/helper/gitlab/tags';
import { BusinessException, GitlabHttpException } from '@app/common/index';
import {
  getGitCommits,
  getSingleGitCommits,
  getGitCommitsDiff,
  IGitCommits,
  getRepositoryCompare,
} from '@devopsServer/helper/gitlab/commits';

@Injectable()
export class RepositoryService {
  async createProject(projectDto: GitProjectDto, accessToken: string) {
    return await createProject(projectDto, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getProject(getProjectDto: GetProjectDto, accessToken: string) {
    return await getProject(getProjectDto, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getAllProjectList(
    getGitAllProjectListDto: GetGitAllProjectListDto,
    accessToken: string,
  ) {
    return await getAllProjectList(getGitAllProjectListDto, accessToken).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async getUserProjectList(
    gitUserId: number,
    searchConditions: GetUserProjectListDto,
    accessToken: string,
  ) {
    return await getUserProjectList(
      gitUserId,
      searchConditions,
      accessToken,
    ).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getProjectUsers(gitProjectId: number, accessToken: string) {
    return await getProjectUsers(gitProjectId, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async createPersonalTokenByAdmin(userId: number, tokenName: string) {
    return await createPersonalAccessToken(userId, tokenName).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getProjectTree(
    gitProjectId: number,
    accessToken: string,
    file_path: string,
  ) {
    return await getProjectTree(gitProjectId, accessToken, file_path).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async getProjectCompare(gitProjectId: number, from: string, to: string) {
    return await getProjectCompare(gitProjectId, from, to).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getProjectFiles(
    gitProjectId: number,
    accessToken: string,
    filePath: string,
  ) {
    return await getProjectFiles(gitProjectId, accessToken, filePath).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async getStarredUserProjectList(gitUserId: number, accessToken: string) {
    return await getStarredUserProjectList(gitUserId, accessToken).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async createBranch(branch: BranchDto, accessToken: string) {
    return await createBranch(branch, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async delBranch(branch: BranchDto, accessToken?: string) {
    return await delBranch(branch, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getBranchList(branch: BranchDto, accessToken: string) {
    return await getBranchList(branch, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getSingleBranch(branch: BranchDto, accessToken: string) {
    return await getSingleBranch(branch, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async createMR(mergeRequest: MergeRequestDto, accessToken: string) {
    return await createMR(mergeRequest, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getSingleMR(mergeRequest: MergeRequestDto, accessToken: string) {
    return await getSingleMR(mergeRequest, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }
  async searchMR(mrSearchCondition: MRSearchConditionDto, accessToken: string) {
    return await searchMR(mrSearchCondition, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }
  async getProjectMRList(
    mrSearchCondition: MRSearchConditionDto,
    accessToken: string,
  ) {
    return await getProjectMRList(mrSearchCondition, accessToken).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async getSingleMRChanges(
    mergeRequestChangeDto: MergeRequestChangeDto,
    accessToken: string,
  ) {
    return await getSingleMRChanges(mergeRequestChangeDto, accessToken).catch(
      (err) => {
        throw new GitlabHttpException(err);
      },
    );
  }

  async getSingleCommits(mergeRequest: MergeRequestDto, accessToken: string) {
    return await getSingleMRCommits(mergeRequest, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getGitCommitsDiff(iGitCommitsDto: IGitCommitsDto) {
    return await getGitCommitsDiff(iGitCommitsDto).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getRepositoryCompare(iGitCommitsDto: IGitCommitsDto) {
    return await getRepositoryCompare(iGitCommitsDto).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getSingleGitCommits(iGitCommitsDto: IGitCommitsDto) {
    return await getSingleGitCommits(iGitCommitsDto).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async acceptMR(mergeRequest: MergeRequestDto, accessToken: string) {
    return await acceptMR(mergeRequest, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async deleteMR(mergeRequest: MergeRequestDto, accessToken: string) {
    return await deleteMR(mergeRequest, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async tryAcceptMR(mergeRequest: MergeRequestDto, accessToken: string) {
    // 尝试完成合并
    try {
      await acceptMR(mergeRequest, accessToken);
    } catch (error) {
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 405:
            throw new BusinessException(
              '创建合并请求成功，但执行合并请求失败，请检查源分支是否落后目标分支。',
            );
          case 406:
            throw new BusinessException(
              '分支不能被自动合并，请检查分支是否有冲突',
            );
          case 401:
            throw new BusinessException('抱歉，您无代码合并权限。');
          default:
            throw new GitlabHttpException(error);
        }
      }
      throw new GitlabHttpException(error);
    }
  }

  async getUserToken(tokenDto: UserDto) {
    return await getToken(tokenDto).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getTokenInfo(accessToken: string) {
    return await getTokenInfo(accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getUser(userId: number, accessToken: string) {
    return await getUser(userId, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async create() {
    // return await getPersonalAccessUser()
  }

  async getAllUsersByAdmin(page: Page) {
    return await getAllUsers(page.per_page, page.page).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async getNamespace(namespaceDto: NamespaceDto) {
    return await getNamespace(namespaceDto).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async starProject(gitProjectId: number, accessToken: string) {
    return await starProject(gitProjectId, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async unStarProject(gitProjectId: number, accessToken: string) {
    return await unStarProject(gitProjectId, accessToken).catch((err) => {
      throw new GitlabHttpException(err);
    });
  }

  async merge(autoMergeDto: AutoMergeDto, accessToken: string) {
    try {
      // 创建合并请求
      const res = await createMR(autoMergeDto, accessToken);
      return res;
    } catch (error) {
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 409:
            throw new BusinessException(
              '创建合并请求失败，请手动合并完成后，再执行此操作',
            );
          default:
            throw new GitlabHttpException(error);
        }
      }
      throw new GitlabHttpException(error);
    }
  }

  // 自动合并
  async autoMerge(autoMergeDto: AutoMergeDto, accessToken: string) {
    let result = null;
    let iid: string = null;
    let project_id: number = null;
    // 如果存在该【源分支】到【目标分支】的合并请求，则使用该合并请求。
    try {
      const openedMRList = await listOpenedMR(
        { id: autoMergeDto.id },
        accessToken,
      );
      if (Array.isArray(openedMRList) && openedMRList.length > 0) {
        const found = openedMRList.find((mr) => {
          return (
            mr.source_branch === autoMergeDto.source_branch &&
            mr.target_branch === autoMergeDto.target_branch
          );
        });
        if (typeof found !== 'undefined') {
          iid = found.iid;
          project_id = found.project_id;
          console.log('找到已存在的合并请求');
        }
      }
    } catch (error) {
      // 不做任何事，下面继续完成 创建合并请求任务
    }

    let mergeResult: any;
    if (!iid) {
      try {
        // 创建合并请求
        mergeResult = await createMR(autoMergeDto, accessToken);
        iid = mergeResult.iid;
        project_id = mergeResult.project_id;
      } catch (error) {
        if (error.response && error.response.status) {
          switch (error.response.status) {
            case 409:
              throw new BusinessException(
                '创建合并请求失败，请手动合并完成后，再执行此操作!',
              );
            default:
              throw new GitlabHttpException(error);
          }
        }
        throw new GitlabHttpException(error);
      }
    } else {
      mergeResult = await getSingleMR(
        { id: autoMergeDto.id, merge_request_iid: iid },
        accessToken,
      );
    }
    const { changes_count, merge_status } = mergeResult;
    console.log(
      'mergeResult===>',
      mergeResult,
      merge_status,
      merge_status === 'cannot_be_merged',
    );
    if (!changes_count) {
      this.deleteMR(
        { id: autoMergeDto.id, merge_request_iid: iid },
        accessToken,
      );
      console.log('未检测到有改动，无需进行合并');
      return true;
    }

    // 尝试完成合并
    let sha: string;
    if (merge_status === 'cannot_be_merged') {
      throw new BusinessException(
        '创建合并请求成功，但自动合并请求失败，请检查源分支是否落后目标分支，解决后重新提交！',
      );
    } else {
      try {
        const { sha: hash } = await acceptMR(
          { id: project_id, merge_request_iid: iid },
          accessToken,
        );
        sha = hash;
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status) {
          switch (error.response.status) {
            case 405:
              throw new BusinessException(
                '创建合并请求成功，但执行合并请求失败，请检查源分支是否落后目标分支。',
              );
            case 406:
              throw new BusinessException(
                '分支不能被自动合并，请检查分支是否有冲突',
              );
            case 401:
              throw new BusinessException('抱歉，您无代码合并权限。');
            default:
              throw new GitlabHttpException(error);
          }
        }
        throw new GitlabHttpException(error);
      }
    }
    // 打标签
    try {
      if (autoMergeDto.withTag) {
        result = await createTag(
          {
            id: project_id,
            ref: sha,
            tag_name: autoMergeDto.tag_name,
            message: autoMergeDto.tag_message,
          },
          accessToken,
        );
        return result;
      } else {
        return mergeResult;
      }
    } catch (error) {
      throw new GitlabHttpException(error);
    }
  }

  async closeSingleMR(closeMergeDto: CloseMergeDto, accessToken: string) {
    try {
      await closeMR(closeMergeDto, accessToken);
    } catch (error) {
      throw new GitlabHttpException(error);
    }
  }

  getCommits(projectDto: IGitCommits) {
    try {
      return getGitCommits(projectDto);
    } catch (error) {
      throw new GitlabHttpException(error);
    }
  }
}
