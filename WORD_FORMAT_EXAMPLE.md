# 📄 Word Document Format Guide

This document explains the expected format for quiz Word documents (.docx) that can be uploaded to the Quiz Practice System.

---

## ✅ Correct Format

### Basic Structure

```
Câu 1. What is the primary use of SVM algorithm?
A. Reinforcement Learning
B. Clustering
C. Classification
D. Regression
Đáp án: C

Câu 2. What does CNN stand for in deep learning?
A. Computer Neural Network
B. Cloud Neural Network
C. Convolutional Neural Network
D. Centralized Neural Network
Đáp án: C

Câu 3. Which technique is used to prevent overfitting in neural networks?
A. Increasing training data
B. Dropout
C. Batch normalization
D. All of the above
Đáp án: D
```

---

## 📋 Format Rules

### 1. Question Format
- **Must start with:** `Câu [number].`
- **Followed by:** Question text
- **Example:** `Câu 1. What is artificial intelligence?`

**Valid variations:**
- `Câu 1. Question text?`
- `Câu 2. Question text.`
- `Câu 10. Question text`
- `Câu 100. Question text`

**Invalid:**
```
Question 1. Text  ❌ (Must use "Câu")
1. Text           ❌ (Missing "Câu")
Cau 1. Text       ❌ (Missing dấu)
```

---

### 2. Options Format
- **Must start with:** Capital letter `A.`, `B.`, `C.`, or `D.`
- **Followed by:** Option text
- **Minimum:** 2 options (A, B)
- **Maximum:** 4 options (A, B, C, D)

**Valid:**
```
A. Option text
B. Another option
C. Third option
D. Fourth option
```

**Invalid:**
```
a. Option     ❌ (Lowercase)
1. Option     ❌ (Number instead of letter)
E. Option     ❌ (Only A-D allowed)
A) Option     ❌ (Must use period, not parenthesis)
```

---

### 3. Correct Answer Format
- **Must be:** `Đáp án: [letter]`
- **Letter must be:** One of A, B, C, or D
- **Case insensitive:** `Đáp án: A` or `Đáp án: a` both work

**Valid:**
```
Đáp án: A
Đáp án: B
Đáp án: C
Đáp án: D
Đáp án: a  (will be normalized to A)
```

**Invalid:**
```
Dap an: A        ❌ (Missing dấu)
Answer: A        ❌ (Must be in Vietnamese)
Đáp án A         ❌ (Missing colon)
Đáp án: E        ❌ (Only A-D allowed)
Đáp án: 1        ❌ (Must be letter, not number)
```

---

## 📝 Complete Example

### Example 1: Simple Quiz (5 questions)

```
Câu 1. Thuật toán "Support Vector Machine" (SVM) thường được sử dụng cho tác vụ nào trong AI?
A. Học tăng cường (Reinforcement Learning)
B. Phân cụm (Clustering)
C. Hồi quy (Regression)
D. Phân loại (Classification)
Đáp án: D

Câu 2. Trong Mạng nơ-ron tích chập (CNN), "Convolutional Layer" có chức năng gì?
A. Làm phẳng dữ liệu đầu vào
B. Tính toán xác suất cuối cùng
C. Trích xuất các đặc trưng từ dữ liệu hình ảnh
D. Tạo nhãn cho dữ liệu
Đáp án: C

Câu 3. Phương pháp "Drop out" được sử dụng trong việc huấn luyện mạng nơ-ron sâu để giải quyết vấn đề gì?
A. Tăng tốc độ huấn luyện
B. Giảm thiểu hiện tượng quá khớp
C. Tăng lượng dữ liệu đầu vào
D. Cải thiện độ chính xác trên dữ liệu huấn luyện
Đáp án: B

Câu 4. "Transfer Learning" (Học chuyển giao) là một kỹ thuật AI mạnh mẽ, ý nghĩa của nó là gì?
A. Huấn luyện một mô hình từ đầu cho mỗi tác vụ mới
B. Tái sử dụng một mô hình cho các tác vụ tương tự
C. Chuyển dữ liệu từ mô hình này sang mô hình khác
D. Chuyển đổi mô hình huấn luyện
Đáp án: B

Câu 5. "RNN" (Recurrent Neural Networks) được thiết kế đặc biệt để xử lý loại dữ liệu nào hiệu quả nhất?
A. Dữ liệu hình ảnh tĩnh
B. Dữ liệu có tính tuần tự, chuỗi thời gian
C. Dữ liệu cơ sở dữ liệu dạng bảng
D. Dữ liệu dưới dạng sơ đồ
Đáp án: B
```

---

## ⚠️ Common Mistakes

### Mistake 1: Missing blank line between questions
```
❌ Wrong:
Câu 1. Question text?
A. Option A
Đáp án: A
Câu 2. Next question?  ← No blank line

✅ Correct:
Câu 1. Question text?
A. Option A
Đáp án: A
                        ← Blank line here
Câu 2. Next question?
```

### Mistake 2: Inconsistent numbering
```
❌ Wrong:
Câu 1. Question
Câu 3. Question  ← Skipped Câu 2
Câu 4. Question

✅ Correct:
Câu 1. Question
Câu 2. Question
Câu 3. Question
```

### Mistake 3: Options not on separate lines
```
❌ Wrong:
Câu 1. Question?
A. Option A B. Option B  ← Multiple options on same line

✅ Correct:
Câu 1. Question?
A. Option A
B. Option B
```

### Mistake 4: Answer before all options
```
❌ Wrong:
Câu 1. Question?
A. Option A
Đáp án: B  ← Answer before all options listed
B. Option B

✅ Correct:
Câu 1. Question?
A. Option A
B. Option B
C. Option C
D. Option D
Đáp án: B
```

