const FPersist = require('fpersist');
const path = require('path');

const fpersist = new FPersist(path.join(__dirname, '..', 'storage'));

module.exports = fpersist;
