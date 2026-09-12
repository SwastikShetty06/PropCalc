const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { createMediaFromFile, createMediaFromBase64 } = require('../src/sequenceRunner');

console.log('Running unit tests for Sequence Engine...');

// Test 1: Test MessageMedia from Base64
const sampleBase64 = Buffer.from('Test PDF Content').toString('base64');
const mediaB64 = createMediaFromBase64(sampleBase64, 'application/pdf', 'sample.pdf');

assert.strictEqual(mediaB64.mimetype, 'application/pdf', 'MIME type should match');
assert.strictEqual(mediaB64.filename, 'sample.pdf', 'Filename should match');
assert.strictEqual(mediaB64.data, sampleBase64, 'Base64 data should match');
console.log('✓ Test 1 Passed: createMediaFromBase64 creates valid MessageMedia');

// Test 2: Test MessageMedia from File
const testFilePath = path.join(__dirname, 'test_doc.txt');
fs.writeFileSync(testFilePath, 'Hello World Document');

const mediaFile = createMediaFromFile(testFilePath, 'custom_name.txt');
assert.strictEqual(mediaFile.filename, 'custom_name.txt', 'Custom filename should be assigned');
assert.ok(mediaFile.data.length > 0, 'Data should be loaded from file');
console.log('✓ Test 2 Passed: createMediaFromFile loads file data accurately');

// Clean up test file
fs.unlinkSync(testFilePath);

console.log('\nAll unit tests passed successfully!\n');
