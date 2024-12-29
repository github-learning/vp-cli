import { Command } from 'commander'; // 处理控制台命令
import { version } from '../package.json';
import create from './command/create';
import update from './command/update';
// 命令行中使用 vp-cli-tools xxx 即可触发
const program = new Command('vp-cli-tools');
program.version(version, '-v , --version');

program
  .command('create')
  .description('创建一个新项目')
  .argument('[name]', '项目名称')
  .action(async (name?: string) => {
    await create(name);
  });

program
  .command('update')
  .description('更新vp-cli-tools')
  .action(() => {
    update();
  });
program.parse();
