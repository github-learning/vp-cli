import { select, input } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import { clone } from '../utils/clone';
import { log } from '../utils/log';
import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';
import chalk from 'chalk';
import { name, version } from '../../package.json';

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
      downloadUrl: 'git@gitee.com:Big_Cat-AK-47/edit-table.git',
      // downloadUrl: "git@github.com:github-learning/vue3-admin.git",
      description: 'Vue3技术栈开发模板',
      // branch: "main",
      branch: 'master',
    },
  ],
  [
    'backend-template',
    {
      name: 'admin-server-template',
      downloadUrl: 'git@gitee.com:Big_Cat-AK-47/edit-table.git',
      description: 'Vue3技术栈后台开发模板',
      // branch: "main",
      branch: 'master',
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

export const getNpmLatestVersion = async (npmName: string) => {
  // data['dist-tags'].latest 为最新版本号
  console.log('name', npmName);
  try {
    const { data } = (await getNpmInfo(npmName)) as AxiosResponse;
    console.log(
      '%c [  ]-57',
      'font-size:13px; background:pink; color:#bf2c9f;',
      data
    );
    return data['dist-tags'].latest;
  } catch (error) {
    console.log('error', error);
  }
};
// npm 包提供了根据包名称查询包信息的接口// 我们在这里直接使用 axios 请求调用即可
export const getNpmInfo = async (npmName: string) => {
  const npmUrl = 'https://registry.npmjs.org/' + npmName;
  console.log('npmUrl'), npmUrl;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (err) {
    log.error(err as string);
  }
  console.log('res', res);
  return res;
};

export const checkVersion = async (name: string, curVersion: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = lodash.gt(latestVersion, curVersion);
  if (need) {
    log.info(
      `检测到 dawei 最新版:${chalk.blueBright(
        latestVersion
      )} 当前版本:${chalk.blueBright(curVersion)} ~`
    );
    log.info(`可使用 ${chalk.yellow('pnpm')} install dawei-cli@latest 更新 ~`);
  }
  return need;
};
export default async function create(prjName?: string) {
  // 文件名称未传入需要输入
  if (!prjName) {
    prjName = await input({ message: '请输入项目名称' });
  }
  // 如果文件已存在需要让用户判断是否覆盖原文件
  const filePath = path.resolve(process.cwd(), prjName);

  console.log(
    '%c [  ]-90',
    'font-size:13px; background:pink; color:#bf2c9f;',
    filePath,
    fs.existsSync(filePath)
  );
  if (fs.existsSync(filePath)) {
    const run = await isOverWrite(prjName);
    if (run) {
      await fs.remove(filePath);
    } else return;
  }
  console.log('111111');

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
  console.log('222');

  console.log(
    '%c [  ]-131',
    'font-size:13px; background:pink; color:#bf2c9f;',
    name,
    version
  );
  // await checkVersion(name, version); // 检测版本更新

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
