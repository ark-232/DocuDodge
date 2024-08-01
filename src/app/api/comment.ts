import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { code } = req.body;
            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { "role": "system", "content": "You are a helpful programming assistant focused on industry standard code commenting. DO NOT STOP GENERATING UNTIL THE ENTIRE FILE IS COMPLETE, NO PLACEHOLDER TEXT." },
                    { "role": "user", "content": `Based on the language the code is written in, Comment and document the following code (ONLY PROVIDE THE COMMENTED CODE IN RESPONSE):\n${code}` },
                ],
            });
            res.status(200).json(response.data.choices[0].message?.content);
        } catch (error) {
            res.status(500).json({ error: 'Error processing code: ' + error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}