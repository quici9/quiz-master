import { Injectable, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

export interface ParsedQuestion {
    order: number;
    text: string;
    options: { label: string; text: string }[];
    correctAnswer: string;
}

export interface ParsedQuiz {
    questions: ParsedQuestion[];
    totalParsed: number;
    totalValid: number;
    errors: { question: number; questionText: string; message: string }[];
}

enum QuizTemplateType {
    EXPLICIT_ANSWER = 'EXPLICIT_ANSWER',  // Mẫu cũ: có dòng "Đáp án: X"
    BOLD_ANSWER = 'BOLD_ANSWER'           // Mẫu mới: đáp án in đậm
}

@Injectable()
export class ParserService {
    async parseDocx(buffer: Buffer): Promise<ParsedQuiz> {
        try {
            // Convert to both HTML and raw text
            const htmlResult = await mammoth.convertToHtml({ buffer });
            const textResult = await mammoth.extractRawText({ buffer });

            // Detect template type
            const templateType = this.detectTemplateType(textResult.value, htmlResult.value);

            console.log(`Detected template type: ${templateType}`);

            // Route to appropriate parser
            switch (templateType) {
                case QuizTemplateType.EXPLICIT_ANSWER:
                    return this.parseExplicitAnswerTemplate(textResult.value);
                case QuizTemplateType.BOLD_ANSWER:
                    return this.parseBoldAnswerTemplate(htmlResult.value);
                default:
                    throw new BadRequestException('Unknown template format');
            }
        } catch (error) {
            console.error('Parse error:', error);
            throw new BadRequestException('Failed to parse file: ' + error.message);
        }
    }

    private detectTemplateType(rawText: string, html: string): QuizTemplateType {
        // Check for explicit answer pattern
        if (/Đáp án[:\s]*[A-D]/i.test(rawText)) {
            return QuizTemplateType.EXPLICIT_ANSWER;
        }

        // Check for bold formatting in options
        // Pattern: option line with bold tags
        if (/<strong>[A-D]\..*?<\/strong>/i.test(html) || /<p><strong>[A-D]\..*?<\/strong><\/p>/i.test(html)) {
            return QuizTemplateType.BOLD_ANSWER;
        }

        throw new BadRequestException(
            'Cannot detect template format. Please ensure your document follows one of the supported formats: ' +
            '1) Questions with explicit "Đáp án: X" lines, or ' +
            '2) Questions with bold-formatted correct answers'
        );
    }

    private parseExplicitAnswerTemplate(rawText: string): ParsedQuiz {
        const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

        const questions: ParsedQuestion[] = [];
        let currentQuestion: any = null;

        for (const line of lines) {
            // Match question: "Câu 1. [text]" or "Câu 1: [text]"
            const questionMatch = line.match(/^Câu\s+(\d+)[\.:]\s*(.+)$/i);
            if (questionMatch) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }
                currentQuestion = {
                    order: parseInt(questionMatch[1]),
                    text: questionMatch[2],
                    options: [],
                    correctAnswer: null
                };
                continue;
            }

            // Match option: "A. [text]" or "A: [text]"
            const optionMatch = line.match(/^([A-D])[\.:]\s*(.+)$/i);
            if (optionMatch && currentQuestion) {
                const label = optionMatch[1].toUpperCase();
                // Remove existing option with same label if exists (last one wins)
                currentQuestion.options = currentQuestion.options.filter(opt => opt.label !== label);

                currentQuestion.options.push({
                    label: label,
                    text: optionMatch[2]
                });
                continue;
            }

            // Match correct answer: "Đáp án: B"
            const answerMatch = line.match(/^Đáp án[:\s]*([A-D])/i);
            if (answerMatch && currentQuestion) {
                currentQuestion.correctAnswer = answerMatch[1].toUpperCase();
                continue;
            }
        }

        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        return this.validateAndReturn(questions);
    }

    private parseBoldAnswerTemplate(html: string): ParsedQuiz {
        const questions: ParsedQuestion[] = [];
        let currentQuestion: any = null;

        // Split by paragraphs and headings
        const blocks = html.split(/<\/(?:p|h[1-6])>/i);

        for (let block of blocks) {
            // Remove HTML tags to get clean text, but keep track of bold sections
            const cleanBlock = block.replace(/<[^>]+>/g, '').trim();
            if (!cleanBlock) continue;

            // Match question: "Câu 1. [text]" or "Câu 1: [text]"
            const questionMatch = cleanBlock.match(/^Câu\s+(\d+)[\.:]\s*(.+)$/i);
            if (questionMatch) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }
                currentQuestion = {
                    order: parseInt(questionMatch[1]),
                    text: questionMatch[2],
                    options: [],
                    correctAnswer: null
                };
                continue;
            }

            // Match option: "A. [text]" or "A: [text]"
            const optionMatch = cleanBlock.match(/^([A-D])[\.:]\s*(.+)$/i);
            if (optionMatch && currentQuestion) {
                const label = optionMatch[1].toUpperCase();
                const optionText = optionMatch[2];

                // Check if this option is bold (correct answer)
                // The block should have <strong> tag wrapping the entire option or at least the label
                const isBold = /<strong>/.test(block);

                // Remove existing option with same label if exists
                currentQuestion.options = currentQuestion.options.filter(opt => opt.label !== label);

                currentQuestion.options.push({
                    label: label,
                    text: optionText
                });

                // If this option is bold, mark it as correct answer
                if (isBold && !currentQuestion.correctAnswer) {
                    currentQuestion.correctAnswer = label;
                }

                continue;
            }
        }

        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        return this.validateAndReturn(questions);
    }

    private validateAndReturn(questions: ParsedQuestion[]): ParsedQuiz {
        const validQuestions: ParsedQuestion[] = [];
        const errors: { question: number; questionText: string; message: string }[] = [];

        questions.forEach(q => {
            const issues: string[] = [];
            if (!q.text) issues.push('Missing question text');
            if (q.options.length < 2) issues.push(`Insufficient options (found ${q.options.length}, need at least 2)`);
            if (!q.correctAnswer) issues.push('Missing correct answer');
            else if (!q.options.some(opt => opt.label === q.correctAnswer)) issues.push(`Correct answer ${q.correctAnswer} not found in options`);

            if (issues.length > 0) {
                errors.push({
                    question: q.order,
                    questionText: q.text ? (q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text) : 'No text',
                    message: issues.join(', ')
                });
            } else {
                validQuestions.push(q);
            }
        });

        if (validQuestions.length === 0 && errors.length === 0) {
            throw new BadRequestException('No questions found in document');
        }

        return {
            questions: validQuestions,
            totalParsed: questions.length,
            totalValid: validQuestions.length,
            errors
        };
    }
}
