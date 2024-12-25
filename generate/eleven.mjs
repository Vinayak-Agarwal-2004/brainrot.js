// Final Comprehensive Script for Generating Transcript Audio and Videos
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
import transcriptFunction from './transcript.mjs';
import { writeFile } from 'fs/promises';
import { query } from './dbClient.mjs';

dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log('🔄 Initializing script');

export async function generateTranscriptAudio(
    local,
    topic,
    agentA,
    agentB,
    ai,
    fps,
    duration,
    background,
    music,
    videoId,
    randomizeBackground
) {
    console.log('⭐ Starting generateTranscriptAudio with params:', {
        local,
        topic,
        agentA,
        agentB,
        ai,
        duration,
        background,
    });

    try {
        if (!local) {
            console.log('📝 Updating video status - Generating transcript');
            await query(
                "UPDATE `pending-videos` SET status = 'Generating transcript', progress = 0 WHERE video_id = ?",
                [videoId]
            );
        }

        console.log('📜 Getting transcript from transcriptFunction');
        let transcript = (await transcriptFunction(topic, agentA, agentB, duration)).transcript;
        console.log('✅ Transcript generated:', transcript.length, 'entries');

        const audios = [];

        if (!local) {
            console.log('📝 Updating video status - Fetching images');
            await query(
                "UPDATE `pending-videos` SET status = 'Fetching images', progress = 5 WHERE video_id = ?",
                [videoId]
            );
        }

        console.log('🖼️ Starting fetchValidImages');
        const images = await fetchValidImages(
            transcript,
            transcript.length,
            ai,
            duration
        );
        console.log('✅ Images fetched:', images.length);

        if (!local) {
            await query(
                "UPDATE `pending-videos` SET status = 'Generating audio', progress = 12 WHERE video_id = ?",
                [videoId]
            );
        }

        for (let i = 0; i < transcript.length; i++) {
            const person = transcript[i].person;
            const line = transcript[i].line;

            const voice_id =
    person === '50_CENT' ? process.env.FIFTY_CENT_VOICE_ID :
    person === 'ALEX_JONES' ? process.env.ALEX_JONES_VOICE_ID :
    person === 'ANDERSON_COOPER' ? process.env.ANDERSON_COOPER_VOICE_ID :
    person === 'ANDREW_TATE' ? process.env.ANDREW_TATE_VOICE_ID :
    person === 'ANDREW_YANG' ? process.env.ANDREW_YANG_VOICE_ID :
    person === 'ANGELA_MERKEL' ? process.env.ANGELA_MERKEL_VOICE_ID :
    person === 'ANGIE' ? process.env.ANGIE_VOICE_ID :
    person === 'ANNA_KENDRICK' ? process.env.ANNA_KENDRICK_VOICE_ID :
    person === 'ANTHONY_FAUCI' ? process.env.ANTHONY_FAUCI_VOICE_ID :
    person === 'ANTONIO_BANDERAS' ? process.env.ANTONIO_BANDERAS_VOICE_ID :
    person === 'AOC' ? process.env.AOC_VOICE_ID :
    person === 'ARIANA_GRANDE' ? process.env.ARIANA_GRANDE_VOICE_ID :
    person === 'ARNOLD_SCHWARZENEGGER' ? process.env.ARNOLD_SCHWARZENEGGER_VOICE_ID :
    person === 'BEN_AFFLECK' ? process.env.BEN_AFFLECK_VOICE_ID :
person === 'BARACK_OBAMA' ? process.env.BARACK_OBAMA_VOICE_ID : 
   person === 'BEN_SHAPIRO' ? process.env.BEN_SHAPIRO_VOICE_ID :
    person === 'BERNIE_SANDERS' ? process.env.BERNIE_SANDERS_VOICE_ID :
    person === 'BEYONCE' ? process.env.BEYONCE_VOICE_ID :
    person === 'BILL_CLINTON' ? process.env.BILL_CLINTON_VOICE_ID :
    person === 'BILL_GATES' ? process.env.BILL_GATES_VOICE_ID :
    person === 'BILL_OREILLY' ? process.env.BILL_OREILLY_VOICE_ID :
    person === 'BILLIE_EILISH' ? process.env.BILLIE_EILISH_VOICE_ID :
    person === 'CARDI_B' ? process.env.CARDI_B_VOICE_ID :
    person === 'CASEY_AFFLECK' ? process.env.CASEY_AFFLECK_VOICE_ID :
    person === 'CHARLAMAGNE' ? process.env.CHARLAMAGNE_VOICE_ID :
    person === 'CONOR_MCGREGOR' ? process.env.CONOR_MCGREGOR_VOICE_ID :
    person === 'DARTH_VADER' ? process.env.DARTH_VADER_VOICE_ID :
    person === 'DEMI_LOVATO' ? process.env.DEMI_LOVATO_VOICE_ID :
    person === 'DJ_KHALED' ? process.env.DJ_KHALED_VOICE_ID :
    person === 'DONALD_TRUMP' ? process.env.DONALD_TRUMP_VOICE_ID :
    person === 'DR_DRE' ? process.env.DR_DRE_VOICE_ID :
    person === 'DR_PHIL' ? process.env.DR_PHIL_VOICE_ID :
    person === 'DRAKE' ? process.env.DRAKE_VOICE_ID :
    person === 'DWAYNE_JOHNSON' ? process.env.DWAYNE_JOHNSON_VOICE_ID :
    person === 'ELIZABETH_HOLMES' ? process.env.ELIZABETH_HOLMES_VOICE_ID :
    person === 'ELLEN_DEGENERES' ? process.env.ELLEN_DEGENERES_VOICE_ID :
    person === 'ELON_MUSK' ? process.env.ELON_MUSK_VOICE_ID :
    person === 'EMMA_WATSON' ? process.env.EMMA_WATSON_VOICE_ID :
    person === 'GILBERT_GOTTFRIED' ? process.env.GILBERT_GOTTFRIED_VOICE_ID :
    person === 'GRETA_THUNBERG' ? process.env.GRETA_THUNBERG_VOICE_ID :
    person === 'GRIMES' ? process.env.GRIMES_VOICE_ID :
    person === 'HILLARY_CLINTON' ? process.env.HILLARY_CLINTON_VOICE_ID :
    person === 'JASON_ALEXANDER' ? process.env.JASON_ALEXANDER_VOICE_ID :
    person === 'JAY_Z' ? process.env.JAY_Z_VOICE_ID :
    person === 'JEFF_BEZOS' ? process.env.JEFF_BEZOS_VOICE_ID :
    person === 'JERRY_SEINFELD' ? process.env.JERRY_SEINFELD_VOICE_ID :
    person === 'JIM_CRAMER' ? process.env.JIM_CRAMER_VOICE_ID :
    person === 'JOE_BIDEN' ? process.env.JOE_BIDEN_VOICE_ID :
    person === 'JOE_ROGAN' ? process.env.JOE_ROGAN_VOICE_ID :
    person === 'JOHN_CENA' ? process.env.JOHN_CENA_VOICE_ID :
    person === 'JORDAN_PETERSON' ? process.env.JORDAN_PETERSON_VOICE_ID :
    person === 'JUSTIN_BIEBER' ? process.env.JUSTIN_BIEBER_VOICE_ID :
    person === 'JUSTIN_TRUDEAU' ? process.env.JUSTIN_TRUDEAU_VOICE_ID :
    person === 'KAMALA_HARRIS' ? process.env.KAMALA_HARRIS_VOICE_ID :
    person === 'KANYE_WEST' ? process.env.KANYE_WEST_VOICE_ID :
    person === 'KARDASHIAN' ? process.env.KARDASHIAN_VOICE_ID :
    person === 'KERMIT' ? process.env.KERMIT_VOICE_ID :
    person === 'KEVIN_HART' ? process.env.KEVIN_HART_VOICE_ID :
    person === 'LEX_FRIDMAN' ? process.env.LEX_FRIDMAN_VOICE_ID :
    person === 'LIL_WAYNE' ? process.env.LIL_WAYNE_VOICE_ID :
    person === 'MARK_ZUCKERBERG' ? process.env.MARK_ZUCKERBERG_VOICE_ID :
    person === 'MARTIN_SHKRELI' ? process.env.MARTIN_SHKRELI_VOICE_ID :
    person === 'MATT_DAMON' ? process.env.MATT_DAMON_VOICE_ID :
    person === 'MATTHEW_MCCONAUGHEY' ? process.env.MATTHEW_MCCONAUGHEY_VOICE_ID :
    person === 'MIKE_TYSON' ? process.env.MIKE_TYSON_VOICE_ID :
    person === 'MORGAN_FREEMAN' ? process.env.MORGAN_FREEMAN_VOICE_ID :
    person === 'PATRICK_STEWART' ? process.env.PATRICK_STEWART_VOICE_ID :
    person === 'PAUL_MCCARTNEY' ? process.env.PAUL_MCCARTNEY_VOICE_ID :
    person === 'POKIMANE' ? process.env.POKIMANE_VOICE_ID :
    person === 'PRINCE_HARRY' ? process.env.PRINCE_HARRY_VOICE_ID :
    person === 'RACHEL_MADDOW' ? process.env.RACHEL_MADDOW_VOICE_ID :
    person === 'ROBERT_DOWNEY_JR' ? process.env.ROBERT_DOWNEY_JR_VOICE_ID :
    person === 'RON_DESANTIS' ? process.env.RON_DESANTIS_VOICE_ID :
    person === 'SAM_ALTMAN' ? process.env.SAM_ALTMAN_VOICE_ID :
    person === 'SAMUEL_JACKSON' ? process.env.SAMUEL_JACKSON_VOICE_ID :
    person === 'SBF' ? process.env.SBF_VOICE_ID :
    person === 'SCARLETT_JOHANSSON' ? process.env.SCARLETT_JOHANSSON_VOICE_ID :
    person === 'SEAN_HANNITY' ? process.env.SEAN_HANNITY_VOICE_ID :
    person === 'SNOOP_DOGG' ? process.env.SNOOP_DOGG_VOICE_ID :
    person === 'STEPHEN_HAWKING' ? process.env.STEPHEN_HAWKING_VOICE_ID :
    person === 'TAYLOR_SWIFT' ? process.env.TAYLOR_SWIFT_VOICE_ID :
    person === 'TUCKER_CARLSON' ? process.env.TUCKER_CARLSON_VOICE_ID :
    person === 'TUPAC' ? process.env.TUPAC_VOICE_ID :
    person === 'WARREN_BUFFETT' ? process.env.WARREN_BUFFETT_VOICE_ID :
    person === 'WILL_SMITH' ? process.env.WILL_SMITH_VOICE_ID :
    person === 'WILLIAM' ? process.env.WILLIAM_VOICE_ID :
    process.env.DEFAULT_VOICE_ID;

            await generateAudio(voice_id, person, line, i);
            audios.push({
                person: person,
                audio: `public/voice/${person}-${i}.mp3`,
                index: i,
                image:
                    ai && duration === 1
                        ? images[i].imageUrl
                        : images[i]?.link || 'https://images.smart.wtf/black.png',
            });
        }

        const initialAgentName = audios[0].person;

        const videoFileName = randomizeBackground
            ? `/background/${background}-${Math.floor(Math.random() * 10)}.mp4`
            : `/background/${background}-0.mp4`;

        const contextContent = `
import { staticFile } from 'remotion';

export const music: string = ${
            music === 'NONE' ? `'NONE'` : `'/music/${music}.mp3'`
        };
export const fps = ${fps};
export const initialAgentName = '${initialAgentName}';
export const videoFileName = '${videoFileName}';

export const subtitlesFileName = [
  ${audios
            .map(
                (entry, i) => `{
    name: '${entry.person}',
    file: staticFile('srt/${entry.person}-${i}.srt'),
    asset: '${entry.image}',
  }`
            )
            .join(',\n  ')}
];
`;

        await writeFile('src/tmp/context.tsx', contextContent, 'utf-8');
        console.log('✅ Context file generated successfully');

        return { audios, transcript, videoFileName };
    } catch (error) {
        console.error('❌ Error in generateTranscriptAudio:', error);
        throw error;
    }
}

