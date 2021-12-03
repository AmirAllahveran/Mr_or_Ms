const nameInput = document.querySelector('#name');
const submitButton = document.querySelector('.submit');
const saveButton = document.querySelector('.save');
const clearButton = document.querySelector('.clear');
const predictionGender = document.querySelector('.prediction_gender');
const predictionPercent = document.querySelector('.prediction_percent');
const savedAnswerCard = document.querySelector('.saved_card');
const savedAnswerContent = document.querySelector('.saved_answer_content');
const maleRB = document.getElementById('male');
const femaleRB = document.getElementById('female');
const actionResult = document.querySelector('.action_result');



// send request to server and get data for input name then call functions to show result
async function getGender(e) {
    let name = nameInput.value;
    e.preventDefault();
    if (checkValidity(name)) {
        try {
            let response = await fetch(`https://api.genderize.io/?name=${name}`);
            let obj = await response.json();
            if (response.status != 200) {
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            setPrediction(obj);
            let data = await JSON.parse(window.localStorage.getItem(name));
            console.log(data);
            if (data != null) {
                savedAnswerCard.style.display = "block";
                setSavedAnswer(data);
            } else {
                savedAnswerCard.style.display = "none";
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        showAlert("Invalid input!");
    }
}

// show Prediction result to user
function setPrediction(obj) {
    if (obj.gender == "male") {
        var icon = '<span><i class="fas fa-male"></i><span>';
    } else if (obj.gender == "female") {
        var icon = '<span><i class="fas fa-female"></i><span>';
    }
    predictionGender.innerHTML = "<span>" + icon + "  " + obj.gender + "</span>";
    predictionPercent.innerHTML = '<span><i class="fas fa-percent" style="font-size:10px" ></i>  ' + (obj.probability * 100) + '</span>';
}

// show SavedAnswer to user
function setSavedAnswer(obj) {
    if (obj.gender == "male") {
        var icon = '<span><i class="fas fa-male"></i><span>';
    } else if (obj.gender == "female") {
        var icon = '<span><i class="fas fa-female"></i><span>';
    }
    savedAnswerContent.innerHTML = "<span>" + icon + "  " + obj.gender + "</span><br>" + '<span><i class="fas fa-percent" style="font-size:10px" ></i>  ' + (obj.probability * 100) + '</span>';

}

// save prediction result or user idea in local storage
async function savePrediction(e) {
    let name = nameInput.value;
    let maleChecked = maleRB.checked;
    console.log(maleChecked);
    let femaleChecked = femaleRB.checked;
    console.log(femaleChecked);
    e.preventDefault();
    if (checkValidity(name)) {
        if (maleChecked || femaleChecked) {
            const userObj = {
                name: name,
                gender: maleChecked ? "male" : "female",
                probability: 1,
                count: 1
            };
            console.log(userObj);
            window.localStorage.setItem(name, JSON.stringify(userObj));
        } else {
            let response = await fetch(`https://api.genderize.io/?name=${name}`);
            let obj = await response.json();
            console.log(obj);
            window.localStorage.setItem(name, JSON.stringify(obj));
        }

        showAlert("Saved!");
    } else {
        showAlert("Can not Save!");
    }
}

// remove saved answer
function removeSavedAnswer(e) {
    let name = nameInput.value;
    e.preventDefault();
    window.localStorage.removeItem(name);
    showAlert("Removed!");
    savedAnswerCard.style.display = "none";
}

// this function check input name validity
function checkValidity(name) {
    const regex1 = /[A-Za-z ]+/g;
    const regex2 = /[0-9\.\-\/]+/g;
    const foundValid = name.match(regex1);
    const foundNotValid = name.match(regex2);
    console.log(foundValid);
    console.log(foundNotValid);
    if (foundNotValid == null && foundValid.length > 0) {
        return true;
    }
    return false;

}

// show error 
function showAlert(title) {
    actionResult.style.display = "block";
    actionResult.innerHTML = "<span>" + title + "</span>";
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        actionResult.style.display = "none";
    }, 4000);
}

submitButton.addEventListener('click', getGender);
saveButton.addEventListener('click', savePrediction);
clearButton.addEventListener('click', removeSavedAnswer);
window.localStorage.clear();
