import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { log } from './log';
import createLogger from 'progress-estimator';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
// import  from "child_process";
import { exec, spawn } from 'child_process';
import ora from 'ora';

const figlet = require('figlet');

const spinnerTip = ora({
  text: 'vp-cli-tools 正在更新',
  spinner: {
    interval: 300,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
      chalk.blue(item)
    ), // 设置加载动画
  },
});

const logger = createLogger({
  // 初始化进度条
  spinner: {
    interval: 300, // 变换时间 ms
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
      chalk.blue(item)
    ), // 设置加载动画
  },
});
const goodPrinter = async () => {
  const data = await figlet.textSync('欢迎使用 vp-cli-tools 脚手架', {
    font: 'Standard',
  });
  console.log(chalk.rgb(40, 156, 193).visible(data));
};

// 下面就是一些相关的提示

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: 'git',
  maxConcurrentProcesses: 6, // 最大并发进程数
};

// 安装项目依赖
const installDependencies = (prjName: string): Promise<void> => {
  // return new Promise((resolve, reject) => {
  const projectDir = path.join(process.cwd(), prjName);
  //   // ora("安装依赖中...").start(); // 启动加载动画
  //   spinnerTip.start('安装依赖中...');

  //   // 检查项目目录是否存在
  //   if (!fs.existsSync(projectDir)) {
  //     reject(new Error('项目目录不存在'));
  //     return;
  //   }

  //   // 执行 pnpm install 安装依赖
  //   exec(
  //     'npm install --verbose --force',
  //     { cwd: projectDir },
  //     (err, stdout, stderr) => {
  //       if (err) {
  //         reject(`依赖安装失败: ${stderr || err.message}`);
  //       } else {
  //         console.log(chalk.green('依赖安装成功'));

  //         resolve();
  //       }
  //     }
  //   );
  // });
  return new Promise((resolve, reject) => {
    const npmInstall = spawn('npm', ['install', '--verbose', '--force'], {
      cwd: projectDir,
      stdio: 'inherit', // 将子进程的输出直接映射到父进程（当前进程）的输出
      shell: true, // 使用 shell，确保命令在 Windows 和其他平台上都能运行
    });

    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('依赖安装成功'));
        resolve();
      } else {
        reject(`依赖安装失败，退出代码: ${code}`);
      }
    });

    npmInstall.on('error', (err) => {
      reject(`依赖安装时发生错误: ${err.message}`);
    });
  });
};

// 运行项目
const runProject = (prjName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const projectDir = path.join(process.cwd(), prjName);
    const spinnerTip = ora('项目启动中...').start();

    // 检查项目目录是否存在
    if (!fs.existsSync(projectDir)) {
      spinnerTip.fail('项目目录不存在');
      reject(new Error('项目目录不存在'));
      return;
    }

    // 使用 spawn 执行 pnpm run serve
    const serveProcess = spawn('pnpm', ['run', 'serve'], {
      cwd: projectDir,
      stdio: 'pipe', // 子进程的输出流式处理
      shell: true, // 确保在跨平台运行时正常
    });

    serveProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(chalk.green(output)); // 实时打印日志

      // 检测到启动完成的标志
      if (output.includes('App running at')) {
        spinnerTip.succeed('项目启动成功！');
        resolve(); // 完成 Promise
      }
    });

    serveProcess.stderr.on('data', (data) => {
      console.error(chalk.red(data.toString()));
    });

    serveProcess.on('close', (code) => {
      if (code !== 0) {
        spinnerTip.fail('项目启动失败');
        reject(new Error(`项目启动失败，退出代码: ${code}`));
      }
    });

    serveProcess.on('error', (err) => {
      spinnerTip.fail('项目启动失败');
      reject(new Error(`项目启动失败: ${err.message}`));
    });
  });
  // return new Promise((resolve, reject) => {
  //   const projectDir = path.join(process.cwd(), prjName);
  //   spinnerTip.start('项目启动中...');

  //   // 检查项目目录是否存在
  //   if (!fs.existsSync(projectDir)) {
  //     reject(new Error('项目目录不存在'));
  //     return;
  //   }

  //   // 执行 pnpm run dev 启动项目
  //   exec('pnpm run serve', { cwd: projectDir }, (err, stdout, stderr) => {
  //     spinnerTip.stop(); // 停止 spinner 提示
  //     console.log(chalk.blue('日志' + stdout));
  //     if (err) {
  //       reject(`项目启动失败: ${stderr || err.message}`);
  //     } else {
  //       console.log(chalk.green('项目已成功启动！'));
  //       resolve();
  //     }
  //   });
  // });
};

export const clone = async (
  url: string,
  prjName: string,
  options: string[]
): Promise<any> => {
  const git: SimpleGit = simpleGit(gitOptions);
  try {
    // 开始下载代码并展示预估时间进度条
    await logger(git.clone(url, prjName, options), '代码下载中: ', {
      estimate: 8000, // 展示预估时间
    });

    // 下面就是一些相关的提示
    console.log();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.blueBright(`=== 欢迎使用 vp-cli-tools 脚手架 ===`));
    console.log(chalk.blueBright(`==================================`));
    console.log();

    log.success(`项目创建成功 ${chalk.blueBright(prjName)}`);
    log.success(`执行以下命令启动项目：`);
    log.info(`cd ${chalk.blueBright(prjName)}`);
    log.info(`${chalk.yellow('pnpm')} install`);
    log.info(`${chalk.yellow('pnpm')} run dev`);
    goodPrinter();

    await installDependencies(prjName);
    await runProject(prjName);
  } catch (err: any) {
    log.error('下载失败');
    log.error(String(err));
  }
};