async function generateAudio(voice_id, person, line, index) {
    const response = await fetch('https://api.neets.ai/v1/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.NEETS_API_KEY,
        },
        body: JSON.stringify({
            text: line,
            voice_id: voice_id,
            params: {
                model: 'ar-diff-50k',
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Server responded with status code ${response.status}`);
    }

    const audioStream = fs.createWriteStream(
        `public/voice/${person}-${index}.mp3`
    );
    response.body.pipe(audioStream);

    return new Promise((resolve, reject) => {
        audioStream.on('finish', () => {
            resolve('Audio file saved as output.mp3');
        });
        audioStream.on('error', reject);
    });
}

async function fetchValidImages(transcript, length, ai, duration) {
    console.log('🔍 Starting fetchValidImages with params:', {
        length,
        ai,
        duration,
    });

    if (ai === true) {
        console.log('🤖 Using AI image generation');
        const promises = [];

        for (let i = 0; i < length; i++) {
            console.log(
                `📸 Queueing image generation for transcript ${i}:`,
                transcript[i].asset
            );
            promises.push(imageGeneneration(transcript[i].asset));
        }

        console.log('⏳ Waiting for all image generations to complete');
        const aiImages = await Promise.all(promises);
        console.log('✅ AI images generated:', aiImages.length);
        return aiImages;
    } else {
        console.log('🔎 Using Google image search');
        const images = [];
        for (let i = 0; i < length; i++) {
            const imageFetch = await fetch(
                `https://www.googleapis.com/customsearch/v1?q=${encodeURI(
                    transcript[i].asset
                )}&cx=${process.env.GOOGLE_CX}&searchType=image&key=${
                    process.env.GOOGLE_API_KEY
                }&num=${4}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            const imageResponse = await imageFetch.json();

            if (!Array.isArray(imageResponse.items) || imageResponse.items.length === 0) {
                console.log(
                    'No images found or items not iterable',
                    imageResponse.items
                );
                images.push({ link: 'https://images.smart.wtf/black.png' });
                continue;
            }

            const validMimeTypes = ['image/png', 'image/jpeg'];
            let imageAdded = false;

            for (let image of imageResponse.items) {
                if (validMimeTypes.includes(image.mime)) {
                    const isViewable = await checkImageHeaders(image.link);
                    if (isViewable) {
                        images.push(image);
                        imageAdded = true;
                        break;
                    }
                }
            }

            if (!imageAdded) {
                images.push({ link: 'https://images.smart.wtf/black.png' });
            }
        }

        return images;
    }
}

