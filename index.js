/**
 * Generator reading a text file, line by line, synchronously
 * 
 * Requires node >= 10
 *
 * Example:
 * 
 * const readlineSync = require('@jcbuisson/readlinesync')
 * const lineGenerator = readlineSync(filePath)
 * for (let line of lineGenerator) {
 *    console.info(line)
 * } 
 *
 * License: MIT
 */


const fs = require('fs')
const os = require('os')
const StringDecoder = require('string_decoder').StringDecoder


// Get a line from buffer and return line + remaining buffer
function getLine(buffer, eol, stringDecoder) {    
   let end = buffer.indexOf(eol)
   if (end === -1) return null

   return {
      line: stringDecoder.write(buffer.slice(0, end)),
      newBuffer: buffer.slice(end + eol.length),
   }
}

/**
 * Generator reading a text file, line by line, synchronously
 * 
 * `path` is the path of the file to read
 * `options` is an optional object with the following optional attributes:
 *   - options.eol: end-of-line string, usually LF (unix/macosx) or CRLF (windows); default=os.EOL
 *   - options.encoding: encoding used to read / write lines from file stream bytes; default='utf8'
 */
module.exports = function*(path, options) {

   // windows: eol=crlf, unix: eol=lf
   let eol = options && options.eol || os.EOL
   
   let encoding = options && options.encoding || 'utf8'
   let stringDecoder = new StringDecoder(encoding)
   
   if (!fs.existsSync(path)) {
      throw new Error("no such file or directory '" + path + "'")
   }
   let fd = fs.openSync(path, 'r')
   
   let fsize = fs.statSync(path).size
   let chunkSize = 64 * 1024 // 64KB
   
   let curBuffer = Buffer.alloc(0)

   let remainder = fsize

   while (remainder > 0) {
      let bufferSize = remainder < chunkSize ? remainder : chunkSize
   
      let readBuffer = Buffer.alloc(bufferSize)
      
      fs.readSync(fd, readBuffer, 0, bufferSize, null)

      remainder -= bufferSize
      
      curBuffer = Buffer.concat([curBuffer, readBuffer], curBuffer.length + readBuffer.length)
      
      while (lineObj = getLine(curBuffer, eol, stringDecoder)) {
         curBuffer = lineObj.newBuffer
         yield lineObj.line
      }
   }
   
   // yield last remains of the buffer if any
   if (curBuffer.length) {
      yield stringDecoder.write(curBuffer)
   }
}
