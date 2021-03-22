const fs = require('fs');
//  写入文件
fs.writeFile('./log.txt', 'hello', (err, data) => {
	if (err) {

	} else {
		console.log('文件创建成功');
	}
})