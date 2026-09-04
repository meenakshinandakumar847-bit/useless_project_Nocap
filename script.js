/* =========================================
   NO CAP CONVERTER
========================================= */
/* =========================================
   ELEMENTS
========================================= */

const userText = document.getElementById("userText");
const charCount = document.getElementById("charCount");
const clearBtn = document.getElementById("clearBtn");

const analysisSection = document.getElementById("analysisSection");
const modesSection = document.getElementById("modesSection");

const gapNumber = document.getElementById("gapNumber");
const gapFill = document.getElementById("gapFill");
const gapMessage = document.getElementById("gapMessage");
const gapEmoji = document.getElementById("gapEmoji");

const ageNumber = document.getElementById("ageNumber");
const ageMessage = document.getElementById("ageMessage");

const homeScreen = document.getElementById("homeScreen");
const modeScreen = document.getElementById("modeScreen");

const modeIcon = document.getElementById("modeIcon");
const modeTitle = document.getElementById("modeTitle");
const modeIntro = document.getElementById("modeIntro");

const originalText = document.getElementById("originalText");

const levelSlider = document.getElementById("levelSlider");
const levelNumber = document.getElementById("levelNumber");
const levelTitle = document.getElementById("levelTitle");

const warning = document.getElementById("warning");

const outputText = document.getElementById("outputText");
const outputLabel = document.getElementById("outputLabel");

const modeAge = document.getElementById("modeAge");
const modeAgeMessage = document.getElementById("modeAgeMessage");

const exitQuestion = document.getElementById("exitQuestion");

const copyBtn = document.getElementById("copyBtn");
const backBtn = document.getElementById("backBtn");
const sitBtn = document.getElementById("sitBtn");
const exitModeBtn = document.getElementById("exitModeBtn");

const toast = document.getElementById("toast");


/* =========================================
   STATE
========================================= */

let currentMode = "brainrot";
let originalUserText = "";

let baseGap = 0;
let baseAge = 25;


/* =========================================
   SOUND
========================================= */

function playSound(id) {

    const sound = document.getElementById(id);

    if (!sound) return;

    sound.currentTime = 0;

    sound.play().catch(() => {
        // Sound may not exist yet.
    });
}


/* =========================================
   TEXT ANALYSIS
========================================= */

const youngWords = [
    "bro",
    "fr",
    "ngl",
    "lol",
    "lmao",
    "rizz",
    "aura",
    "sigma",
    "sus",
    "slay",
    "ate",
    "cooked",
    "fire",
    "lit",
    "bet",
    "lowkey",
    "highkey",
    "vibe",
    "goat",
    "no cap",
    "bruh",
    "wyd",
    "rn",
    "idk",
    "ikr",
    "omg"
];


const oldWords = [
    "please",
    "kindly",
    "therefore",
    "regarding",
    "furthermore",
    "dear",
    "sincerely",
    "respectfully",
    "hence",
    "accordingly",
    "shall",
    "whilst",
    "telephone",
    "forward",
    "attached"
];


function analyzeText(text) {

    if (!text.trim()) {
        return {
            gap: 0,
            age: 25
        };
    }


    const lower = text.toLowerCase();

    let score = 50;


    /* Formal vocabulary */

    oldWords.forEach(word => {

        if (lower.includes(word)) {
            score += 5;
        }

    });


    /* Internet vocabulary */

    youngWords.forEach(word => {

        if (lower.includes(word)) {
            score -= 7;
        }

    });


    /* Emojis */

    const emojiMatches = text.match(
        /[\u{1F300}-\u{1FAFF}]/gu
    );

    if (emojiMatches) {
        score -= Math.min(
            emojiMatches.length * 3,
            20
        );
    }


    /* Exclamation marks */

    const exclamationCount =
        (text.match(/!/g) || []).length;

    score -= Math.min(
        exclamationCount * 2,
        10
    );


    /* ALL CAPS */

    if (
        text.length > 5 &&
        text === text.toUpperCase()
    ) {
        score -= 8;
    }


    /* Very long sentences */

    if (text.length > 120) {
        score += 8;
    }


    /* Very short casual text */

    if (
        text.length < 25 &&
        /[!?]/.test(text)
    ) {
        score -= 8;
    }


    score = Math.max(
        0,
        Math.min(100, score)
    );


    /*
        Make age roughly correlate
        with the generation gap.
    */

    const age = Math.round(
        14 + score * 0.48
    );


    return {
        gap: score,
        age: age
    };

}


