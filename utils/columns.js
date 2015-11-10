#!/usr/bin/env node
var fs = require('fs'),
    util = require('util');

/*
var parse = require('comment-parser'),
	opts = require('commander');

opts.version('0.0.1')
    .option('-f, --file [value]', 'File to parse')
    .parse(process.argv);
*/

console.log('\n\x1b[36m'+'parsing file:'+'\x1b[0m', process.argv[2])
fs.readFile(process.argv[2], 'utf8', function (err,data) {
    if (err) return console.log(err);

    var lines = data.split('\n')

    var header = lines[0].split('\t');    

    var suggestedHeader = [];
    for (var i=0; i<header.length; i++) {
        suggestedHeader.push( header[i].toLowerCase() )
    }

    console.log('\n\x1b[36m'+'column count:'+'\x1b[0m', header.length)
    console.log('\n\x1b[36m'+'Raw column names:'+'\x1b[0m',header.join(','))
    console.log('\n\x1b[36m'+'Suggested column names:'+'\x1b[0m', suggestedHeader.join(','))
    console.log('\n\x1b[36m'+'Suggested header:'+'\x1b[0m', suggestedHeader.join('\t'), '\n')    

    if (process.argv[3] == 0) {
        console.log(header);
    } else {
        var row = lines[process.argv[3]];

        var cols = row.split('\t');

        for (var i=0; i<cols.length; i++) {
            console.log(util.format('%s:     %s', header[i], cols[i] ))
        }
    }

    console.log('\n')

});
