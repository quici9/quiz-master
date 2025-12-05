// Test script for parser service
const fs = require('fs');
const path = require('path');

// Import the compiled parser service
const { ParserService } = require('./dist/src/quizzes/services/parser.service');

async function testParser() {
    const parser = new ParserService();

    console.log('='.repeat(80));
    console.log('TESTING MULTI-TEMPLATE QUIZ PARSER');
    console.log('='.repeat(80));

    // Test 1: Old template (hihi.docx - explicit answer)
    console.log('\n📄 TEST 1: Old Template (hihi.docx - Explicit Answer)');
    console.log('-'.repeat(80));
    try {
        const hihiBuffer = fs.readFileSync(path.join(__dirname, '../sample_data/hihi.docx'));
        const hihiResult = await parser.parseDocx(hihiBuffer);

        console.log(`✅ Parsed successfully!`);
        console.log(`   Total parsed: ${hihiResult.totalParsed}`);
        console.log(`   Valid questions: ${hihiResult.totalValid}`);
        console.log(`   Errors: ${hihiResult.errors.length}`);

        if (hihiResult.questions.length > 0) {
            const q1 = hihiResult.questions[0];
            console.log(`\n   Sample Question ${q1.order}:`);
            console.log(`   Q: ${q1.text.substring(0, 80)}...`);
            console.log(`   Options: ${q1.options.map(o => o.label).join(', ')}`);
            console.log(`   Correct: ${q1.correctAnswer}`);
        }

        if (hihiResult.errors.length > 0) {
            console.log(`\n   ⚠️  Sample Error:`);
            console.log(`   Question ${hihiResult.errors[0].question}: ${hihiResult.errors[0].message}`);
        }
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }

    // Test 2: New template (haha.docx - bold answer)
    console.log('\n📄 TEST 2: New Template (haha.docx - Bold Answer)');
    console.log('-'.repeat(80));
    try {
        const hahaBuffer = fs.readFileSync(path.join(__dirname, '../sample_data/haha.docx'));
        const hahaResult = await parser.parseDocx(hahaBuffer);

        console.log(`✅ Parsed successfully!`);
        console.log(`   Total parsed: ${hahaResult.totalParsed}`);
        console.log(`   Valid questions: ${hahaResult.totalValid}`);
        console.log(`   Errors: ${hahaResult.errors.length}`);

        if (hahaResult.questions.length > 0) {
            const q1 = hahaResult.questions[0];
            console.log(`\n   Sample Question ${q1.order}:`);
            console.log(`   Q: ${q1.text.substring(0, 80)}...`);
            console.log(`   Options: ${q1.options.map(o => o.label).join(', ')}`);
            console.log(`   Correct: ${q1.correctAnswer}`);
        }

        if (hahaResult.errors.length > 0) {
            console.log(`\n   ⚠️  Errors found:`);
            hahaResult.errors.slice(0, 3).forEach(err => {
                console.log(`   Question ${err.question}: ${err.message}`);
            });
        }
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }

    // Test 3: Error template (mau_sai.docx)
    console.log('\n📄 TEST 3: Error Template (mau_sai.docx - Should show errors)');
    console.log('-'.repeat(80));
    try {
        const errorBuffer = fs.readFileSync(path.join(__dirname, '../sample_data/mau_sai.docx'));
        const errorResult = await parser.parseDocx(errorBuffer);

        console.log(`✅ Parsed (with errors expected)`);
        console.log(`   Total parsed: ${errorResult.totalParsed}`);
        console.log(`   Valid questions: ${errorResult.totalValid}`);
        console.log(`   Errors: ${errorResult.errors.length}`);

        if (errorResult.errors.length > 0) {
            console.log(`\n   📝 Error details:`);
            errorResult.errors.forEach(err => {
                console.log(`   - Question ${err.question}: ${err.message}`);
            });
        }
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(80));
}

testParser().catch(console.error);