/* =========================================
   UPDATE HOME ANALYSIS
========================================= */

function updateAnalysis() {

    const text = userText.value.trim();

    charCount.textContent =
        `${userText.value.length} / 500`;


    if (!text) {

        analysisSection.classList.add("hidden");
        modesSection.classList.add("hidden");

        return;

    }


    const result = analyzeText(text);

    baseGap = result.gap;
    baseAge = result.age;


    analysisSection.classList.remove("hidden");
    modesSection.classList.remove("hidden");


    animateNumber(
        gapNumber,
        result.gap
    );


    gapFill.style.width =
        `${result.gap}%`;


    ageNumber.textContent =
        result.age;


    updateGapMessage(result.gap);

}


/* =========================================
   GAP MESSAGE
========================================= */

function updateGapMessage(gap) {

    if (gap <= 20) {

        gapMessage.textContent =
            "You are one with the algorithm.";

        gapEmoji.textContent = "🔥";

    } else if (gap <= 40) {

        gapMessage.textContent =
            "Mostly online. Suspiciously normal.";

        gapEmoji.textContent = "👀";

    } else if (gap <= 60) {

        gapMessage.textContent =
            "The internet has not fully claimed you.";

        gapEmoji.textContent = "📡";

    } else if (gap <= 80) {

        gapMessage.textContent =
            "UNC TERRITORY DETECTED.";

        gapEmoji.textContent = "💀";

    } else {

        gapMessage.textContent =
            "Please don't ask what rizz means.";

        gapEmoji.textContent = "☠️";

    }


    ageMessage.textContent =
        getAgeMessage(baseAge);

}


/* =========================================
   AGE MESSAGE
========================================= */

function getAgeMessage(age) {

    if (age <= 17) {
        return "The algorithm thinks you were raised by TikTok.";
    }

    if (age <= 25) {
        return "Internet native detected.";
    }

    if (age <= 35) {
        return "You occasionally touch grass.";
    }

    if (age <= 45) {
        return "Unc allegations are getting serious.";
    }

    if (age <= 55) {
        return "You probably know how to forward a message.";
    }

    return "Facebook has claimed you.";
}


/* =========================================
   NUMBER ANIMATION
========================================= */

function animateNumber(element, target) {

    const start =
        parseInt(element.textContent) || 0;

    const duration = 500;

    const startTime = performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const value = Math.round(
            start +
            (target - start) * progress
        );


        element.textContent = value;


        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }


    requestAnimationFrame(update);

}


/* =========================================
   INPUT EVENTS
========================================= */

userText.addEventListener(
    "input",
    updateAnalysis
);


clearBtn.addEventListener(
    "click",
    () => {

        userText.value = "";

        updateAnalysis();

        playSound("clickSound");

    }
);


/* =========================================
   MODE DATA
========================================= */

const modes = {

    brainrot: {

        icon: "🧠",

        title: "BRAINROT MODE",

        intro:
            "Congratulations. You have entered Brainrot Mode.",

        levelTitle:
            "Brainrot Level",

        outputLabel:
            "NO CAP TEXT",

        exitQuestion:
            "Can't stand this?",

        sitText:
            "THEN SIT DOWN.",

        sound:
            "brainrotSound"

    },


    cringe: {

        icon: "💅",

        title: "CRINGE MODE",

        intro:
            "Congratulations. You have entered the Cringe Zone.",

        levelTitle:
            "TikTok Level",

        outputLabel:
            "TIKTOK TEXT",

        exitQuestion:
            "Too much cringe?",

        sitText:
            "THEN LEAVE BESTIE.",

        sound:
            "cringeSound"

    },


    uncle: {

        icon: "👨‍💼",

        title: "FB UNCLE MODE",

        intro:
            "Congratulations. You have entered Facebook Uncle Mode.",

        levelTitle:
            "FB Uncle Level",

        outputLabel:
            "FORWARDED TEXT",

        exitQuestion:
            "Too much FB?",

        sitText:
            "THEN LOG OFF, UNCLE.",

        sound:
            "uncleSound"

    },


    sigma: {

        icon: "🗿",

        title: "SIGMA MODE",

        intro:
            "You have entered the Sigma Mode.",

        levelTitle:
            "Sigma Level",

        outputLabel:
            "SIGMA TEXT",

        exitQuestion:
            "Too much Sigma?",

        sitText:
            "THEN EXIT THE GRIND.",

        sound:
            "sigmaSound"

    }

};


