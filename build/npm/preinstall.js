const cp = require('child_process');
console.log("\033[1;36mNode Version - ", process.versions.node);
let err;
const majorNodeVersion = parseInt(/^(\d+)\./.exec(process.versions.node)[1]);
if (majorNodeVersion < 8 || majorNodeVersion > 11) {
	console.error('\033[1;31m*** Please use node >=8 and <11.\033[0;0m');
	err = true;
}
console.log("NPM version -", cp.execSync('npm -v', {encoding: 'utf-8'}));
if(err){
    console.error('Error installing packages!');
    process.exit(1);
}