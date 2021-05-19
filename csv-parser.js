const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');


function csvToJson(data, delimiter = ',') {
  // let rows = data.split('').map(item => item.split(delimiter));
  let rows = data.split('\r\n').map(item => item.split(delimiter));
  let headers = rows[0];

  let temp = rows.filter((_, index) => index !== 0)
    .map((row) => {
      const json = {};
      row.map((col, colIndex) =>
        json[headers[colIndex]] = col

      );
      return json;
    })
}

function csvToJsonWithStream(inputStream, delimiter = ',') {
  const outputStream = new Transform();

  let remainder = '';
  let lineNumber = 0;
  let headers;
  inputStream.on('data', async (buffer) => {
    const lines = (remainder + buffer).split('\r\n');
    remainder = lines.pop();
    for await (const line of lines) {
      let op = '';
      if (lineNumber == 0) {
        op = '[';
        headers = line.split(delimiter);
      } else {
        const items = line.split(delimiter);
        const obj = {};
        items.map((item, index) => {
          obj[headers[index]] = item
        });
        op = JSON.stringify(obj);
      }
      lineNumber += 1;
      if (lineNumber == 1) {
        outputStream.push(op);
      } else {
        outputStream.push(op + ',');
      }

    }
  });
  inputStream.on('close', () => {
    const items = remainder.split(delimiter);
    const obj = {};
    items.map((item, index) => obj[headers[index]] = item);
    op = JSON.stringify(obj);
    outputStream.push(op + ']');
  });
  return outputStream;
}

module.exports.csvToJson = (filepath, delimiter) => {
  const content = fs.readFileSync(filepath);
  csvToJson(content.toString(), delimiter);
}

module.exports.csvToJsonWithStream = (filepath, delimiter) => {
  const stream = fs.createReadStream(filepath);
  return csvToJsonWithStream(stream, delimiter);
}