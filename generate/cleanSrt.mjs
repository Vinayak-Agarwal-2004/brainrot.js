import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCleanSrt(transcript, srt) {
	const promises = [];
	for (let i = 0; i < transcript.length; i++) {
		promises.push(cleanSrt(transcript[i].line, srt[i].content, i));
	}
	const responses = await Promise.all(promises);

	for (let i = 0; i < srt.length; i++) {
		const response = responses.find((response) => response.i === i);
		if (response) {
			await writeFile(srt[i].fileName, response.content, 'utf8');
		}
	}
}

async function cleanSrt(transcript, srt, i) {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `The first item I will provide is the accurate transcript text, followed by the SRT file text that may contain inaccuracies or missing words. Your task is to compare the accurate transcript with the SRT file and make corrections to the SRT file, ensuring it matches the transcript.'	
                            
                            transcript: 
                            ${transcript}
                            
                            srt file text: 
                            ${srt}`,
			},
		],
		model: 'gpt-4-turbo-2024-04-09',
	});

	const content = completion.choices[0].message.content;
	return { content, i };
}
