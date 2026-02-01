document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtn = document.getElementById("next-btn");
  const resultBox = document.getElementById("result");
  const scoreEl = document.getElementById("score");
  const restartBtn = document.getElementById("restart-btn");
  const loadingText = document.getElementById("loading");

  let questions = [];
  let currIndex = 0;
  let score = 0;
  let answered = false;

  async function loadQuestions() {
    loadingText.classList.remove("hidden");
    questionEl.classList.add("hidden");
    optionsEl.classList.add("hidden");
    nextBtn.classList.add("hidden");

    const res = await fetch(
      "https://opentdb.com/api.php?amount=5&category=17&difficulty=easy&type=multiple",
    );
    const data = await res.json();
    questions = data.results;
    loadingText.classList.add("hidden");
    questionEl.classList.remove("hidden");
    optionsEl.classList.remove("hidden");

    showQuestion();
  }

  function showQuestion() {
    answered = false;
    nextBtn.classList.add("hidden");
    optionsEl.innerHTML = "";
    const q = questions[currIndex];
    questionEl.innerHTML = q.question;
    const answers = [...q.incorrect_answers, q.correct_answer];
    shuffle(answers);
    answers.forEach((answer) => {
      const btn = document.createElement("button");
      btn.classList.add("option");
      btn.innerHTML = answer;
      btn.addEventListener("click", () =>
        selectAnswer(btn, answer, q.correct_answer),
      );
      optionsEl.appendChild(btn);
    });
  }

  function selectAnswer(button, selected, correct) {
    if (answered) return;
    answered = true;
    const buttons = document.querySelectorAll(".option");
    buttons.forEach((btn) => {
      btn.disabled = true;
      if (btn.innerHTML === correct) {
        btn.classList.add("correct");
      }
    });
    if (selected === correct) {
      score++;
    } else {
      button.classList.add("wrong");
    }
    nextBtn.classList.remove("hidden");
  }

  nextBtn.addEventListener("click", () => {
    currIndex++;

    if (currIndex < questions.length) {
      showQuestion();
    } else showResult();
  });

  function showResult() {
    document.querySelector(".quiz-container").classList.add("hidden");
    questionEl.classList.add("hidden");
    optionsEl.classList.add("hidden");
    nextBtn.classList.add("hidden");
    resultBox.classList.remove("hidden");
    scoreEl.innerText = `You have scored ${score} / ${questions.length}`;
  }

  restartBtn.addEventListener("click", () => {
    currIndex = 0;
    score = 0;
    document.querySelector(".quiz-container").classList.remove("hidden");
    resultBox.classList.add("hidden");
    questionEl.classList.remove("hidden");
    optionsEl.classList.remove("hidden");
    loadQuestions();
  });

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  loadQuestions();
});
