
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}

function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );



    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            results = searchByTraits(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }

    return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function searchByTraits(people, searchCount = 0) {
    const traitSearch = validatedPrompt('Please enter the trait you would like to search.', ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation']);
    let traitSpecifics = prompt(`Please enter the ${traitSearch} you would like to search for.`);
    let traitResults;

    if (traitSearch == 'height' || traitSearch == 'weight') {
        traitSpecifics = parseInt(traitSpecifics);
        traitResults = people.filter(person => person[traitSearch] === traitSpecifics);
    } else if (traitSearch === 'eyecolor') {
        traitResults = people.filter(person => person.eyeColor === traitSpecifics);
    }
    else {
        traitResults = people.filter(person => person[traitSearch]=== traitSpecifics);
    }

    if (traitResults.length > 1) {
        if (searchCount == 4) {
            alert("Max number of traits Reached.");
            return traitResults;
        } else {
            displayPeople(`People with ${traitSearch}: ${traitSpecifics}`, traitResults);
            const nextLevel = validatedPrompt('Multiple people found. Do you want to further filter search?', ['yes', 'no']);
            if (nextLevel.toLowerCase() == 'yes') {
            traitResults = searchByTraits(traitResults , searchCount++);
            }
        }
      } else if (traitResults.length === 0) {
        alert('No results found.');
    }
    return traitResults;
}

    // "id": 272822514,
    // "firstName": "Billy",
    // "lastName": "Bob",
    // "gender": "male",
    // "dob": "1/18/1949",
    // "height": 71,
    // "weight": 175,
    // "eyeColor": "brown",
    // "occupation": "programmer",
    // "parents": [],
    // "currentSpouse": 401222887

function displayPersonInfo(person){
    const fullName = person.firstName + " " + person.lastName
    alert(`Full Name: ${fullName}\nID: ${person.id}\nGender: ${person.gender}\nDOB: ${person.dob}\nheight: ${person.height}\nweight: ${person.weight}\nEye Color: ${person.eyeColor}\nOccupation: ${person.occupation}\nParents: ${person.parents}\nCurrent Spouse: ${person.parents}`);
}

function findPersonFamily(person,people) {
    let personFamily = people.filter(function(el){
        if (el.id == person.currentSpouse){
            el['relationship'] = "spouse";
        } else if (el.id == person.parents[0] || el.id == person.parents[1]){
            el['relationship'] = "parent";
        } else if (person.parents.includes(el.parents[0]) || person.parents.includes(el.parents[1]) && person.id != el.id){
            el["relationship"] = "sibling";
        }
        return ((el.id == person.currentSpouse || el.id == person.parents[0] || el.id == person.parents[1] || person.parents.includes(el.parents[0]) || person.parents.includes(el.parents[1])) && person.id != el.id);
    })
    return personFamily;
}

function findPersonDescendants(person, people) {
    let personChildren = people.filter(function(el){
        if (el.parents[0] == person.id || el.parents[1] == person.id){
            el['relationship'] = "child";
        }
        return el.parents[0] == person.id || el.parents[1] == person.id;
    })
    return personChildren;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            displayPersonInfo(person);
            break;
        case "family":
            //! TODO
            let personFamily = findPersonFamily(person, people);
            displayDescendants(`Family of ${person.firstName} ${person.lastName}`, personFamily);
            break;
        case "descendants":
            let personDescendants = findPersonDescendants(person, people);
            displayDescendants('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function displayDescendants(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName} : ${person.relationship}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}