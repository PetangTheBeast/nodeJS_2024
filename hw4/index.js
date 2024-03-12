import http from 'http'
import chalk from 'chalk'
import fs from 'fs'

const port = 3000

function readCounter() {
    if (fs.existsSync('counter.txt')) {
        return parseInt(fs.readFileSync('counter.txt', 'utf8'));
    } else {
        fs.writeFileSync('counter.txt', '0');
        return 0;
    }
}

function writeCounter(value) {
    fs.writeFileSync('counter.txt', value.toString());
}

function updateCounter(req, res){
    var counter = readCounter()
    console.log(req.url, '/increase', req.url === '/increase')
    if (req.url === '/increase') {
        writeCounter(counter + 1);
        
        res.statusCode = 200 // OK
        res.setHeader('Content-Type', 'text/html')  
        res.write(`<h1>Hello, ${counter +1}!<h1>`)
        res.end('OK');
    } else if (req.url === '/decrease') {
        writeCounter(counter -1);
        
        res.statusCode = 200 // OK
        res.setHeader('Content-Type', 'text/html')  
        res.write(`<h1>Hello, ${counter -1}!<h1>`)
        res.end('OK');
    } else if (req.url === '/read') {
        
        res.statusCode = 200 // OK
        res.setHeader('Content-Type', 'text/html')  
        res.write(`<h1>Hello, ${counter}!<h1>`)
        res.end('OK');
        
    } else {
        res.statusCode = 404;
        res.statusCode = 200 // OK
        res.setHeader('Content-Type', 'text/html')  
        res.end('Not Found');
    }
}

const server = http.createServer((req, res) => {
  console.log('request')
  console.log('  url', req.url)
  console.log('  method', req.method)

  const name = req.url
  console.log(name)
  updateCounter(req, res)
  
//   res.end()
})

server.listen(port, () => {
  console.log(chalk.green(`Server listening at http://localhost:${port}`))
})