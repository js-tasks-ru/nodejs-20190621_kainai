const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    this.line += chunk;
    this.splitLine();
    callback();
  }

  splitLine() {
    const lines = this.line.split(`${os.EOL}`);
    lines.map((item, idx) => idx === lines.length - 1 ? this.line = item : this.push(item));
  }

  _flush(callback) {
    this.push(this.line);
    callback();
  }
}

module.exports = LineSplitStream;
