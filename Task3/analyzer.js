const fs = require('fs');
const path = require('path');

function analyzeFunction() {
    const codePath = path.join(__dirname, 'discount.js');
    const code = fs.readFileSync(codePath, 'utf8');

    const checklist = [];
    checklist.push('# 📝 Test Case Checklist: applyDiscount');

    // 1. Errors/Validation
    checklist.push('\n## 🛑 Validation');
    if (code.includes("price < 0")) {
        checklist.push('* **Price is negative (-10)**: Should throw "Invalid price"');
    }

    // 2. Customer Types
    checklist.push('\n## 👤 Customer Types');
    const customerTypes = code.match(/customerType === '(\w+)'/g) || [];
    customerTypes.forEach(match => {
        const type = match.match(/'(\w+)'/)[1];
        const discount = type === 'vip' ? '15%' : '5%';
        checklist.push(`* **Customer is ${type}**: Apply ${discount} discount`);
    });
    checklist.push('* **No customer type**: Apply 0% discount');

    // 3. Coupons
    checklist.push('\n## 🎫 Coupons');
    const coupons = code.match(/couponCode === '(\w+)'/g) || [];
    coupons.forEach(match => {
        const codeStr = match.match(/'(\w+)'/)[1];
        const val = codeStr === 'SAVE20' ? '20%' : '10%';
        checklist.push(`* **Use code ${codeStr}**: Apply ${val} (Max discount logic)`);
    });

    // 4. Edge Cases
    checklist.push('\n## ⚡ Edge Cases');
    checklist.push('* **Price is exactly 0**: Return 0');
    checklist.push('* **Large price value**: Correct rounding');

    const outputPath = path.join(__dirname, 'TEST_CHECKLIST.md');
    fs.writeFileSync(outputPath, checklist.join('\n'));
    console.log(`✅ Checklist generated at: ${outputPath}`);
}

analyzeFunction();
