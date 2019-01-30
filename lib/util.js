const path = require("path");
const fs = require("fs-extra");
const slug = require("slug");
const md5 = require("md5");
const constants = require("./constants");

module.exports = {
  ensureDirectory: dir => fs.ensureDir(dir),

  getFiles: (dir, regex) => {
    return fs
      .pathExists(dir)
      .then(exists => (exists ? fs.readdir(dir) : []))
      .then(files =>
        files.filter(filename => {
          return regex.test(filename);
        })
      );
  },

  fileExists: path => fs.exists(path),

  createEmptyFile: path => fs.writeFile(path, ""),

  getFileContents: path => fs.readFile(path, "utf8"),

  calculateHash: text => md5(text),

  cleanFilename: name => {
    return slug(name, {
      replacement: constants.FILENAME_SEPARATOR,
      symbols: false,
      lower: true
    });
  },

  stripFilenameExtension: (filename, extension) => {
    return path.basename(filename, extension);
  },

  isPositiveInteger: str => {
    return /^0*[1-9]\d*$/.test(str);
  },

  getDuplicateElements: arr => {
    return arr.filter(x => {
      return arr.indexOf(x) !== arr.lastIndexOf(x);
    });
  },

  calculateNextInSequence: sequence => {
    return sequence.length > 0 ? Math.max(...sequence) + 1 : 1;
  }
};
