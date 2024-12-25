import { Command } from 'commander';
import { version } from '../package.json';
import create from './command/create';
// 命令行中使用 we xxx 即可触发
const program = new Command('we');
program.version(version, '-v , --version');

program
  .command('create')
  .description('创建一个新项目')
  .argument('[name]', '项目名称')
  .action(async (name?: string) => {
    await create(name);
  });

program.parse();
