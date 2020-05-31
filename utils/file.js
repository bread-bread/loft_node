const fs = require('fs');
const path = require('path');

module.exports.mkNonexistentDirSync = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports.removeDirRecursive = function (dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item);

        if (fs.statSync(itemPath).isDirectory()) {
          this.removeDirRecursive(itemPath);
        } else {
          fs.unlinkSync(itemPath);
        }
      });

      fs.rmdirSync(dir);
    }
  } catch (e) {
    console.log(e);
  }
};
