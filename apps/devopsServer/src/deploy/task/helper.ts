import {
  Iteration,
  updateVersionType,
} from '@devopsServer/iteration/iteration.entity';
import {
  ProcessNodes,
  PublishRules,
} from '@devopsServer/iteration/process/process.entity';
import { Project } from '@devopsServer/project/project.entity';
import { getBranchPrefix } from '@devopsServer/utils/helper';

export const validityPublishEnv = (
  expectedDeployEnv: ProcessNodes,
  currentProcessNode: ProcessNodes,
) => {
  // 校验发布环境合法性
  switch (currentProcessNode) {
    case ProcessNodes.apply_for_test: {
      currentProcessNode = ProcessNodes.testing;
      break;
    }
    case ProcessNodes.apply_for_production: {
      currentProcessNode = ProcessNodes.production;
      break;
    }
  }
  return (
    PublishRules[currentProcessNode || ProcessNodes.development].indexOf(
      expectedDeployEnv,
    ) !== -1
  );
};

export const getBranchAndDeployEnv = (
  expectedDeployEnv: ProcessNodes,
  iteration: Iteration,
  project: Project,
  deployProjectType: string,
) => {
  const prefix = getBranchPrefix(
    deployProjectType,
    iteration.multiBranch,
    project.projectTypes,
  );

  const isHotfix = iteration.updateVersionType === updateVersionType.hotfix;

  const envList = {
    [ProcessNodes.development]: (v: string) => ({
      deployBranch: `${prefix}${isHotfix ? 'hotfix' : 'dev'}/${v}`,
      deployEnv: 'dev',
    }),
    [ProcessNodes.testing]: (v: string) => ({
      deployBranch: `${prefix}${isHotfix ? 'hotfix' : 'test'}/${v}`,
      deployEnv: 'test',
    }),
    [ProcessNodes.fix]: (v: string) => ({
      deployBranch: `${prefix}${isHotfix ? 'hotfix' : 'fix'}/${v}`,
      deployEnv: 'fix',
    }),
    [ProcessNodes.pre]: (v: string) => ({
      deployBranch: `${prefix}${isHotfix ? 'hotfix' : 'fix'}/${v}`,
      deployEnv: 'prod',
    }),
    [ProcessNodes.production]: (v: string) => ({
      deployBranch: `${prefix}prod/${v}`,
      deployEnv: 'prod',
    }),
  };
  if (typeof envList[expectedDeployEnv] === 'undefined') {
    return null;
  }
  return envList[expectedDeployEnv](iteration.version);
};

export const getDeployEnv = (expectedDeployEnv: ProcessNodes) => {
  const envList = {
    [ProcessNodes.development]: 'dev',
    [ProcessNodes.testing]: 'test',
    [ProcessNodes.fix]: 'fix',
    [ProcessNodes.pre]: 'prod',
    [ProcessNodes.production]: 'prod',
  };
  return envList[expectedDeployEnv];
};

export const getEnvName = (env: ProcessNodes) => {
  const envList = {
    [ProcessNodes.development]: 'dev',
    [ProcessNodes.testing]: 'test',
    [ProcessNodes.fix]: 'fix',
    [ProcessNodes.pre]: 'pre',
    [ProcessNodes.production]: 'prod',
  };
  return envList[env];
};

export const isProjectTypeSupportMicroFe = (projectType) =>
  ['gateway'].includes(projectType);

export const getAssetUrl = ({
  assetPath,
  gitProjectName,
  version,
  withHtml,
}: {
  assetPath: string;
  gitProjectName: string;
  version: string;
  withHtml?: boolean;
}) =>
  `${assetPath}/${gitProjectName}/${version}${withHtml ? '/static/index.html' : ''
  }`;
