
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
    let trait = prompt(`Please enter the ${traitSearch} you would like to search.`);
    let traitResults;

    if (traitSearch == 'height' || traitSearch == 'weight') {
        trait = parseInt(trait);
        traitResults = people.filter(person => person[traitSearch] == trait);
    } else {
        traitResults = people.filter(person => person[traitSearch] == trait);
    }

    if (traitResults.length > 1) {
        if (searchCount == 4) {
            alert("Max number of traits Reached.");
            return traitResults;
        } else {
            displayPeople(`People with ${traitSearch}: ${trait}`, traitResults);
            const nextLevel = validatedPrompt('Multiple people found. Filter search?', ['yes', 'no']);
            if (nextLevel.toLowerCase() == 'yes') {
            traitResults = searchByTraits(traitResults , searchCount++);
            }
        }
    } else if (traitResults.length == 0) {
        alert('No results found.');
    }
    return traitResults;
}


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
    const descend = [];
    const children = people.filter(el => el.parents.includes(person.id));

    children.forEach(child => {
        descend.push(child);
        descend = descend.concat(findPersonDescendants(child, people));
    });
    return descend;
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
            let personFamily = findPersonFamily(person, people);
            displayPeople(`Family of ${person.firstName} ${person.lastName}`, personFamily);
            break;
        case "descendants":
            let personDescendants = findPersonDescendants(person, people);
            displayDescendants(`Descendants of ${person.firstName} ${person.lastName}`, personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayDescendants(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function displayPeople(displayTitle, peopleToDisplay) {
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
