import transcribeFunction from './transcribe.mjs';
import path from 'path';
import { exec } from 'child_process';
import { topics } from './topics.mjs';
import { rm, mkdir, unlink } from 'fs/promises';

export const PROCESS_ID = 0;

async function cleanupResources() {
    try {
        await rm(path.join('public', 'srt'), { recursive: true, force: true });
        await rm(path.join('public', 'voice'), { recursive: true, force: true });
        await unlink(path.join('public', `audio-${PROCESS_ID}.mp3`)).catch((e) =>
            console.error(e),
        );
        await unlink(path.join('src', 'tmp', 'context.tsx')).catch((e) =>
            console.error(e),
        );
        await mkdir(path.join('public', 'srt'), { recursive: true });
        await mkdir(path.join('public', 'voice'), { recursive: true });
    } catch (err) {
        console.error(`Error during cleanup: ${err}`);
    }
}

const agents = [
    'BARACK_OBAMA',
    'JORDAN_PETERSON',
    'JOE_ROGAN',
    'DONALD_TRUMP',
    'ALEX_JONES',
    'ANDREW_TATE',
    'ANNA_KENDRICK',
    'ARIANA_GRANDE',
    'BILLIE_EILISH',
    'CARDI_B',
    'DWAYNE_JOHNSON',
    'ELON_MUSK',
    'EMMA_WATSON',
    'KANYE_WEST',
    'MORGAN_FREEMAN',
    'TAYLOR_SWIFT',
    'BEYONCE',
    'DARTH_VADER',
    'DEMI_LOVATO',
    'JOHN_CENA',
    'MIKE_TYSON',
    'POKIMANE',
    'SAMUEL_JACKSON',
    'SCARLETT_JOHANSSON',
    'SNOOP_DOGG',
    'STEPHEN_HAWKING',
];

const local = true;

async function main() {
    //const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    let agentAIndex = Math.floor(Math.random() * agents.length);
    let agentBIndex;

    do {
        agentBIndex = Math.floor(Math.random() * agents.length);
    } while (agentAIndex === agentBIndex);

    //const agentA = agents[agentAIndex];
    //const agentB = agents[agentBIndex];
	const agentA = agents[0];
    const agentB = agents[1];

    // CHANGE THIS VALUE FOR A CUSTOM VIDEO TOPIC
    const videoTopic =
        'Barack Obama is explaining flexures in compliant mechanisms to Ben Shapiro with formulaes';
    const aiGeneratedImages = true;
    const fps = 20;
    const duration = 0.5; // minute
    const background = `BACKGROUND-${Math.floor(Math.random() * 100) + 1}`;
    const music = `BGM_MUSIC-0${Math.floor(Math.random() * 10)}`;
    const cleanSrt = true;

    await transcribeFunction(
        local,
        videoTopic ? videoTopic : randomTopic,
        agentA,
        agentB,
        aiGeneratedImages,
        fps,
        duration,
        background,
        music,
        cleanSrt,
    );

    // run in the command line `npm run build`
    exec('npm run build', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        cleanupResources();
    });
}

(async () => {
    await main();
})();
