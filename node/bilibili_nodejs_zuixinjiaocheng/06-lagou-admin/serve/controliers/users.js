/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-11 23:20:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-11 23:31:59
 */
const signup = (req, res, next) => {
  const { username, password } = req.body;
  const result = {
    "ret": true,
    "errorCode": 0,
    "data": {
      username,
      password
    }
  }

  res.send(result);
}


exports.signup = signup;