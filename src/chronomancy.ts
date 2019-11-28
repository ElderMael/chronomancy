function chronomancy(args: string[]) {
    if(args.length == 0) {
        const version = require('../package.json').version;
        console.log(`chronomancy version ${version}`);
    }
}


export default chronomancy;