async function checkImageHeaders(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('Content-Type');
        const contentDisposition = response.headers.get('Content-Disposition');

        if (
            contentType.includes('image/png') ||
            contentType.includes('image/jpeg')
        ) {
            if (!contentDisposition || !contentDisposition.includes('attachment')) {
                return true;
            }
        }
    } catch (error) {
        console.error('Error checking image headers:', error);
    }
    return false;
}

const imagePrompt = async (title) => {
    console.log('💭 Generating image prompt for:', title);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-2024-04-09',
            messages: [{ role: 'user', content: title }],
        });
        console.log('✅ Prompt generated:', response.choices[0]?.message.content);
        return response.choices[0]?.message.content;
    } catch (error) {
        console.error('❌ Error generating prompt:', error);
        throw error;
    }
};

const imageGeneneration = async (initialPrompt) => {
    console.log('🎨 Starting image generation for prompt:', initialPrompt);
    try {
        console.log('1️⃣ Getting AI prompt');
        const prompt = await imagePrompt(initialPrompt);

        console.log('2️⃣ Building full prompt');
        const detailed8BitPreface =
            'Create an image in a detailed retro 8-bit style. The artwork should have a pixelated texture and should have vibrant coloring and scenery.';

        let fullPrompt = `${detailed8BitPreface} ${prompt} Remember, this is in retro 8-bit style`;
        fullPrompt = fullPrompt.substring(0, 900);

        console.log('3️⃣ Calling DALL-E API');
        const responseFetch = await openai.images.generate({
            model: 'dall-e-3',
            prompt: fullPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            style: 'vivid',
            response_format: 'url',
            user: 'user-1234',
        });

        console.log('✅ Image generated successfully');
        return {
            imageUrl: responseFetch.data[0]?.url,
            initialPrompt: initialPrompt,
            prompt: prompt,
        };
    } catch (error) {
        console.error('❌ Error in imageGeneration:', error);
        return {
            imageUrl: 'https://images.smart.wtf/black.png',
            initialPrompt: initialPrompt,
            prompt: 'Error occurred during image generation',
        };
    }
};
