
const program = require('commander');
const fetch = require('node-fetch');
const DOMParser = require('dom-parser');
const fs = require('fs');

program.version('0.0.1');

program
    .option("-u, --url <value>", "url(s) of directory website(s) (urls separated with ,)")
    .option("-o, --output [value]", "where to output list of urls", "out.txt")
    .option("-l, --levels [number]", "how many directory levels to go down", 2)
    .option("-r, --url-header", "show &&&&&NEWSITE [siteurl] for each url", false)
    .option("-d, --debug", "show debug information", false);

program.parse(process.argv);

var fileStream = fs.createWriteStream(program.output, {"flags": "a"});
var searchedURLs = [];

if(program.debug == undefined) {
    program.debug = false;
}

if(program.urlHeader == undefined) {
    program.urlHeader = false;
}

if(program.debug) {
    console.log("url: " + program.url)
    console.log("output: " + program.output)
    console.log("levels: " + program.levels)
    console.log("url-header: " + program.urlHeader);
    console.log("debug: " + program.debug);
}

if(program.url == undefined) {
    console.error("error: option `-u, --url <value>` missing");
    process.exit(1)
}

if(program.urlHeader) {
    fileStream.write("&&&&&NEWSITE");
    fileStream.write("\r\n");
    fileStream.write(program.url);
    fileStream.write("\r\n");
}

program.url = program.url.split(",");

for(var i in program.url) {
    readSiteFiles(program.url[i], 0)
}

function readSiteFiles(url, level) {
    if (level < program.levels && !searchedURLs.includes(url)) {
        searchedURLs[searchedURLs.length] = url;
        fetch(url)
            .then(function (res) {
                return res.text();
            })
            .then(function (rawhtml) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(rawhtml, "text/html");

                fileEntries(doc.getElementsByTagName("a"));
            })
            .catch(function (err) {
                console.log("site get err: " + err);
            })

        function fileEntries(aTags) {
            for (var i in aTags) {
                var fileName = aTags[i].attributes[0].value
                if (fileName != "/" && fileName != ".." && fileName != "../" && fileName != "") {
                    if (fileName.charAt(fileName.length - 1) == "/") {
                        if(program.debug) {
                            console.log("dir: " + fileName);
                        }
                        readSiteFiles(url + fileName + "/", level + 1);
                    } else if ( !(fileName.includes("?") || fileName.includes(";") || fileName.includes("history.go(-1)") || fileName.includes("http") || fileName.includes("#"))) {
                        if(program.debug) {
                            console.log("file: " + fileName);
                        }
                        fileStream.write(decodeURI(url + "/" +  fileName));
                        fileStream.write("\r\n");
                        
                    }
                }
            }
        }
    }
}