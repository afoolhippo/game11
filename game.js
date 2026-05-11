const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const fadeScreen = document.getElementById("fadeScreen");

const startBtn = document.getElementById("startBtn");

const drinkBtn = document.getElementById("drinkBtn");
const giveupBtn = document.getElementById("giveupBtn");

const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");
const homeBtn = document.getElementById("homeBtn");

const orange = document.getElementById("orange");

const face = document.getElementById("face");

const scoreEl = document.getElementById("score");

const resultText = document.getElementById("resultText");
const resultScore = document.getElementById("resultScore");

const bgm = document.getElementById("bgm");

const startSe = document.getElementById("startSe");
const gokuSe = document.getElementById("gokuSe");
const nomidokiSe = document.getElementById("nomidokiSe");
const outSe = document.getElementById("outSe");

let score = 0;
let tapo = 0;

let orangeX = -300;

let orangeType = "small";

let speed = 4;

let gameRunning = false;

let introFinished = false;

let wasInZone = false;

const DRINK_MIN = window.innerWidth / 2 - 90;
const DRINK_MAX = window.innerWidth / 2 + 90;

/* 顔 */

function updateFace() {

  if (tapo < 4) {

    face.textContent = "(^_^)";

  } else if (tapo < 8) {

    face.textContent = "(;´Д`)";

  } else if (tapo < 12) {

    face.textContent = "(>_<)";

  } else {

    face.textContent = "(T_T)";
  }
}

/* オレンジ */

function spawnOrange(forceSmall = false) {

  const isLarge =
    forceSmall ? false : Math.random() < 0.3;

  if (isLarge) {

    orangeType = "large";

    orange.className = "orangeLarge";

  } else {

    orangeType = "small";

    orange.className = "orangeSmall";
  }

  orangeX = -220;
}

/* ベルト凸 */

function createTicks() {

  const ticks = document.getElementById("ticks");

  ticks.innerHTML = "";

  for (let i = 0; i < 25; i++) {

    const tick = document.createElement("div");

    tick.className = "tick";

    tick.style.left = `${i * 50}px`;

    ticks.appendChild(tick);
  }
}

/* スタート */

async function startGame() {

  titleScreen.classList.add("hidden");

  fadeScreen.classList.remove("hidden");

  fadeScreen.classList.add("show");

  try {

    startSe.currentTime = 0;
    startSe.play();

  } catch(e) {}

  await new Promise(resolve => setTimeout(resolve, 1400));

  gameScreen.classList.remove("hidden");

  score = 0;
  tapo = 0;

  scoreEl.textContent = "0";

  updateFace();

  createTicks();

  try {

    bgm.volume = 0.7;

    bgm.currentTime = 0;

    bgm.play();

  } catch(e) {}

  await new Promise(resolve => setTimeout(resolve, 1200));

  fadeScreen.classList.remove("show");

  await new Promise(resolve => setTimeout(resolve, 1800));

  introFinished = true;

  spawnOrange(true);

  gameRunning = true;

  requestAnimationFrame(gameLoop);
}

/* ループ */

function gameLoop() {

  if (!gameRunning) return;

  orangeX += speed;

  orange.style.left = orangeX + "px";

  const inZone =
    orangeX > DRINK_MIN &&
    orangeX < DRINK_MAX;

  if (!wasInZone && inZone) {

    try {

      nomidokiSe.currentTime = 0;
      nomidokiSe.play();

    } catch(e) {}
  }

  wasInZone = inZone;

  if (inZone) {

    drinkBtn.disabled = false;

    drinkBtn.classList.add("active");

  } else {

    drinkBtn.disabled = true;

    drinkBtn.classList.remove("active");
  }

  if (orangeX > window.innerWidth + 240) {

    tapo = Math.max(0, tapo - 0.5);

    updateFace();

    spawnOrange();
  }

  if (tapo >= 15) {

    gameOver(false);
    return;
  }

  requestAnimationFrame(gameLoop);
}

/* 飲む */

function drinkOrange() {

  if (drinkBtn.disabled) return;

  try {

    gokuSe.currentTime = 0;
    gokuSe.play();

  } catch(e) {}

  score++;

  if (orangeType === "large") {

    tapo += 5;

  } else {

    tapo += 1;
  }

  scoreEl.textContent = score;

  updateFace();

  spawnOrange();
}

/* 終了 */

function gameOver(safe) {

  gameRunning = false;

  bgm.pause();

  if (!safe) {

    try {

      outSe.currentTime = 0;
      outSe.play();

    } catch(e) {}
  }

  gameScreen.classList.add("hidden");

  resultScreen.classList.remove("hidden");

  if (safe) {

    resultText.textContent =
      "ギリギリセーフ！";

  } else {

    resultText.textContent =
      "ギリギリアウト！";
  }

  resultScore.textContent = `${score}杯`;
}

/* ボタン */

startBtn.addEventListener("click", startGame);

drinkBtn.addEventListener("click", drinkOrange);

giveupBtn.addEventListener("click", () => {

  gameOver(true);
});

retryBtn.addEventListener("click", () => {

  location.reload();
});

homeBtn.addEventListener("click", () => {

  window.location.href =
    "https://afoolhippo.github.io/home/";
});

shareBtn.addEventListener("click", () => {

  const resultWord =
    resultText.textContent;

  const text =
`オレンジジュース、もう飲めない🥤🍊

${resultWord}

${score}杯

無料ブラウザゲーム
「タポタポオレンジ」

https://afoolhippo.github.io/game7/

#タポタポオレンジ
#カバゲーセン`;

  const url =
`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
});