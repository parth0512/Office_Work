let score = JSON.parse(localStorage.getItem("score")) || {
    wins: 0,
    losses: 0,
    ties: 0,
  };

  updateScore();

  // if (!score) {
  //    score = {
  //     wins: 0,
  //     losses: 0,
  //     ties: 0,
  //   };
  // }
  function playGame(playerMove) {
    const computerMove = pickComputerMove();
    let result = "";
    if (playerMove === "scissor") {
      if (computerMove === "rock") {
        result = "You Lose";
      } else if (computerMove === "paper") {
        result = "You Win";
      } else if (computerMove === "scissor") {
        result = "Tie";
      }
    } else if (playerMove === "paper") {
      if (computerMove === "rock") {
        result = "You Win";
      } else if (computerMove === "paper") {
        result = "Tie";
      } else if (computerMove === "scissor") {
        result = "You Lose";
      }
    } else if (playerMove === "rock") {
      if (computerMove === "rock") {
        result = "Tie";
      } else if (computerMove === "paper") {
        result = "You Lose";
      } else if (computerMove === "scissor") {
        result = "You Win";
      }
    }

    if (result === "You Win") {
      score.wins += 1;
    } else if (result === "You Lose") {
      score.losses += 1;
    } else if (result === "Tie") {
      score.ties += 1;
    }
    localStorage.setItem("score", JSON.stringify(score));

    updateScore();
    document.querySelector(".js-result").innerHTML = result;
    document.querySelector(
      ".js-moves"
    ).innerHTML = ` You <img src="images/${playerMove}-emoji.png" class="move-icon" />
    <img src="images/${computerMove}-emoji.png" class="move-icon" />computer`;
  }
  function updateScore() {
    document.querySelector(
      ".js-score"
    ).innerHTML = `Wins:${score.wins} , Losses: ${score.losses} , Tie:${score.ties} .`;
  }

  function pickComputerMove() {
    const randomNumber = Math.random();
    let computerMove = "";
    if (randomNumber >= 0 && randomNumber <= 1 / 3) {
      computerMove = "rock";
    } else if (randomNumber > 1 / 3 && randomNumber <= 2 / 3) {
      computerMove = "paper";
    } else if (randomNumber > 2 / 3 && randomNumber <= 1) {
      computerMove = "scissor";
    }
    return computerMove;
  }
