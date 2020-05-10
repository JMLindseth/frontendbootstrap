const fs = require('fs');
const path = require('path');

const readDataFromJsonFile = (filename) => {
   const rawData = fs.readFileSync(path.join(__dirname, `/Data/${filename}`));
   return JSON.parse(rawData.toString());
}

const veilederInfo = readDataFromJsonFile('veilederInfo.json');
const aktivEnhet = readDataFromJsonFile('aktivEnhet.json');

module.exports = {
    veilederInfo: veilederInfo,
    aktivEnhet: aktivEnhet,
};

