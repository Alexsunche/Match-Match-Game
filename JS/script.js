const memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];

let memoryValues = [];
let memoryIDs = [];
let tilesFlipped = 0;

const sendDataToStorage = (userDataObj, time) => {
  userDataObj.score = time;
  if (!localStorage.getItem('savedUsersData')) {
    const jsData = [];
    pushData(userDataObj, jsData);
  }
  else {
    const jsData = JSON.parse(localStorage.getItem('savedUsersData'));
    pushData(userDataObj,jsData);
  }
};

const pushData = (userDataObj, jsData) => {
  jsData.push(userDataObj);
  const jsonData = JSON.stringify(jsData);
  localStorage.setItem("savedUsersData", jsonData);
}

const memoryFlipTile = (title, value, cardType, cardNumber) => {
  const jacket = './covers/jacket.png';
  let adress = `./covers/${cardType}/${value}.png`;
  if (memoryValues.length < 2) {
    title.style.backgroundImage = `url(${adress})`;
    if (memoryValues.length == 0) {
      memoryValues.push(value);
      memoryIDs.push(title.id);
    }
    else if (memoryValues.length == 1) {
      memoryValues.push(value);
      memoryIDs.push(title.id);
      if (memoryValues[0]==memoryValues[1]) {
        tilesFlipped += 2;

        function hideCard(){
          let cardOne = document.getElementById(memoryIDs[0]);
          let cardTwo = document.getElementById(memoryIDs[1]);
          cardOne.style.visibility = "hidden";
          cardTwo.style.visibility = "hidden";
          memoryValues = [];
          memoryIDs = [];
        }
        setTimeout(hideCard, 800);
      }
      else {
        function flipBack(){
          memoryIDs.map(card => document.getElementById(`${card}`).style.backgroundImage = `url(${jacket})`);
          memoryValues = [];
          memoryIDs = [];
       }
       setTimeout(flipBack, 800);
     }
    }
  }
}

const renderField = (fullName, complexity, selectedPicture, formData) => {
  const contentBox = document.querySelector('.content');

  let renderedCards = " ";
  let randomArray = shuffleArray(memory_array.slice(0, complexity));

  for (let i = 0; i < complexity; i++) {
    renderedCards += '<div class = "card" onclick="memoryFlipTile(this,\''+randomArray[i]+'\',\''+selectedPicture+'\',\''+randomArray.length+'\' )" id="'+i+'" ></div>';
  }

  contentBox.innerHTML = renderedCards;
  showTime(complexity, formData);
};

const saveInfo =  () => {
 let firstName = document.querySelector('#first-name').value;
 let lastName = document.querySelector('#last-name').value;
 let fullName = `${firstName}' '${lastName}`;
 let email = document.querySelector('#email').value;
 let options = document.querySelectorAll('option');
 let selectedOption;

 for (let i = 0; i < options.length; i++) {
   if (options[i].selected) {
     selectedOption=options[i].value;
   }
 };
 let selectedPictureId;
 let inputes = document.querySelectorAll('.cover-card input');

 for (let i = 0; i < inputes.length; i++) {
   if(inputes[i].checked) selectedPictureId = inputes[i].id;
 };
 let formData = {
   firstName,
   lastName,
   email,
   selectedOption,
   selectedPictureId
 };
 if(!formData.firstName||!formData.lastName||!formData.email||!formData.selectedOption||!formData.selectedPictureId) {
   alert('Данные не корректны.Что-то не ввели)');
 }
 else {
   document.querySelector('.form-box').style.display = 'none';
   renderField(fullName, selectedOption, selectedPictureId, formData);
 }
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const renderForm = () => {
  document.getElementById('start-info').style.display = 'none';
  document.getElementById('form-box').style.display = 'flex';
};

const showTime = (complexity, formData) => {
  let currentTime = 1;
  let clockPanel = document.getElementById('clock');
  let timeIt = () => {
    if (complexity == tilesFlipped) {
      clockPanel.innerHTML = "";
      clearInterval(interval);
      sendDataToStorage(formData, currentTime);
      createScoreBlock(formData, currentTime);
    }
    else {
      clockPanel.innerHTML = currentTime;
      currentTime++;
    }
  };
  let interval = setInterval(timeIt, 1100);
};

const createScoreBlock = (formData, currentTime) => {
  let content = document.getElementById('content');
  content.style.display = 'none';
  let scoreBox = document.getElementById("score-box");
  scoreBox.style.display = "block";

  let paragraph = document.getElementById('score-paragraph');
  let scoreMessage = `Concratulations ${formData.firstName}
      ${formData.lastName}. Your time : ${currentTime}, score : ${currentTime*formData.selectedOption}`;

  paragraph.innerHTML = scoreMessage;

  let results = showResults();
  scoreBox.insertBefore(results, document.getElementById('new-game'));

}

const showResults = () => {
  let localStorageData = JSON.parse(localStorage.getItem("savedUsersData"));
  let sortedlocalStorageData;
  let resultsList = document.createElement('ol');
  if (localStorageData) {
    sortedlocalStorageData = localStorageData.sort((a, b) => a.score*a.selectedOption - b.score*b.selectedOption);
  }
  if (sortedlocalStorageData.length > 10) {
    sortedlocalStorageData.splice(10, sortedlocalStorageData.length);
  }
  sortedlocalStorageData.forEach((item) => {
    let li = document.createElement('li');
    let liText = `${item.firstName} ${item.lastName} - time : ${item.score} - complexity : ${item.selectedOption} - score : ${item.score*item.selectedOption} `;
    li.textContent = liText;
    resultsList.appendChild(li);
  })
  return resultsList;
}