/* =========================================
   OPEN MODE
========================================= */

function openMode(mode) {

    if (!originalUserText.trim()) {

        alert(
            "UNC, TYPE SOMETHING FIRST."
        );

        return;

    }


    currentMode = mode;

    const data = modes[mode];


    originalText.textContent =
        originalUserText;


    modeIcon.textContent =
        data.icon;


    modeTitle.textContent =
        data.title;


    modeIntro.textContent =
        data.intro;


    levelTitle.textContent =
        data.levelTitle;


    outputLabel.textContent =
        data.outputLabel;


    exitQuestion.textContent =
        data.exitQuestion;


    sitBtn.textContent =
        data.sitText;


    levelSlider.value = 0;

    levelNumber.textContent = "0%";


    warning.classList.remove("danger");


    homeScreen.classList.remove("active");

    homeScreen.style.display = "none";


    modeScreen.classList.add("active");

    modeScreen.style.display = "block";


    outputText.textContent =
        "Your transformed text will appear here.";


    updateMode(0);


    playSound(data.sound);

}


/* =========================================
   MODE BUTTONS
========================================= */

document
    .querySelectorAll(".mode-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                originalUserText =
                    userText.value.trim();

                openMode(
                    card.dataset.mode
                );

            }
        );

    });


/* =========================================
   MODE SLIDER
========================================= */

levelSlider.addEventListener(
    "input",
    () => {

        const level =
            Number(levelSlider.value);

        updateMode(level);

    }
);


/* =========================================
   MODE UPDATE
========================================= */

function updateMode(level) {

    levelNumber.textContent =
        `${level}%`;


    updateWarning(level);


    const transformed =
        generateTranslation(
            originalUserText,
            currentMode,
            level
        );


    outputText.classList.remove("reveal");


    /*
       Small delay creates a
       text-reveal effect.
    */

    setTimeout(() => {

        outputText.textContent =
            transformed;

        outputText.classList.add("reveal");

    }, 80);


    updateModeAge(level);

}


/* =========================================
   WARNING SYSTEM
========================================= */

function updateWarning(level) {

    warning.classList.remove("danger");


    if (level < 20) {

        warning.textContent =
            "Levels: Acceptable. Humanity survives.";

    }

    else if (level < 40) {

        warning.textContent =
            "⚠️ Mild internet exposure detected.";

    }

    else if (level < 60) {

        warning.textContent =
            "⚠️ Internet contamination increasing.";

    }

    else if (level < 75) {

        warning.textContent =
            "⚠️ Dangerous levels of internet detected.";

        warning.classList.add("danger");

    }

    else if (level < 90) {

        warning.textContent =
            "🚨 WARNING: TOUCH GRASS IMMEDIATELY.";

        warning.classList.add("danger");

    }

    else if (level < 100) {

        warning.textContent =
            "🚨 NORMAL ENGLISH IS LEAVING THE PREMISES.";

        warning.classList.add("danger");

    }

    else {

        warning.textContent =
            "☠️ THERE IS NO GOING BACK.";

        warning.classList.add("danger");

        playSound("warningSound");

    }

}


/* =========================================
   TRANSLATION ENGINE
========================================= */

