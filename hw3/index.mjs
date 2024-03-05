import fs from 'fs/promises';



async function createFiles(number) {
  try {
    let promises = [];
    for(let i = 0; i < number; i++) {
        let promise = fs.writeFile(`${i}.txt`, `Soubor ${i}`);
        promises.push(promise);
    }
    await Promise.all(promises);

    console.log('Všechny soubory byly úspěšně vytvořeny.');
  } catch (err) {
    console.error('Chyba při vytváření souborů:', err);
  }
}

async function readFile(path) {
    return fs.readFile(path)   
}

const path = 'instrukce.txt'
const numberPromis = readFile(path)


numberPromis.then((data) => {
    console.log(data)
    const n = parseInt(data, 10);
    console.log(n)
    createFiles(n);
})
