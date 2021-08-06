/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-01-07 09:05:13
 * @LastEditTime: 2020-01-13 17:22:46
 */
// Only count HTML whitespace
// Other whitespace should count in values
// https://infra.spec.whatwg.org/#ascii-whitespace
export default (/[^\x20\t\r\n\f]+/g); 
