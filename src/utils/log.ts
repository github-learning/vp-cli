import logSymbols from 'log-symbols';

const log = {
  error: (msg: string) => {
    console.log(logSymbols.error, msg);
  },
  success: (msg: string) => {
    console.log(logSymbols.success, msg);
  },
  warning: (msg: string) => {
    console.log(logSymbols.warning, msg);
  },
  info: (msg: string) => {
    console.log(logSymbols.info, msg);
  },
};

// const goodPrinter = async () => {
//   const data = await figlet('欢迎使用 we-cli 脚手架');
//   console.log(chalk.rgb(40, 156, 193).visible(data));
// };

export default log;