function generateTranslation(
    text,
    mode,
    level
) {

    if (!text.trim()) {
        return "";
    }


    /*
        We create multiple intensity
        stages rather than simply replacing
        words.
    */


    if (mode === "brainrot") {

        return brainrotTranslation(
            text,
            level
        );

    }


    if (mode === "cringe") {

        return cringeTranslation(
            text,
            level
        );

    }


    if (mode === "uncle") {

        return uncleTranslation(
            text,
            level
        );

    }


    if (mode === "sigma") {

        return sigmaTranslation(
            text,
            level
        );

    }

}


/* =========================================
   BRAINROT
========================================= */

function brainrotTranslation(
    text,
    level
) {

    if (level < 20) {

        return text
            .replace(/\breally\b/gi, "actually")
            .replace(/\bvery\b/gi, "lowkey");

    }


    if (level < 40) {

        return addEnding(
            text,
            "ngl bro"
        );

    }


    if (level < 60) {

        return addEnding(
            text,
            "fr fr 💀🔥"
        );

    }


    if (level < 75) {

        return `
NAHHH BRO 💀

${text}

Bro actually cooked. No cap. 🔥
`;

    }


    if (level < 90) {

        return `
NAHHHH BRO ABSOLUTELY COOKED 💀🔥😭🙏

${text}

NO CAP. FR FR.
ZERO CRUMBS.
THE AURA IS INSANE.
`;

    }


    return `
🚨 BRAINROT OVERLOAD 🚨

NAHHHHHHHH BROOOOO 💀💀💀🔥🔥🔥😭😭🙏🙏

${text.toUpperCase()}

BRO JUST ENTERED HIS FINAL FORM.
ABSOLUTE CINEMA.
MAXIMUM AURA.
ZERO CRUMBS.
NO CAP.
FR FR.
WE ARE SO COOKED.

🗿
`;

}


/* =========================================
   CRINGE
========================================= */

function cringeTranslation(
    text,
    level
) {

    if (level < 20) {

        return text
            .replace(/\breally\b/gi, "literally");

    }


    if (level < 40) {

        return `
Okayyy bestie ✨

${text}

Period. 💅
`;

    }


    if (level < 60) {

        return `
OMG BESTIEEE 😭💅✨

${text}

Like... literally SAME.
`;
    }


    if (level < 80) {

        return `
STOPPPP 😭😭💅✨

${text.toUpperCase()}

THIS IS ACTUALLY SO ICONIC.
ATE. NO CRUMBS. 💖
`;

    }


    return `
✨💅 OMG BESTIEEEEEE 💅✨

${text.toUpperCase()}

I'M SCREAMING.
I'M CRYING.
I'M THROWING UP.

THIS IS SOOOO ICONIC 😭💖✨

ATEEEE.
NO CRUMBS.
ABSOLUTELY SERVED.

#BLESSED #ICONIC #SLAY
`;

}


/* =========================================
   FB UNCLE
========================================= */

function uncleTranslation(
    text,
    level
) {

    if (level < 20) {

        return `
${text}

Very good. 👍
`;

    }


    if (level < 40) {

        return `
${text}

GOOD MESSAGE.
HAVE A NICE DAY. 🌞
`;

    }


    if (level < 60) {

        return `
${text}

VERY NICE 👍👍

MUST SHARE WITH FAMILY AND FRIENDS.
HAVE A BLESSED DAY. 🙏
`;

    }


    if (level < 80) {

        return `
🌞 GOOD MORNING 🌞

${text.toUpperCase()}

VERY IMPORTANT!!!
MUST READ AND SHARE!!!

Nowadays youngsters should learn this.
FORWARD TO 10 PEOPLE. 👍🙏
`;

    }


    return `
🌞🌞🌞 GOOD MORNING 🌞🌞🌞

${text.toUpperCase()}

VERY VERY IMPORTANT MESSAGE!!!

Nowadays children are always on MOBILE PHONE 📱😡

THIS IS WHY SOCIETY IS GOING DOWN.

PLEASE SHARE WITH 10 PEOPLE
OTHERWISE YOU WILL HAVE BAD LUCK FOR 7 YEARS. 😱🙏

👍👍👍 FORWARD MAXIMUM!!!
`;

}


