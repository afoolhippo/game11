const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");

const backBtn = document.getElementById("backBtn");

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

const gokuSe = document.getElementById("gokuSe");
const outSe = document.getElementById("outSe");

let score = 0;
let tapo = 0;

let orangeX = -300;

let orangeType = "small";

let speed = 2.3;

let gameRunning = false;

let orangeStarted = false;

const DRINK_MIN = window.innerWidth / 2 - 110;
const DRINK_MAX = window.innerWidth / 2 + 110;

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
    forceSmall ? false : Math.random() < 0.28;

  if (isLarge) {

    orangeType = "large";

    orange.className = "orangeLarge";

  } else {

    orangeType = "small";

    orange.className = "orangeSmall";
  }

  orange.style.opacity = 1;

  orange.classList.remove("drinkAnim");

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

function moveTicks() {

  document.querySelectorAll(".tick").forEach(tick => {

    let x = parseFloat(tick.style.left);

    x += speed;

    if (x > window.innerWidth + 30) {

      x = -30;
    }

    tick.style.left = `${x}px`;
  });
}

/* スタート */

async function startGame() {

  titleScreen.classList.add("hidden");

  gameScreen.classList.remove("hidden");

  score = 0;
  tapo = 0;

  scoreEl.textContent = "0";

  updateFace();

  createTicks();

  try {

    bgm.volume = 0.55;

    bgm.currentTime = 0;

    bgm.play();

  } catch(e) {}

  gameRunning = true;

  requestAnimationFrame(gameLoop);

  setTimeout(() => {

    orangeStarted = true;

    spawnOrange(true);

  }, 4000);
}

/* ループ */

function gameLoop() {

  if (!gameRunning) return;

  moveTicks();

  if (orangeStarted) {

    orangeX += speed;

    orange.style.left = orangeX + "px";

    const orangeWidth =
      orangeType === "large" ? 170 : 70;

    const orangeCenter =
      orangeX + orangeWidth / 2;

    const inZone =
      orangeCenter > DRINK_MIN &&
      orangeCenter < DRINK_MAX;

    if (inZone) {

      drinkBtn.disabled = false;

      drinkBtn.classList.add("active");

    } else {

      drinkBtn.disabled = true;

      drinkBtn.classList.remove("active");
    }

    if (orangeX > window.innerWidth + 260) {

      tapo = Math.max(0, tapo - 0.5);

      updateFace();

      spawnOrange();
    }

    if (tapo >= 15) {

      gameOver(false);
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

/* 飲む */

function drinkOrange() {

  const orangeWidth =
    orangeType === "large" ? 170 : 70;

  const orangeCenter =
    orangeX + orangeWidth / 2;

  const inZone =
    orangeCenter > DRINK_MIN &&
    orangeCenter < DRINK_MAX;

  if (!inZone) return;

  try {

    gokuSe.volume = 1.0;

    gokuSe.currentTime = 0;

    gokuSe.play();

  } catch(e) {}

  orange.classList.add("drinkAnim");

  score++;

  if (orangeType === "large") {

    tapo += 5;

  } else {

    tapo += 1;
  }

  scoreEl.textContent = score;

  updateFace();

  drinkBtn.disabled = true;

  setTimeout(() => {

    spawnOrange();

  }, 420);
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

backBtn.addEventListener("click", () => {

  location.reload();
});

retryBtn.addEventListener("click", () => {

  location.reload();
});

homeBtn.addEventListener("click", () => {

  window.location.href =
    "https://afoolhippo.github.io/home/?skipTitle=1";
});

shareBtn.addEventListener("click", () => {

  const resultWord =
    resultText.textContent;

  const text =
`オレンジジュース、もう飲めない🥤🍊

${resultWord}

${score}杯

無料ブラウザゲーム「タポタポオレンジ」
https://afoolhippo.github.io/game11/

#タポタポオレンジ
#カバゲーセン`;

  const url =
`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
});