---

## 🔍 Validation Rules

The system will validate uploaded documents with these rules:

### ✅ Valid Question Criteria:
1. Has question text (after "Câu X.")
2. Has at least 2 options (A, B minimum)
3. Has correct answer specified
4. Correct answer matches one of the options (A, B, C, or D)

### ❌ Invalid Questions (Will be Skipped):
- Missing question text
- Less than 2 options
- No correct answer specified
- Correct answer doesn't match any option
- Malformed format

---

## 📊 Parser Behavior

### What happens during upload:

1. **File Upload:** Admin uploads .docx file
2. **Text Extraction:** System extracts raw text using mammoth library
3. **Parsing:** System identifies questions, options, and answers using regex
4. **Validation:** Each question is validated against rules
5. **Storage:** Valid questions are saved to database
6. **Report:** System shows how many questions were parsed and how many are valid

### Example Output:
```json
{
  "quiz": {
    "id": "uuid",
    "title": "AI & Machine Learning Quiz",
    "totalQuestions": 48
  },
  "stats": {
    "totalParsed": 50,
    "totalValid": 48,
    "skipped": 2
  }
}
```

In this example:
- 50 questions found in document
- 48 passed validation
- 2 were skipped (likely due to format issues)

---

## 💡 Tips for Creating Quiz Documents

### 1. Use a Template
Start with this template and fill in your questions:

```
Câu 1. [Your question here]?
A. [Option A]
B. [Option B]
C. [Option C]
D. [Option D]
Đáp án: [A/B/C/D]

Câu 2. [Your question here]?
A. [Option A]
B. [Option B]
C. [Option C]
D. [Option D]
Đáp án: [A/B/C/D]
```

### 2. Consistency is Key
- Always use "Câu X." format
- Always use period after letter (A., B., C., D.)
- Always use "Đáp án:" format
- Always add blank line between questions

### 3. Test Small First
- Start with 5-10 questions
- Upload and verify parsing works
- Then create full quiz

### 4. Double-Check Answers
- Make sure correct answer letter matches an option
- Common mistake: Đáp án: B but only have options A and C

### 5. Use Find & Replace
- Search for "Dap an" and replace with "Đáp án"
- Search for "Cau" and replace with "Câu"
- Search for "a." and replace with "A."

---

## 🛠️ Creating Documents

### Recommended Software:
1. **Microsoft Word** (Windows/Mac)
2. **LibreOffice Writer** (Free, cross-platform)
3. **Google Docs** (export as .docx)

### Export Settings:
- Format: `.docx` (Word 2007 or later)
- NOT `.doc` (old Word format)
- NOT `.pdf` or `.txt`

### Character Encoding:
- Use UTF-8 encoding
- Vietnamese characters should display correctly
- If seeing "?" or boxes, fix encoding

---

## 🧪 Testing Your Document

### Before uploading, verify:

1. **File format:** Is it .docx?
2. **Question count:** How many questions?
3. **Numbering:** Are questions numbered 1, 2, 3... sequentially?
4. **Format:** Do all questions follow the pattern?
5. **Answers:** Does each question have a correct answer?
6. **Options:** Does each question have at least 2 options?

### Quick Test Checklist:
```
[ ] File is .docx format
[ ] All questions start with "Câu X."
[ ] All options use A., B., C., D. format
[ ] All questions have "Đáp án:" line
[ ] All answers (A/B/C/D) match existing options
[ ] Blank lines between questions
[ ] No extra text before first question
[ ] Vietnamese characters display correctly
```

---

## 📞 Troubleshooting Upload Issues

### Issue: "No valid questions found"
**Possible causes:**
- Document is empty
- Questions don't follow format
- Missing "Câu X." prefix
- Missing "Đáp án:" lines

**Solution:** Review format rules above and fix document

---

### Issue: "Only X out of Y questions imported"
**Possible causes:**
- Some questions missing options
- Some questions missing answers
- Answer letters don't match options

**Solution:** Check validation logs to see which questions failed

---

### Issue: "File parsing failed"
**Possible causes:**
- File is corrupted
- File is not .docx format
- File is password protected

**Solution:** Re-save file as .docx and try again

---

## 📚 Additional Examples

### Example with 3 options (valid):
```
Câu 1. Which is a programming language?
A. Python
B. HTML
C. CSS
Đáp án: A
```

### Example with 2 options (valid):
```
Câu 1. Is AI useful?
A. Yes
B. No
Đáp án: A
```

### Example with long question text (valid):
```
Câu 1. In the context of machine learning and artificial intelligence, 
which algorithm is primarily used for classification tasks when dealing 
with high-dimensional data and requires finding an optimal hyperplane?
A. K-Means Clustering
B. Support Vector Machine
C. Decision Trees
D. Linear Regression
Đáp án: B
```

### Example with special characters (valid):
```
Câu 1. What is 2 + 2?
A. 3
B. 4
C. 5
D. 6
Đáp án: B
```

---

## ✅ Final Checklist

Before uploading your quiz document:

```
✓ Document is saved as .docx
✓ All questions follow "Câu X." format
✓ All options follow "A. / B. / C. / D." format
✓ All answers follow "Đáp án: [letter]" format
✓ Each question has 2-4 options
✓ Each answer letter matches an existing option
✓ Questions are numbered sequentially
✓ Blank lines separate questions
✓ Vietnamese characters display correctly
✓ No password protection on file
✓ File size is reasonable (< 10MB)
```

---

**🎯 Remember:** The system will skip invalid questions and import only valid ones. 
Always check the upload result to see how many questions were successfully imported.

**Need Help?** Contact your system administrator with:
1. The Word file you're trying to upload
2. Error message received
3. Number of questions in your document
