const selectOptions = document.querySelectorAll(
    ".playground .playOption .fa-solid"
  ),
  playground = document.querySelector(".playground"),
  results = document.getElementById("results"),
  userSelect = document.querySelector(".userSelect i"),
  botSelect = document.querySelector(".botSelect i"),
  userScore = document.getElementById("userScore"),
  compScore = document.getElementById("compScore");

let [userScoreData, compScoreData] = [0, 0];

selectOptions.forEach((element, index) => {
  element.addEventListener("click", (e) => {
    userSelect.removeAttribute("class");
    botSelect.removeAttribute("class"); 

    userSelect.removeAttribute("style");
    botSelect.removeAttribute("style"); 

    userSelect.classList.add("fa-solid", "fa-hand-back-fist");
    botSelect.classList.add("fa-solid", "fa-hand-back-fist");


    selectOptions.forEach((e1) => {
      e1.parentElement.classList.remove("active");
    });

    e.target.parentElement.classList.add("active");
    
    results.innerText = "Please Wait...";

    playground.classList.add("start");

    checkResult(index);
  });
});

const checkResult = (index) => {
  let randomNumber = Math.floor(Math.random() * 3);

  setTimeout(() => {
    playground.classList.remove("start");

    userSelect.classList.remove("fa-hand-back-fist");
    botSelect.classList.remove("fa-hand-back-fist");

    
    userSelect.classList.add(
      selectOptions[index].getAttribute("class").split(" ")[1]
    );
    botSelect.classList.add(
      selectOptions[randomNumber].getAttribute("class").split(" ")[1]
    );
    determineWinner(index,randomNumber);
  }, 2500);
};


function determineWinner(userChoice, compChoice){
    let gameResults = {
        RR : "Draw",
        PP : "Draw",
        SS : "Draw",
        RS : "User",
        PR : "User",
        SP : "User",
        RP : "Comp",
        SR : "Comp",
        PS : "Comp",

    };

    let userValue=["R","P","S"][userChoice];
    let compValue = ["R","P","S"][compChoice];
    let winner = gameResults[userValue + compValue];

    if(winner == "User"){
        userScoreData++;
        userScore.innerText = userScoreData;

        userSelect.style.color = "green";
        botSelect.style.opacity = "0.6";
    }
    if(winner == "Comp"){
        compScoreData++;
        compScore.innerText = compScoreData;

         botSelect.style.color = "green";
         userSelect.style.opacity = "0.6";
    }
    else {

    }

    results.textContent = userValue === compValue ? `Match ${winner}` : `${winner} Won!`;

    selectOptions.forEach((e1) => {
      e1.parentElement.classList.remove("active");
    });
}