const userFormEl = document.querySelector("#user-form");
const languageButtonsEl = document.querySelector("#language-buttons");
const nameInputEl = document.querySelector("#username");
const repoContainerEl = document.querySelector("#repos-container");
const repoSearchTerm = document.querySelector("#repo-search-term");
const usernameErrorEl = document.querySelector("#username-error");

const formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  const username = nameInputEl.value.trim();

  if (username) {
    usernameErrorEl.textContent = "";
    getUserRepos(username);

    // clear old content
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    usernameErrorEl.textContent = "Please enter a GitHub username";
  }
};

const buttonClickHandler = function(event) {
  // get the language attribute from the clicked element
  const language = event.target.getAttribute("data-language");

  if (language) {
    getFeaturedRepos(language);

    // clear old content
    repoContainerEl.textContent = "";
  }
};

const showRepoError = function(message) {
  const errorEl = document.createElement("p");
  errorEl.classList.add("repos-error");
  errorEl.textContent = message;
  repoContainerEl.appendChild(errorEl);
};

const getUserRepos = function(user) {
  // format the github api url
  const apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayRepos(data, user);
        });
      } else {
        showRepoError("Error: GitHub User Not Found");
      }
    })
    .catch(function(error) {
      showRepoError("Unable to connect to GitHub");
    });
};

const getFeaturedRepos = function(language) {
  // format the github api url
  const apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  // make a get request to url
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    } else {
      showRepoError("Error: " + response.statusText);
    }
  }).catch(function(error) {
    showRepoError("Unable to connect to GitHub");
  });
};

const displayRepos = function(repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (let i = 0; i < repos.length; i++) {
    // format repo name
    const repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a link for each repo
    const repoEl = document.createElement("a");
    repoEl.classList.add("list-item", "flex-row", "justify-space-between", "align-center");
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    const titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    const statusEl = document.createElement("span");
    statusEl.classList.add("flex-row", "align-center");

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
