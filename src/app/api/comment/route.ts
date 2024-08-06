import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load the .env.local file
config({ path: resolve(process.cwd(), './src/.env.local') });

// Check if the API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in the environment variables');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    try {
        const { code, commentType, language } = await req.json();

        const systemPrompt = "You are a programming assistant focused on comprehensive code commenting. Comment EVERY line of code provided, including import statements, variable declarations, and closing brackets. Do not add or remove any code, only add comments.";

        const userPrompt = `Add ${commentType} comments to the following ${language} code. Comment EVERY line, including imports, declarations, and closing brackets. Return ONLY the commented code, without any additional text or code tags. Here are the guidelines for each comment type:

- simple: Brief, essential comments explaining the main purpose of each line or block.
- moderate: More detailed comments, including brief descriptions for functions and variables.
- detailed: Comprehensive comments, explaining the purpose and functionality of each line.
- official: Use official documentation style (e.g., JSDoc for JavaScript) where applicable, with full descriptions for functions, parameters, and return values.

Code to comment:

${code}`;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        const content = chatCompletion.choices[0].message.content;
        
        if (content === null) {
            throw new Error('Received null response from OpenAI');
        }

        // Remove any code block markers (```) at the start or end of the content
        const commentedCode = content.replace(/^```[\s\S]*?\n|```$/gm, '').trim();

        return NextResponse.json({ comments: commentedCode });
    } catch (error) {
        console.error('Error in API route:', error);
        if (error instanceof Error) {
            if (error.message.includes('429') || error.message.includes('quota')) {
                return NextResponse.json({ error: 'Service temporarily unavailable due to high demand. Please try again later.' }, { status: 503 });
            }
            return NextResponse.json({ error: 'Error processing code: ' + error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}