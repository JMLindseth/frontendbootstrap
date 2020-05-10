const mockUtils = require('./mockUtils.js');

function mockForLokal(server) {
  server.get('/syfomoteadmin/api/internad/veilederinfo', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.veilederInfo));
  });

  server.get('/modiacontextholder/api/context/aktivenhet', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.aktivEnhet));
  });
}

module.exports = {
  mockForLokal,
};
