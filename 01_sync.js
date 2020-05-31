const fs = require('fs');
const path = require('path');
const fileUtils = require('./utils/file');

const root = path.resolve('test_files');

function copy (from, to) {
  const files = fs.readdirSync(from);
  const firstLetterNdx = 0;

  files.forEach(item => {
    const itemPath = path.join(from, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      copy(itemPath, to);
    } else {
      const firstLetter = item[firstLetterNdx];
      const dirPath = path.join(to, firstLetter);
      const filePath = path.join(dirPath, item);

      fileUtils.checkDirectorySync(dirPath);

      if (fs.existsSync(filePath)) return;

      fs.copyFile(itemPath, filePath);
    }
  });

  fileUtils.removeDirRecursive(from);
}

copy(root, './dist/');
