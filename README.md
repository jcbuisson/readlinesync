
Generator reading a text file, line by line, synchronously

Requires node >= 10

# Install
```
npm install @jcbuisson/readlinesync
```

# Usage example

```
const readlineSync = require('@jcbuisson/readlinesync')
const lineGenerator = readlineSync(filePath)
for (let line of lineGenerator) {
   console.info(line)
}
```

# Options

```
const readlineSync = require('@jcbuisson/readlinesync')
const lineReader = readlineSync(path, options)
```

- `path` is the path of the file to read
- `options` is an optional object with the following optional attributes:
   - options.eol: end-of-line string, usually '\n' (LF, unix/macosx) or '\r\n' (CRLF, windows); default=os.EOL
   - options.encoding: encoding used to read / write lines from file stream bytes; default='utf8'
