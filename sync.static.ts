import * as path from 'path';
import * as shell from 'shelljs';

// 清理上传目录
shell.rm('-rf', 'upload');
shell.mkdir('upload');

// 同步资源文件
shell.find('src').filter(item => {
  return item.match(/\.html$/);
}).forEach(item => {
  const dest = item.replace(/^src\b/, 'dist');
  shell.mkdir('-p', path.dirname(dest));
  shell.cp(item, dest);
});