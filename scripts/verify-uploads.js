
const fs=require('fs');const path=require('path');
const uploads=path.join(process.cwd(),'public','uploads');
if(!fs.existsSync(uploads)){ console.error('Missing directory:',uploads); process.exit(1); }
const files=fs.readdirSync(uploads).filter(f=>f.toLowerCase().endsWith('.pdf'));
console.log('PDFs found:', files.length);
if(files.length===0){ console.log('→ Skopiuj swoje PDF-y do public/uploads/'); }
