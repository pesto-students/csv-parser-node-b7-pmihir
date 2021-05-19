const path = require('path');
const fs = require('fs');
const { csvToJsonWithStream } = require('./csv-parser');
const { Stream } = require('stream');

const filePathOfCsv = path.join(__dirname, './data', 'data1.csv');

const destinationFilePath = path.join(__dirname, './Output');

checkFilePathName = function () {
  fs.readdir(destinationFilePath, function (err, data) {
    if (!err & data && data.length > 0) {
      console.log(data);
    } else {
      console.log(err);
    }
  })
}

const ws = fs.createWriteStream(destinationFilePath);


console.log("CSV to JSON Async");
csvToJsonWithStream(filePathOfCsv)
  .pipe(process.stdout);

