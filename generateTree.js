const dree = require('dree');
const fs = require('fs');
const path = require('path');

// Define the directory you want to scan
const directoryPath = path.join(__dirname, './src');

// Generate the directory tree
const tree = dree.parse(directoryPath);

// Output the tree to the console
console.log(tree);

// Optionally, save the tree to a text file
fs.writeFileSync('directoryTree.txt', tree);
