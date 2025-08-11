const { packageManager } = require('../package.json');
const version = packageManager.split('@')[1];
require('child_process').execSync(`yarn set version ${version}`, { stdio: 'inherit' });
