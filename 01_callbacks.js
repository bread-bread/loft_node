const fs = require('fs');
const path = require('path');
const fileUtils = require('./utils/file');
const initQueue = require('./utils/queue');
const { ERROR_CODE } = require('./constants');

const [ source, target, deleting ] = process.argv.slice(2);

function copy (source, target, queue) {
  queue.add(source);

  fs.readdir(source, (err, files) => {
    if (err) {
      console.log(err);

      process.exit(ERROR_CODE);
    }

    const firstLetterNdx = 0;

    files.forEach(item => {
      const filePath = path.join(source, item);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory()) {
        copy(filePath, target, queue);
      } else {
        const firstLetter = item[firstLetterNdx];
        const newDirPath = path.join(target, firstLetter);
        const newFilePath = path.join(newDirPath, item);

        fileUtils.mkNonexistentDirSync(newDirPath);

        queue.add(filePath);

        fs.copyFile(filePath, newFilePath, err => {
          if (err) {
            console.log(err);
            process.exit(ERROR_CODE);
          }

          queue.delete(filePath);
        });
      }
    });

    queue.delete(source);
  });
}

function fileSorting (source, target = './dist') {
  if (!source) {
    console.log('\x1b[33m%s\x1b[0m', `Run script with args: "node <script> <sourceDir> <targetDir> -d" \n
Running with the "-d" flag will delete files after copying.`);

    process.exit(ERROR_CODE);
  }

  if (!fs.existsSync(source)) {
    console.log('\x1b[31m%s\x1b[0m', 'Error: Can not find source directory.');

    process.exit(ERROR_CODE);
  }

  if (target === '-d') {
    console.log('\x1b[33m%s\x1b[0m', 'Incorrect order argument. Try "node <script> <sourceDir> <targetDir> -d"');

    process.exit(ERROR_CODE);
  } else {
    fileUtils.mkNonexistentDirSync(target);
  }

  const queue = initQueue(sortingCallback);

  copy(source, target, queue);
}

function sortingCallback () {
  console.log('\x1b[32m%s\x1b[0m', 'Sort completed successfully!');

  if (deleting && deleting === '-d') {
    fileUtils.removeDirRecursive(source);

    console.log('\x1b[32m%s\x1b[0m', 'Delete completed');
  }
}

fileSorting(source, target);
