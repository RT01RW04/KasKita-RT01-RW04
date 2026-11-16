const babel=require('@babel/core'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
for(const name of ['app.js','auth.js','cards.js','core.js','drive.js','reports.js','scanner.js','sw.js','compat.js']) {
 const source=fs.readFileSync(path.join(root,'sumber',name),'utf8');
 const result=babel.transformSync(source,{sourceType:'script',comments:true,presets:[[require('@babel/preset-env'),{targets:{ios:'12',chrome:'65'},modules:false,bugfixes:true,useBuiltIns:false}]]});
 fs.writeFileSync(path.join(root,name),result.code+'\n');
}
console.log('Build kompatibilitas selesai.');
