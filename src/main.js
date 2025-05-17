import './style.css';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');

const questions = {
  1: [],
  2: [],
  3: []
}

const state = {
  levelIndex: 0,
  questionIndex: 0,
  questionOrder: []
};

const levelLabels = {
  1: {'label': 'Level 1', 'description': '(Helps people feel comfortable, gets conversation started, builds trust.)'},
  2: {'label': 'Level 2', 'description': '(Encourages reflection on calling, wiring, spiritual formation, and purpose.)'},
  3: {'label': 'Level 3', 'description': '(Challenges people to think about their impact, role in the Body, and ongoing growth.)'}
};

async function loadQuestions() {
  // Load level 1 questions
  const response = await fetch('/hillsong-ca-gift-cards/level1.txt');
  const text = await response.text();
  questions[1] = text.split('\n').filter(Boolean);
  // Load level 2 questions
  const response2 = await fetch('/hillsong-ca-gift-cards/level2.txt');
  const text2 = await response2.text();
  questions[2] = text2.split('\n').filter(Boolean);
  // Load level 3 questions
  const response3 = await fetch('/hillsong-ca-gift-cards/level3.txt');
  const text3 = await response3.text();
  questions[3] = text3.split('\n').filter(Boolean);
}

async function initialize() {
  await loadQuestions();
  render();
}

function render() {
  if (state.levelIndex === 0) {

    app.innerHTML = `
      <div class="home-container">
      <div class="nav-header-container">
        <button id="exit" class="nav-button" style="visibility: hidden">Exit</button>
        <h1>Gifts of the Spirit</h3>
        <button id="next" class="nav-button" style="visibility: hidden">Next</button>
      </div>
      <div class="buttons-container">
        ${[1,2,3]
          .map(
            (num) => `
              <button class="level-button" data-value="${num}">
                <p class="button-label" data-value="${num}">${levelLabels[num].label}</p>
                </br>
                <p class="button-description" data-value="${num}">${levelLabels[num].description}</p>
              </button>
            `
          )
          .join('')}
      </div>
      <div>
          <button id="instructions" class="nav-button">Instructions</button>
      </div>
      </div>
    `;

    document.querySelectorAll('.level-button').forEach((button) => {
      button.addEventListener('click', (e) => {

        // Set the level index based on the button clicked
        state.levelIndex = parseInt(e.target.dataset.value);

        // Randomly initialize the order of the questions
        state.questionOrder = [];
        for (let i = 0; i < questions[state.levelIndex].length; i++) {
          state.questionOrder.push(i);
        }
        state.questionOrder.sort(() => Math.random() - 0.5);

        // Reset the question index
        state.questionIndex = 0;

        render();
      });
    });

    document.querySelector('#instructions').addEventListener('click', () => {
      // Reset the state
      state.levelIndex = -1;
      render();
    });

  } else if (state.levelIndex > 0) {

    app.innerHTML = `
      <div class="level-container">
      <div class="nav-header-container">
        <button style="align-items:left" class="nav-button" id="exit">Exit</button>
        <h1>Gifts of the Spirit</h3>
        <button id="next" class="nav-button" style="visibility: ${state.questionIndex < questions[state.levelIndex].length - 1 ? 'visible' : 'hidden'}">Next</button>
      </div>
      <div class="question-container">
        <h1>${questions[state.levelIndex][state.questionOrder[state.questionIndex]]}</h1>
      </div>
      <div class="progress-bar-container">
        <p class="progress-text">Question ${state.questionIndex + 1} of ${questions[state.levelIndex].length}</p>
        <div class="progress-bar" style="width: ${(state.questionIndex + 1) / questions[state.levelIndex].length * 100}%;"></div>
      </div>
      </div>
    `;

    document.querySelector('#exit').addEventListener('click', () => {
      // Reset the state
      state.levelIndex = 0;
      state.questionIndex = 0;
      state.questionOrder = [];
      render();
    });
    document.querySelector('#next').addEventListener('click', () => {
      // Increment the question index
      state.questionIndex++;
      render();
    });
  } else if (state.levelIndex === -1) {

    app.innerHTML = `
      <div class="instructions-page-container">
      <div class="nav-header-container">
        <button id="exit" class="nav-button" style="visibility: hidden">Exit</button>
        <h1>Gifts of the Spirit</h3>
        <button id="next" class="nav-button" style="visibility: hidden">Next</button>
      </div>
      <div class="instructions-container">
        <h2>Instructions</h3>
        <p>A Game for 2+ Players</p>
        <h3>Purpose</h3>
        <p>This game is designed to help followers of Jesus discover more about one another, explore spiritual gifts, and reflect on how we participate in Christ’s work in the world.</p>
        <h3>How to Play</3h>
        <ol>
          <li>Take turns selecting a card from the current level.</li>
          <li>Two ways to play each card:</li>
          <ul>
            <li>Everyone in the group answers the question.</li>
            <li>The card player picks one person to answer.</li>
          </ul>
          <li>After at least 10 questions (or more) have been played in the current level, the group may choose to advance to the next level.</li>
        </ol>
      </div>
      <div class="back-container">
      </div>
        <button id="home" class="nav-button">Exit</button>
      </div>
    `;

    document.querySelector('#home').addEventListener('click', () => {
      // Reset the state
      state.levelIndex = 0;
      render();
    });
  }
}

initialize();
