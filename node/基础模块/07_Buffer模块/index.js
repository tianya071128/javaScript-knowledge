/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-09-27 16:02:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-28 11:39:01
 */
var fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib');

fstream.Reader({ 'path': './test', 'type': 'Directory' }) /* Read the source directory */
    .pipe(tar.Pack()) /* Convert the directory to a .tar file */
    .pipe(zlib.Gzip()) /* Compress the .tar file */
    .pipe(fstream.Writer({ 'path': './output/compressed_folder.zip' })); /* Give the output file name */
