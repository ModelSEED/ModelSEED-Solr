#!/usr/bin/env node

var fs = require('fs'),
    util = require('util'),
    readline = require('readline');

var opts = require('commander');

opts.version('0.0.1')
    .option('-f, --file [value]', 'File to parse')
    .option('-l, --line [value]', 'Examine file at line number.  Prints fields and values vertically and other stats.')
    .option('-d, --debug', 'Debug mode, writing problematic rows to stdout')
    .option('-i, --insert-at-column [value]', 'Insert after the specified column for problematic rows')
    .option('-value, --insert-value [value]', 'Value to insert at line of "--insert-at"')
    .option('-h, --fix-header [value]', 'Write file with recommended header')
    .option('-s, --split [value]', 'Split file into smaller files ingnoring ')    
    .parse(process.argv);


if (!opts.file) {
    console.error('Must supply a file using --file (-f) option');
    return;
}

if (opts.debug && opts.insert) {
    console.error('Can specify both debug and insert-tab mode');
    return;
}

if ( (opts.insertAtColumn && !opts.insertValue) ||
    (!opts.insertAtColumn && opts.insertValue) ) {
    console.error('Must specify both "insert-value" and "insert-at-column"');
    return;
}

console.error('\n\x1b[36m'+'parsing file:'+'\x1b[0m', opts.file)


// if header option is give, fix header and quit
if (opts.fixHeader) {
    var lineNumber = 0;
    var header;

    var rl = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(opts.file)
    });

    rl.on('line', function (line) {
        if (lineNumber === 0) {
            header = line.split('\t');

            // use default suggested header if none supplied
            if (opts.fixHeader === true)
                var suggestedHeader = getSuggestedHeader(header);
            else
                var suggestedHeader = opts.fixHeader.split(',')

            // write new header
            console.log(suggestedHeader.join('\t'))
        } else {
            // write file stream line
            console.log(line)
        }

        lineNumber += 1;
    });

    rl.on('close', function (line) {
        console.error('\n\x1b[36m'+'Replaced header with:'+'\x1b[0m', suggestedHeader.join('\t'));
    });

} else if (opts.split) {
    console.error('\n\x1b[36m'+'Spliting file into rows of:'+'\x1b[0m', opts.split);

    var lineNumber = 0;
    var header;

    var rl = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(opts.file)
    });

    rl.on('line', function (line) {
        if (lineNumber === 0) {
            header = line.split('\t');

            // use default suggested header if a comma-separated list is not supplied
            // otherwise, use list            
            if (opts.fixHeader && opts.fixHeader === true)
                var suggestedHeader = getSuggestedHeader(header);
            else if (opts.fixHeader)
                var suggestedHeader = opts.fixHeader.split(',');
            else 
                var suggestedHeader = line.split('\t');

            // write new header
            console.log(suggestedHeader.join('\t'))
        } else {
            // write file stream line
            console.log(line)
        }

        if (lineNumber > opts.split - 1) {
            console.error('****Stoping at line', lineNumber);
            rl.pause(); rl.close()
            process.exit(0);            
        }
        lineNumber += 1;
    });

    rl.on('close', function (line) {
        console.error('\n\x1b[36m'+'Split files.'+'\x1b[0m');
    });
} else {
    var lineNumber = 0;
    var header;

    var rl = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(opts.file)
    });

    rl.on('line', function (line) {

        // print info on header
        if (lineNumber === 0) {
            header = line.split('\t');
            suggestedHeader = getSuggestedHeader(header);

            if (!opts.debug && !opts.insertValue) {
                console.log('\n\x1b[36m'+'column count:'+'\x1b[0m', header.length)
                console.log('\n\x1b[36m'+'Raw column names:'+'\x1b[0m',header.join(','))
                console.log('\n\x1b[36m'+'Suggested column names:'+'\x1b[0m', suggestedHeader.join(','))
                console.log('\n\x1b[36m'+'Suggested header:'+'\x1b[0m', suggestedHeader.join('\t'), '\n')
            }
        }

        // if line is supplied, only print info on that line
        if (opts.line && opts.line == lineNumber) {
            var cols = line.split('\t');

            for (var i=0; i<cols.length; i++) {
                console.log(util.format('%s:     %s', header[i], cols[i] ))
            }
            rl.pause();
            rl.close()
            process.exit(0);
        }

        // if --debug, print any issues with columns to stdout
        if (opts.debug) {
            var cols = line.split('\t');

            if (cols.length !== header.length)
                console.log('\x1b[36m'+'At line:', lineNumber, ': unmatching columns of length',
                              cols.length, 'and', header.length,'\x1b[0m:', line);
        }


        // if inserting something print issues to stdout, 
        if (opts.insertValue) {
            var cols = line.split('\t');

            if (cols.length !== header.length) {
                console.error('At line:', lineNumber, ': unmatching columns of length',
                              cols.length, 'and', header.length, '\x1b[36m(fixed)\x1b[0m')

                cols.splice(opts.insertAtColumn, 0, opts.insertValue);
                console.error('new column:', cols.join('\t'))
                console.log( cols.join('\t') );
            } else {
                console.log( line );
            }
        }

        lineNumber += 1;
    });
}


// Default for suggested header.  
// --fix-header will use this if a comma-delimited list is not provided.
function getSuggestedHeader(header) {
    var suggestedHeader = [];
    for (var i=0; i<header.length; i++) {
        suggestedHeader.push( header[i].toLowerCase().replace(/ /g, '_') )
    }
    return suggestedHeader;
}
