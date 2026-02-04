const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'candidates2026.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get data as JSON objects
const data = XLSX.utils.sheet_to_json(worksheet, { limit: 3 });

console.log('Column Headers:', Object.keys(data[0]));
console.log('First Row Example:', JSON.stringify(data[0], null, 2));
console.log('Second Row Example:', JSON.stringify(data[1], null, 2));
