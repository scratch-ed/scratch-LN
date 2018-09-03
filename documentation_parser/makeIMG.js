module.paths.push('C:\\Users\\Ellen\\AppData\\Roaming\\npm\\node_modules');
const puppeteer = require('puppeteer');
var fs = require('fs');
var path = require('path');

const directory = 'C:\\Users\\Ellen\\Documents\\0 ugent\\Thesis\\github off\\scratch-LN/documentation_parser'

function makeIMG(name) {
    console.log('generating img for ' + name + '...');

    (async() => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({
            width: 960,
            height: 1080,
            deviceScaleFactor: 1//5
          });
        await page.goto('file://' + directory + '/' + name + '.html')
        async function screenshotDOMElement(selector, padding = 0) {
          const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
          }, selector);

          return await page.screenshot({
            path: ''+name+'.png',
            clip: {
              x: rect.left*2 - padding,
              y: rect.top*2 - padding,
              width: rect.width + padding,
              height: rect.height + padding
            }
          });
        }

        await screenshotDOMElement('body', 0);
        await browser.close()
    })()
}



if (process.argv.length === 2) {
    fs.readdir(directory, function(err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
        files.forEach(function(file, index) {
            var filepath = path.join(directory, file);
            fs.stat(filepath, function(error, stat) {
                var extension = file.slice(-4);
                if (stat.isFile() && extension === 'html') {
                    var name = file.slice(0, -5);
                    makeIMG(name);
                }

            })
        });
    });
} else {
    for (var i = 2; i < process.argv.length; i++) {
        console.log(process.argv[i]);
        var name = process.argv[i];
        makeIMG(name);
    }
}