// Load player details
let playerDetail = localStorage.getItem("playerDetail");
if (playerDetail) {
  playerDetail = JSON.parse(playerDetail); // convert string → object
} else {
  playerDetail = {}; // start empty
}
// Load current player
let currPlayer = localStorage.getItem("currPlayer");
if (!currPlayer) {
  currPlayer = "Player1"; // default
}

let currlevl = 1;
let seq = []; // comp sequence
let playerSeq = []; // player sequence

const body = document.body;
const main2 = document.querySelector("#main-2");
const main3 = document.querySelector("#main-3");
const main4 = document.querySelector("#main-4");
const main5 = document.querySelector("#main-5");
const showMsg = document.querySelector("#show-msg");
const showLev = document.querySelector("#show-levl");
const light = document.querySelector("#light");
const dark = document.querySelector("#dark");
const mode = document.querySelector("#LorDmode");
const msg = document.querySelector("#message");
const levl = document.querySelector("#level");
const strtBtn = document.querySelector(".start");
const colors = document.querySelectorAll(".color");
const doneBtn = document.querySelector("#done");
const welcm = document.querySelector("#welcome-msg");
// const themeLink = document.getElementById("theme-link");
const help = document.querySelector("#help");
const highScore = document.querySelector("#high-score");
const backBtn = document.querySelector("#back");
const menu = document.querySelector("#menu");
const left = document.querySelector("#left");

//local storage for theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark");
} else {
    body.classList.remove("dark");
}

function setMode() {
  let checkedMode = document.querySelector('input[name="mode"]:checked'); // checked mode
  if (checkedMode.value == "easy") {
    main2.hidden = false;
    main3.hidden = true;
    main4.hidden = true;
  } else if (checkedMode.value == "medium") {
    main2.hidden = true;
    main3.hidden = false;
    main4.hidden = true;
  } else if (checkedMode.value == "hard") {
    main2.hidden = true;
    main3.hidden = true;
    main4.hidden = false;
  }
}
function flash(div) {
  div.classList.add("flash");
  setTimeout(() => {
    div.classList.remove("flash");
  }, 800);
}
function playcolor() {
  let clrNo = 0;
  let clrDiv;
  let Mode = document.querySelector('input[name="mode"]:checked').value; // checked mode
  if (Mode == "easy") {
    clrNo = 4;
    clrDiv = main2;
  } else if (Mode == "medium") {
    clrNo = 6;
    clrDiv = main3;
  } else if (Mode == "hard") {
    clrNo = 9;
    clrDiv = main4;
  }
  let randomNo = Math.floor(Math.random() * clrNo);

  let clrs = clrDiv.querySelectorAll(".color");
  let randomClrDiv = clrs[randomNo];
  flash(randomClrDiv);
  seq.push(randomClrDiv.id);
  setTimeout(() => {
    msg.textContent = "Now Your Turn!";
  }, 1000);
}
function checkcolorseq() {
  let game = true; //true or false
  let rev = document.querySelector("#reverse-simon");
  if (rev.checked) {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i] != playerSeq[seq.length - 1 - i]) {
        game = false;
        break;
      }
    }
  } else {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i] != playerSeq[i]) {
        game = false;
        break;
      }
    }
  }

  if (game == true) {
    playerSeq = []; // reset player sequence
    if (currlevl > playerDetail[currPlayer]) {
      playerDetail[currPlayer] = currlevl;
      localStorage.setItem("playerDetail", JSON.stringify(playerDetail));
      highScore.textContent = playerDetail[currPlayer];
    }
    levl.textContent = `Level ${++currlevl}`;
    msg.textContent = `Hurray! You Passed Level-${currlevl}.
    Get Ready for Level-${currlevl}!`;
    setTimeout(() => {
      msg.textContent = `Focus! Game Is ON!`;
      setTimeout(() => {
        playcolor();
      }, 1000);
    }, 2000);
  } else {
    msg.textContent = `Sorry! You Failed Level-${currlevl}.
    You Can Play Better, Start The Game Again!`;
    strtBtn.textContent = "Start Game";
    // again click start to play
  }
}

// control difficulty mode
document.querySelectorAll('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    setMode();
  });
});
// start game
strtBtn.addEventListener("click", () => {
  strtBtn.textContent = "Restart Game";
  currlevl = 1;
  seq = [];
  playerSeq = [];
  levl.textContent = `Level 1`;
  msg.textContent = `Welcome ${currPlayer}! Get Ready!`;
  setTimeout(() => {
    msg.textContent = `Focus! Game Is ON!`;
    setTimeout(() => {
      playcolor();
    }, 1000);
  }, 2000);
});
// check input
colors.forEach((clr) => {
  clr.addEventListener("click", () => {
    if (msg.textContent == "Now Your Turn!") {
      playerSeq.push(clr.id);
      flash(clr);

      if (playerSeq.length == seq.length) {
        checkcolorseq();
      }
    }
  });
});
// taking username input
doneBtn.addEventListener("click", () => {
  const inputUser = document.querySelector("#input-user");
  const username = document.querySelector("#username");
  const newuser = username.value.trim(); // trim spaces

  if (!(newuser in playerDetail)) {
    // new player
    localStorage.setItem("currPlayer", newuser);
    playerDetail[newuser] = 0; // start with score 0
    localStorage.setItem("playerDetail", JSON.stringify(playerDetail));
    inputUser.innerHTML = "";
    welcm.innerHTML = `Welcome To Simon Says, <b>${newuser}</b>!`;
    highScore.textContent = playerDetail[newuser];
  } else {
    // returning player
    localStorage.setItem("currPlayer", newuser);
    inputUser.innerHTML = "";
    welcm.innerHTML = `Welcome Back To Simon Says, <b>${newuser}</b>!`;
    highScore.textContent = playerDetail[newuser];
  }
  currPlayer = newuser;
});
// help button toggle
help.addEventListener("click", () => {
  main5.hidden = !main5.hidden;
  if (main5.hidden == false) {
    showLev.hidden = true;
    showMsg.hidden = true;
    main2.hidden = true;
    main3.hidden = true;
    main4.hidden = true;
  } else {
    showLev.hidden = false;
    showMsg.hidden = false;
    setMode();
  }
});
backBtn.addEventListener("click", () => {
  main5.hidden = true;
  showLev.hidden = false;
  showMsg.hidden = false;
  setMode();
});

// reverse simon toggle
const revsimon = document.querySelector("#reverse-simon-div label");
let rev = document.querySelector("#reverse-simon");
rev.addEventListener("change", () => {
  revsimon.textContent = rev.checked ? "Disable" : "Enable";
});

menu.addEventListener("click", () => {
  left.classList.add("visible");
});
const closeBtn = document.querySelector("#close");
document.addEventListener("click", (e) => {

    // if clicked outside sidebar and outside open button
    if (
        !left.contains(e.target) &&
        !menu.contains(e.target)
    ) {
        left.classList.remove("visible");
    }

});

// light/dark mode toggle
light.addEventListener("click", () => {
  body.classList.remove("dark");
  localStorage.setItem("theme", "light");
});
dark.addEventListener("click", () => {
  body.classList.add("dark");
  localStorage.setItem("theme", "dark");
});