const pwd = process.cwd();

module.exports = {
  port: 3000,
  //  临时文件存放地址
  tempFilePath: `${pwd}/public/temp`,
  logConfig: {
    flag: true,
    outDir: `${pwd}/public/log`,
    level: 'info',
  },
  TOKEN_ENCODE_STR: 'itc_token_encode_str',
  PWD_ENCODE_STR: 'itc_pwd_encode_str',
};
