import logSymbols from "log-symbols";

export const log = {
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
