import fs from 'fs'

// Načtení instrukcí
try {    
    const instructions = fs.readFileSync('instrukce.txt', 'utf8');
    const [sourceFile, targetFile] = instructions.split(' ');
    // Kopírování dat
    const data = fs.readFileSync(sourceFile, 'utf8');
    fs.writeFileSync(targetFile, data);

    console.log(`Data byla úspěšně zkopírována do souboru ${targetFile}.`);
} catch (error) {
    console.log(error.message)
    process.exit(1);
}




