import questions from './questions.js';
const DIV = document.querySelector('.container')
let size = 5 // size of quiz

// create arr of random quests 
let randomQuests = createRandomArray(questions, size);
let questsWithCorrect = attachAnswerToQusts(questions, randomQuests);

// let arrIndex = -1;
let indexArr = 0;

// const oldCards = [];
const spcialCards = [];


init();
function init() {
    welcome();

}

function welcome() {
    let welcomeGreat = document.createElement('h2');
    welcomeGreat.textContent = 'Welcome to trivia quiz';
    welcomeGreat.classList.add("welcome")
    let card = document.createElement('div')
    card.classList.add('card')
    let startBtn = document.createElement('button');
    startBtn.textContent = "start Game"
    startBtn.classList.add('start')
    card.append(welcomeGreat, startBtn);
    DIV.appendChild(card)
    startBtn.addEventListener('click', () => {
        let arr_index = -1;
        play(arr_index);
    })
}

function play(_arrIndex) {
    let arrIndex = _arrIndex + 1
    let currentCards = document.getElementsByClassName('card')
    for (let i = 0; i < currentCards.length; i++) {
        DIV.removeChild(currentCards[i])
    }
    if (arrIndex < questsWithCorrect.length) {
        let newQuestionCard = createCardQuestion(questions[questsWithCorrect[arrIndex].questIndex], arrIndex)
        DIV.appendChild(newQuestionCard)
    }
    else {
        gameSummary();
    }
};
function createElementWithClass(_tagName, _class){
    let element = document.createElement(_tagName)
    element.classList.add(_class)
    return element
}
function createCardQuestion(quest, _arrIndex) {
    let card = createElementWithClass('div','card')
    // card.classList.add('card')
    const [questionHead, form] = createQuestion(quest)
    let submitBtn = createSubmitButton(_arrIndex)
    // app to container
    form.append(submitBtn)
    card.append(questionHead, form)
    return card
}

function createQuestion(quest) {
    // create question head
    let questionHead = document.createElement('h2');
    questionHead.textContent = quest.question
    questionHead.classList.add('question-head')
    // create answers
    let form = document.createElement('form')
    let answers = document.createElement('ol');
    let i = 1;
    let chooseBtn;
    for (let choice of quest.choices){
        let answer = document.createElement('li');
        let label = document.createElement('label');
        label.for = `answer${String(i)}`
        let answerText = document.createElement('span');
        answerText.textContent = choice;
        chooseBtn = document.createElement('input');
        chooseBtn.type = 'radio'
        chooseBtn.name = 'choose'
        chooseBtn.id = `answer${String(i)}`
        i++;
        label.append(chooseBtn, answerText)
        answer.append(label)
        answers.append(answer)
    }
    form.append(answers)
    return [questionHead, form]
}

function createSubmitButton(_arrIndex) {
    let submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'next'
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let answerChoose = checkRadio();
        if (answerChoose) {
            let questControl = questsWithCorrect[_arrIndex]
            if ((answerChoose - 1) === (questControl.correctAnswer)) {
                questControl.success = true
                questControl.choosed = answerChoose;
            }
            else {
                questControl.success = false
                questControl.choosed = answerChoose;
            }
            play(_arrIndex);
        }
        else {
            console.log("please choose a question")
        }
    })
    return submitBtn
}
function checkRadio() {
    // accessing the radio buttons
    let answer1 = document.getElementById('answer1');
    let answer2 = document.getElementById('answer2');
    let answer3 = document.getElementById('answer3');
    let answer4 = document.getElementById('answer4');
    // checking if any radio button is selected
    if (answer1.checked) {
        return 1;
    }
    if (answer2.checked) {
        return 2;
    }
    if (answer3.checked) {
        return 3;
    }
    if (answer4.checked) {
        return 4;
    }
    return false
}

function createRandomArray(arrayOfObjects, arrLen) {
    let randomArray = [];
    let numbersRange = [];
    for (let i = 0; i < arrayOfObjects.length; i++) {
        numbersRange.push(i)
    }
    for (let i = 0; i < arrLen; i++) {
        let randomNumber = Math.floor(Math.random() * numbersRange.length)
        console.log(randomNumber)
        let removedNumber = numbersRange.splice(randomNumber, 1)
        randomArray.push(removedNumber[0])
    }
    return randomArray
}

function attachAnswerToQusts(arrayOfObjects, arr) {
    let questAndCorrectAnswer = [];
    for (let i of arr) {
        let correctAnswer = arrayOfObjects[i].correctAnswer;
        arrayOfObjects[i].choices.forEach((choice, index) => {
            if (choice === correctAnswer) {
                questAndCorrectAnswer.push({ questIndex: i, correctAnswer: index })
            }

        })
    }
    return questAndCorrectAnswer
}


function gameSummary() {
    let card = document.createElement('div')
    card.classList.add('card')
    let p = document.createElement('p')
    p.classList.add('score')
    let showCorrectBtn = document.createElement('button')
    showCorrectBtn.classList.add('show-answers')
    showCorrectBtn.textContent = "show answers";
    let score = 0;
    for (let quest of questsWithCorrect) {
        console.log(quest);
        if (quest.success) {
            score += 10;
            console.log(score);
        }
    }
    p.textContent = `your score in the quiz is ${score}`
    card.append(p, showCorrectBtn)
    DIV.appendChild(card)
    showCorrectBtn.addEventListener('click', playShowCorrect)

}

function showCorrectAnswer(quest) {
    let card = document.createElement('div')
    card.classList.add('card')
    const [questionHead, form] = createQuestion(quest)
    let submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'next'
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playShowCorrect();
        console.log('play')
    })
    // app to container
    form.append(submitBtn)
    card.append(questionHead, form)
    return card
}

function playShowCorrect() {
    console.log('playShowCorrect IS WORK')
    removeOldCard();
    if (indexArr < questsWithCorrect.length) {
        let newQuestionCard = showCorrectAnswer(questions[questsWithCorrect[indexArr].questIndex])
        DIV.appendChild(newQuestionCard)
        cursorWrongAnswers(questsWithCorrect[indexArr].choosed)
        cursorCorrectAnswers(questsWithCorrect[indexArr].correctAnswer + 1)
        indexArr += 1;
    }
    else {
        DIV.append(spcialCards[0])
        indexArr = 0
    }
}

function removeOldCard() {
    let currentCards = document.getElementsByClassName('card')
    if (currentCards.length) {
        for (let i = 0; i < currentCards.length; i++) {
            spcialCards.push(DIV.removeChild(currentCards[i]))
        }
    }
}

function cursorWrongAnswers(wrongAnswer) {
    let wrongLabel = document.querySelector(`#answer${wrongAnswer}`).parentElement
    console.log(wrongLabel)
    wrongLabel.classList.add('wrong-answer')
};

function cursorCorrectAnswers(correctAns) {
    let correctLabel = document.querySelector(`#answer${correctAns}`).parentElement
    correctLabel.classList.add('correct-answer')
};