const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// //////////////////////////////////////////////////////////
// Files

// Blocking, synchrouns way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// fs.writeFileSync('./txt/output.js', `${textIn} \nHello my name is mohammed ${new Date().getFullYear()}`)
// console.log(textIn);

// Non-Blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8' , (err, data)=>{
//     fs.readFile(`./txt/${data}.txt`, 'utf-8' , (err, data1)=>{
//         console.log(data1);
//     })
// })
// console.log("Reading file...")
/////////////////////////////////////////////////////////////////

// /////////////////////
// server

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const product_cards = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const dataObj = JSON.parse(productData);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const id = query.id || '';

  switch (pathname) {
    // OVERVIEW
    case '/':
    case '/overview':
      res.writeHead(200, {
        'Content-type': 'text/html',
      });

      let cardsHtml = dataObj
        .map((el) => replaceTemplate(product_cards, el))
        .join('\n');
      cardsHtml = overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
      res.end(cardsHtml);
      break;

    //   PRODUCT
    case `/product`:
      if (dataObj.length < id) {
        res.end('Page not found');
      } else {
        res.writeHead(200, {
          'Content-type': 'text/html',
        });
        let productHtml = replaceTemplate(product, dataObj[id]);
        res.end(productHtml);
      }
      break;

    //   Api
    case '/api':
      res.writeHead(200, {
        'Content-type': 'application/json',
      });
      res.end(productData);
      break;

    //   Not-FOUND
    default:
      res.writeHead(404, {
        'Content-type': 'text/html',
        x3raqe: 'a7m',
      });
      res.end('<h1>Page not found</h1>');
      break;
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('istening to request on 8000');
});

// done on 1/8/2024