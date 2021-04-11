/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-11 17:04:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-11 17:30:36
 */
import SMERouter from 'sme-router';
import { signin, index } from '../controllers'

const router = new SMERouter('root');

router.route('/', index);

router.route('/signin', signin);

export default router;
