const path = require('path');
const { promises: fs, existsSync } = require('fs');
const fileUtils = require('./utils/file');
const { ERROR_CODE } = require('./constants');

const [ source, target, deleting ] = process.argv.slice(2);
const firstLetterNdx = 0;

async function copy (source, target) {
  const sourcePath = path.resolve(source);
  const files = await readDir(sourcePath);

  return Promise.all(files.map(({ name, path: fPath }) => {
    const firstLetter = name[firstLetterNdx];
    const filePath = path.resolve(fPath);
    const newDirPath = path.join(target, firstLetter);
    const newFilePath = path.join(newDirPath, name);

    fileUtils.mkNonexistentDirSync(newDirPath);

    return fs.copyFile(filePath, newFilePath);
  }));
}

async function readDir (dirPath) {
  const dirs = await fs.readdir(dirPath, { withFileTypes: true });
  const promises = dirs.map(dir => {
    const filePath = path.resolve(dirPath, dir.name);

    return dir.isDirectory() ? readDir(filePath) : { name: dir.name, path: filePath };
  });
  const files = await Promise.all(promises);

  return files.flat();
}

function fileSorting (source, target = './dist') {
  if (!source) {
    console.log('\x1b[33m%s\x1b[0m', `Run script with args: "node <script> <sourceDir> <targetDir> -d" \n
Running with the "-d" flag will delete files after copying.`);

    process.exit(ERROR_CODE);
  }

  if (!existsSync(source)) {
    console.log('\x1b[31m%s\x1b[0m', 'Error: Can not find source directory.');

    process.exit(ERROR_CODE);
  }

  if (target === '-d') {
    console.log('\x1b[33m%s\x1b[0m', 'Incorrect order argument. Try "node <script> <sourceDir> <targetDir> -d"');

    process.exit(ERROR_CODE);
  } else {
    fileUtils.mkNonexistentDirSync(target);
  }

  return copy(source, target)
    .then(async () => {
      console.log('\x1b[32m%s\x1b[0m', 'Sorting complete.');

      if (deleting && deleting === '-d') {
        await fs.rmdir(source, { recursive: true });

        console.log('\x1b[32m%s\x1b[0m', 'Deleting complete.');
      }
    });
}

fileSorting(source, target)
  .then(() => {
    console.log('Task is done!');
  })
  .catch(e => console.log('Error: ', e));
