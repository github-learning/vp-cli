import process from "child_process";
import chalk from "chalk";
import ora from "ora";
const spinner = ora({
  text: "vp-cli-tools 正在更新",
  spinner: {
    interval: 300,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.blue(item)
    ), // 设置加载动画
  },
});

export default function update() {
  spinner.start();

  process.exec("npm install vp-cli-tools@latest -g", (error) => {
    spinner.stop();
    if (!error) {
      console.log(chalk.green("更新成功"));
    } else {
      console.log(chalk.red(error));
    }
  });
}
