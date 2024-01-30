const id_prefix = 'myst-';
const fs = require('fs');

const dir = __dirname;
const files = fs.readdirSync(dir);
const subfolders = files.filter(f => fs.lstatSync(f).isDirectory());
for (let folder of subfolders) {
    console.log('folder', folder);
    const subfiles = fs.readdirSync(folder);
    for (let subfile of subfiles) {
        files.push(folder + '/' + subfile);
    }
}

var items = [];
var glbFiles = files.filter(f => f.endsWith('.glb'));

for (let f of glbFiles) {
    if (f == "site.glb")
        continue;

    const path = f.replace('.glb', '');
    const name = path.split('/').pop();
    const id = id_prefix + name;

    //check if png exists
    let png = path + '.png';
    if (!files.includes(png)) {
        console.warn(`Warning: ${png} not found`);
        png = 'objecticon.png';
    }

    let category = 'furniture';
    //use subfolder as category
    if (f.includes('/')) {
        category = f.split('/')[0];
        category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    items.push({
        id,
        name: name,
        image: `cdn://${png}`,
        description: '',
        url: `cdn://${f}`,
        type: 'model',
        category: category,
    });
}

//remove all null
items = items.filter(j => j != null);

fs.writeFileSync('buildobjects.json', JSON.stringify(items, null, 4));