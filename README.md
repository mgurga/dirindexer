# dirindexer
Command Line Application that searches online directories and lists all files

only works on very simple web directories eg: http://drummerdonnie.com/Archive/

even simple sites like these can yield some false results, the simpler the better

```
Usage: dirindexer-win.exe [options]

Options:
  -V, --version          output the version number
  -u, --url <value>      url(s) of directory website(s) (urls separated with ,)
  -o, --output [value]   where to output list of urls (default: "out.txt")
  -l, --levels [number]  how many directory levels to go down (default: 2)
  -r, --url-header       show &&&&&NEWSITE [siteurl] for each url
  -d, --debug            show debug information
  -h, --help             output usage information
```

Example:

```
dirindexer-win.exe --url "http://drummerdonnie.com/Archive/" --output "oldPrograms.txt" --levels 1
```
