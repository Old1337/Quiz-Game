"use strict";

const questionsCount = document.querySelector(".count span");

const bulletsContainer = document.querySelector(".bullets .spans");

const quizTitle = document.querySelector(".quiz-area");

const answersContainer = document.querySelector(".answers-area");

const submitBtn = document.querySelector(".submit-button");

const bullets = document.querySelector(".bullets");

const resultsContainer = document.querySelector(".results");

const countDownEl = document.querySelector(".count-down");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let countDownDuration = 60; // 1 min

const getQuestions = async () => {
  const data = await fetch("questions.json");

  const response = await data.json();

  const questionsLength = response.length;

  createBullets(questionsLength);

  addQuestionsToPage(response[currentIndex], questionsLength);

  submitBtn.addEventListener("click", () => {
    const rightAnswer = response[currentIndex].right_answer;

    currentIndex++;

    isRightAnswer(rightAnswer, questionsLength);

    // remove the previous question
    quizTitle.textContent = "";
    answersContainer.textContent = "";

    // add the next question to the page
    addQuestionsToPage(response[currentIndex], questionsLength);

    showResults(questionsLength);

    clearInterval(countDownInterval);

    countDown(countDownDuration, questionsLength);
  });
  countDown(countDownDuration, questionsLength);
};

getQuestions();

function createBullets(num) {
  questionsCount.textContent = num;

  for (let i = 0; i < num; i++) {
    const bullet = document.createElement("span");

    bulletsContainer.appendChild(bullet);
  }
  bulletsContainer.childNodes[0].classList.add("active");
}

function addQuestionsToPage(obj, questionLength) {
  if (currentIndex < questionLength) {
    const title = document.createElement("h2");

    const question = document.createTextNode(obj.title);

    title.appendChild(question);

    quizTitle.appendChild(title);

    for (let i = 1; i <= 4; i++) {
      const mainDiv = document.createElement("div");

      mainDiv.className = "answer";

      const radioInput = document.createElement("input");

      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      const label = document.createElement("label");
      const labelText = document.createTextNode(obj[`answer_${i}`]);

      label.htmlFor = `answer_${i}`;
      label.appendChild(labelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      answersContainer.appendChild(mainDiv);
    }

    // add active class on the first bullet
    bulletsContainer.childNodes[currentIndex].classList.add("active");

    // add checked attribute on the first element
    document.querySelector(".answer").children[0].checked = true;
  }
}

function isRightAnswer(rightAnswer) {
  const answers = document.getElementsByName("question");

  let chosenAnswer;

  answers.forEach((answer) => {
    if (answer.checked) {
      chosenAnswer = answer.dataset.answer;
    }
  });

  if (rightAnswer === chosenAnswer) {
    rightAnswers++;
  }
}

function showResults(questionsLength) {
  let resultMsg;

  if (currentIndex === questionsLength) {
    removeALlElments();

    if (rightAnswers > questionsLength / 2 && rightAnswers < questionsLength) {
      resultMsg = `<span class="good"> very good! </span> you have answered ${rightAnswers} out of ${questionsLength} `;
    } else if (rightAnswers === questionsLength) {
      resultMsg = `<span class="perfect"> Perfect! </span> you have answered ${rightAnswers} out of ${questionsLength}`;
    } else {
      resultMsg = `<span class ="bad"> Bad! </span> you have answered ${rightAnswers} out of ${questionsLength}`;
    }

    resultsContainer.innerHTML = resultMsg;
  }
}

function removeALlElments() {
  quizTitle.remove();
  answersContainer.remove();
  bullets.remove();
  submitBtn.remove();
}

function countDown(duration, questionsLength) {
  if (currentIndex < questionsLength) {
    let minutes, seconds;

    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownEl.innerHTML = `${minutes}:${seconds} `;

      if (duration === 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
      duration--;
    }, 1000);
  }
}
