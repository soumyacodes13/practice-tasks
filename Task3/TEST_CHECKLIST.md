# 📝 Test Case Checklist: applyDiscount

## 🛑 Validation
* **Price is negative (-10)**: Should throw "Invalid price"

## 👤 Customer Types
* **Customer is vip**: Apply 15% discount
* **Customer is regular**: Apply 5% discount
* **No customer type**: Apply 0% discount

## 🎫 Coupons
* **Use code SAVE20**: Apply 20% (Max discount logic)
* **Use code SAVE10**: Apply 10% (Max discount logic)

## ⚡ Edge Cases
* **Price is exactly 0**: Return 0
* **Large price value**: Correct rounding