/* =========================================
   SIGMA
========================================= */

function sigmaTranslation(
    text,
    level
) {

    if (level < 20) {

        return `
${text}

Stay focused.
`;

    }


    if (level < 40) {

        return `
${text}

No distractions.
Keep moving.
`;

    }


    if (level < 60) {

        return `
${text}

They talk.

You work.

They sleep.

You grind.

🗿
`;

    }


    if (level < 80) {

        return `
${text}

While they were watching...

He was grinding.

While they were scrolling...

He was building.

AURA: +100
`;

    }


    return `
THEY LAUGH.

HE GRINDS.

THEY SCROLL.

HE BUILDS.

THEY SEEK VALIDATION.

HE SEEKS RESULTS.

${text.toUpperCase()}

NO EXCUSES.
NO DISTRACTIONS.
NO COMPLAINTS.

ONLY DISCIPLINE.

ONLY GRIND.

ONLY AURA.

🗿⚡
`;

}


/* =========================================
   ADD ENDING
========================================= */

function addEnding(
    text,
    ending
) {

    return `${text} — ${ending}`;

}


/* =========================================
   MODE AGE
========================================= */

function updateModeAge(level) {

    let age;


    if (currentMode === "brainrot") {

        age = Math.round(
            22 - level * 0.08
        );

        modeAge.textContent =
            `${age} years old`;

        modeAgeMessage.textContent =
            level > 75
                ? "2018 called. It wants its brainrot back."
                : "Your communication age is decreasing rapidly.";

    }


    else if (currentMode === "cringe") {

        age = Math.round(
            24 - level * 0.11
        );

        modeAge.textContent =
            `${age} years old (2018)`;

        modeAgeMessage.textContent =
            level > 75
                ? "You have been TikTokified."
                : "The algorithm is concerned.";

    }


    else if (currentMode === "uncle") {

        age = Math.round(
            30 + level * 0.28
        );

        modeAge.textContent =
            `${age} years old`;

        modeAgeMessage.textContent =
            level > 75
                ? "You have become somebody's uncle."
                : "Forwarding messages detected.";

    }


    else if (currentMode === "sigma") {

        age = Math.round(
            18 + level * 0.04
        );

        modeAge.textContent =
            `${age} years old`;

        modeAgeMessage.textContent =
            level > 75
                ? "The grindset has consumed you."
                : "Discipline increasing.";

    }

}


/* =========================================
   COPY
========================================= */

copyBtn.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                outputText.textContent
            );

        } catch {

            const temp =
                document.createElement("textarea");

            temp.value =
                outputText.textContent;

            document.body.appendChild(temp);

            temp.select();

            document.execCommand("copy");

            temp.remove();

        }


        showToast(
            "COPIED. GO CAUSE PROBLEMS."
        );

        playSound("clickSound");

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}


/* =========================================
   EXIT MODE
========================================= */

function exitMode() {

    modeScreen.classList.remove("active");

    modeScreen.style.display = "none";

    homeScreen.style.display = "block";

    homeScreen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    playSound("clickSound");

}


backBtn.addEventListener(
    "click",
    exitMode
);


exitModeBtn.addEventListener(
    "click",
    exitMode
);


sitBtn.addEventListener(
    "click",
    () => {

        showToast(
            "GOOD DECISION. TOUCH GRASS."
        );

        setTimeout(
            exitMode,
            900
        );

    }
);


/* =========================================
   MOUSE INTERACTION
========================================= */

document.addEventListener(
    "mousemove",
    event => {

        const x =
            (event.clientX / window.innerWidth - 0.5);

        const y =
            (event.clientY / window.innerHeight - 0.5);


        document
            .querySelectorAll(".float")
            .forEach((element, index) => {

                const amount =
                    (index + 1) * 8;

                element.style.transform =
                    `translate(
                        ${x * amount}px,
                        ${y * amount}px
                    )`;

            });

    }
);


/* =========================================
   INITIAL STATE
========================================= */

modeScreen.style.display = "none";

updateAnalysis();