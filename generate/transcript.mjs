import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk/index.mjs';

console.log('🔄 Initializing transcript.mjs module');

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

async function generateTranscript(topic, agentA, agentB, duration) {
	console.log('📝 Starting generateTranscript with params:', {
		topic,
		agentA,
		agentB,
		duration,
	});

	try {
		console.log('🤖 Creating Groq chat completion...');
		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `Create a dialogue for a short-form conversation on the topic of ${topic}. The conversation should be between two agents, ${agentA.replace(
						'_',
						' '
					)} and ${agentB}, each with their unique mannerisms and speech patterns. ${agentA.replace(
						'_',
						' '
					)} should engage with the topic with a sense of scientific curiosity and a desire for practical understanding, while ${agentB.replace(
						'_',
						' '
					)} offers a detailed, analytical perspective based on evidence and research. The dialogue should be engaging and include light humor rooted in scientific analogies or concepts, yet still provide meaningful, accurate insights into ${topic}. Limit the dialogue to a maximum of ${
						duration * 7
					} exchanges, aiming for a concise transcript that would last between ${duration} minutes. The person attribute should either be ${agentA} or ${agentB}. The line attribute should be that character's line of dialogue. It should delve into thought-provoking concepts while maintaining a dynamic and conversational tone, balancing intrigue with scientific rigor. I also need an asset description under the asset attribute which would be a relevant search query to find an image that aligns with the scientific nature of the conversation. The asset descriptions shouldn't be vague but should describe specific, scientifically relevant imagery that supports the dialogue's theme. Avoid direct mention of politicians; instead, use general descriptors or features to convey similar ideas in a neutral way. The JSON format WHICH MUST BE ADHERED TO ALWAYS is as follows: { transcript: { [ {'person': 'the exact value of ${agentA} or ${agentB} depending on who is talking', 'line': 'their line of conversation in the dialog', asset: 'relevant search query based on the current line'} ] } }`,
				},
				{
					role: 'user',
					content: `Generate a scientific discussion video about ${topic}. Both the agents should discuss it in a way that emphasizes their respective traits, with ${agentA.replace(
						'_',
						' '
					)} showing an applied interest and ${agentB.replace(
						'_',
						' '
					)} presenting deeper theoretical insights. Push their characteristics to the extreme to make the conversation captivating while ensuring the content remains scientifically accurate and thought-provoking.`,
				},
			],

			response_format: { type: 'json_object' },
			model: 'llama3-70b-8192',
			temperature: 0.5,
			max_tokens: 4096,
			top_p: 1,
			stop: null,
			stream: false,
		});

		console.log('✅ Chat completion received');
		const content = completion.choices[0]?.message?.content || '';
		console.log('📄 Content length:', content.length);

		return content;
	} catch (error) {
		console.error('❌ Error in generateTranscript:', error);
		throw error;
	}
}

function delay(ms) {
	console.log(`⏳ Delaying for ${ms}ms`);
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function transcriptFunction(
	topic,
	agentA,
	agentB,
	duration
) {
	console.log('🎬 Starting transcriptFunction with params:', {
		topic,
		agentA,
		agentB,
		duration,
	});

	let transcript = null;
	let attempts = 0;

	while (attempts < 5) {
		console.log(`🔄 Attempt ${attempts + 1}/5`);
		try {
			console.log('📝 Generating transcript...');
			const content = await generateTranscript(topic, agentA, agentB, duration);

			console.log('🔍 Parsing content...');
			transcript = content === '' ? null : JSON.parse(content);

			if (transcript !== null) {
				console.log('✅ Valid transcript generated');
				console.log('📜 Transcript lines:');
				transcript.transcript.forEach((entry, index) => {
					console.log(`${index + 1}. ${entry.person}: "${entry.line}"`);
					console.log(`   🖼️ Asset: ${entry.asset}`);
				});
				return transcript;
			} else {
				console.log('⚠️ Empty transcript received');
			}
		} catch (error) {
			console.error(`❌ Attempt ${attempts + 1} failed:`, error);
			console.log('⏳ Waiting before next attempt...');
			await delay(15000);
		}
		attempts++;
	}

	console.error('❌ All attempts failed');
	throw new Error(
		`Failed to generate valid transcript after 5 attempts for topic: ${topic}`
	);
}
