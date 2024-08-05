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
    // Check if the API key is available
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    try {
        const { code, commentType, language } = await req.json();

        const systemPrompt = "You are a helpful programming assistant focused on industry standard code commenting. DO NOT STOP GENERATING UNTIL THE ENTIRE FILE IS COMPLETE, NO PLACEHOLDER TEXT.";

        const userPrompt = `Given the following ${language} code, provide comments based on the specified comment type ('${commentType}'). Here are the guidelines for each comment type:

  - simple: Add brief, essential comments to explain the main purpose of functions and complex logic.
  - moderate: Provide more detailed comments, including parameter descriptions and return values for functions.
  - detailed: Add comprehensive comments, including function descriptions, parameter and return value explanations, and explanations for complex logic or algorithms.
  - official: Use official documentation style (e.g., JSDoc for JavaScript) with full function descriptions, parameter and return value documentation, and any additional relevant information.

  Please comment the following code according to the '${commentType}' style:

  ${code}`;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        return NextResponse.json({ comments: chatCompletion.choices[0].message.content });
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