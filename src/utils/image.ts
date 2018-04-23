import * as fs from 'fs';
import * as util from 'util';
import jpeg = require('jpeg-js');

const exists = util.promisify(fs.exists);

export default function generate(filepath: string, width = 100, height = 100) {
  exists(filepath).then(exist => {
    if (exist) {
      return false;
    }

    const data = Buffer.alloc(width * height * 4);
    let i = 0;
    while (i < data.length) {
      data[i++] = 0xFF; // red
      data[i++] = 0x00; // green
      data[i++] = 0x00; // blue
      data[i++] = 0xFF; // alpha - ignored in JPEGs
    }

    const image = jpeg.encode({ width, height, data }, 50);
    fs.writeFileSync(filepath, image.data, 'base64');
  });
}