const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'candidates2026.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get data as JSON array of arrays to see raw structure
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, limit: 5 });

console.log('Sheet Name:', sheetName);
console.log('Data Structure:');
console.log(JSON.stringify(data, null, 2));
