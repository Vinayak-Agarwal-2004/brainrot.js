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
    'BEN_SHAPIRO',
    'JORDAN_PETERSON',
    'JOE_ROGAN',
    'DONALD_TRUMP',
    'MARK_ZUCKERBERG',
    'JOE_BIDEN',
    'LIL_YACHTY',
    'RICK_SANCHEZ',
    '50_CENT',
    'ALEX_JONES',
    'ANDERSON_COOPER',
    'ANDREW_TATE',
    'ANDREW_YANG',
    'ANGELA_MERKEL',
    'ANNA_KENDRICK',
    'ANTHONY_FAUCI',
    'ANTONIO_BANDERAS',
    'AOC',
    'ARIANA_GRANDE',
    'ARNOLD_SCHWARZENEGGER',
    'BILL_CLINTON',
    'BILL_GATES',
    'BILL_OREILLY',
    'BILLIE_EILISH',
    'CARDI_B',
    'CONOR_MCGREGOR',
    'DR_DRE',
    'DR_PHIL',
    'DRAKE',
    'DWAYNE_JOHNSON',
    'ELON_MUSK',
    'EMMA_WATSON',
    'GRETA_THUNBERG',
    'GRIMES',
    'HILLARY_CLINTON',
    'JAY_Z',
    'JEFF_BEZOS',
    'JERRY_SEINFELD',
    'KANYE_WEST',
    'KEVIN_HART',
    'LEX_FRIDMAN',
    'MORGAN_FREEMAN',
    'TAYLOR_SWIFT',
    'TUCKER_CARLSON',
    'WILL_SMITH',
    'ANGIE',
    'BEN_AFFLECK',
    'BERNIE_SANDERS',
    'BEYONCE',
    'CASEY_AFFLECK',
    'CHARLAMAGNE',
    'DARTH_VADER',
    'DEMI_LOVATO',
    'DJ_KHALED',
    'ELIZABETH_HOLMES',
    'ELLEN_DEGENERES',
    'GILBERT_GOTTFRIED',
    'JASON_ALEXANDER',
    'JIM_CRAMER',
    'JOHN_CENA',
    'JUSTIN_BIEBER',
    'JUSTIN_TRUDEAU',
    'KAMALA_HARRIS',
    'KARDASHIAN',
    'KERMIT',
    'LIL_WAYNE',
    'MARTIN_SHKRELI',
    'MATT_DAMON',
    'MATTHEW_MCCONAUGHEY',
    'MIKE_TYSON',
    'PATRICK_STEWART',
    'PAUL_MCCARTNEY',
    'POKIMANE',
    'PRINCE_HARRY',
    'RACHEL_MADDOW',
    'ROBERT_DOWNEY_JR',
    'RON_DESANTIS',
    'SAM_ALTMAN',
    'SAMUEL_JACKSON',
    'SBF',
    'SCARLETT_JOHANSSON',
    'SEAN_HANNITY',
    'SNOOP_DOGG',
    'STEPHEN_HAWKING',
    'TUPAC',
    'WARREN_BUFFETT',
    'WILLIAM'
];

const local = true;

async function main() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    let agentAIndex = Math.floor(Math.random() * agents.length);
    let agentBIndex;

    do {
        agentBIndex = Math.floor(Math.random() * agents.length);
    } while (agentAIndex === agentBIndex);

    //const agentA = agents[agentAIndex];
    //const agentB = agents[agentBIndex];
	const agentA = agents[0];
    const agentB = agents[1];

    const backgroundMusic = `BGM_MUSIC-0${Math.floor(Math.random() * 10) + 1}`;

    // CHANGE THIS VALUE FOR A CUSTOM VIDEO TOPIC
    const videoTopic =
        'Barack Obama is explaining flexures in compliant mechanisms to Ben Shapiro with formulaes';
    const aiGeneratedImages = false;
    const fps = 20;
    const duration = 0.5; // minute
    // MINECRAFT or TRUCK or GTA
    const background = 'BACKGROUND';
    const music = backgroundMusic;
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
