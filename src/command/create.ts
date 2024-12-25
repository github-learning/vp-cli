import { select, input } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import { clone } from '../utils/clone';
import log from '../utils/log';

export interface TemplateInfo {
  name: string; // 项目名称
  downloadUrl: string; // 下载地址
  description: string; // 项目描述
  branch: string; // 项目分支
}

// 这里保存了我写好的预设模板
export const templates: Map<string, TemplateInfo> = new Map([
  [
    'Vite4-Vue3-Typescript-template',
    {
      name: 'admin-template',
      downloadUrl: 'git@github.com:github-learning/vue3-admin.git',
      description: 'Vue3技术栈开发模板',
      branch: 'main',
    },
  ],
  [
    'backend-template',
    {
      name: 'admin-server-template',
      downloadUrl: 'git@gitee.com:sohucw/admin-pro.git',
      description: 'Vue3技术栈后台开发模板',
      branch: 'main',
    },
  ],
]);

export const isOverWrite = async (fileName: string) => {
  log.warning(`${fileName} 文件已存在 !`);
  return select({
    message: '是否覆盖原文件: ',
    choices: [
      { name: '覆盖', value: true },
      { name: '取消', value: false },
    ],
  });
};

export default async function create(prjName?: string) {
  // 文件名称未传入需要输入
  if (!prjName) {
    prjName = await input({ message: '请输入项目名称' });
  }
  // 如果文件已存在需要让用户判断是否覆盖原文件
  const filePath = path.resolve(process.cwd(), prjName);
  if (fs.existsSync(filePath)) {
    const run = await isOverWrite(prjName);
    if (run) {
      await fs.remove(filePath);
    } else return;
  }

  const templateList = [...templates.entries()].map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );

  // 选择模板
  const templateName = await select({
    message: '请选择需要初始化的模板:',
    choices: templateList,
  });

  // 下载模板
  const gitRepoInfo = templates.get(templateName);

  console.log(
    '%c [  ]-73',
    'font-size:13px; background:pink; color:#bf2c9f;',
    gitRepoInfo
  );
  if (gitRepoInfo) {
    await clone(gitRepoInfo.downloadUrl, prjName, [
      '-b',
      `${gitRepoInfo.branch}`,
    ]);
  } else {
    log.error(`${templateName} 模板不存在`);
  }
}
