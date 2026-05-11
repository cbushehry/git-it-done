const repoNameEl = document.querySelector("#repo-name");
const issueContainerEl = document.querySelector("#issues-container");
const limitWarningEl = document.querySelector("#limit-warning");

const getRepoName = function() {
  // grab repo name from url query string
  const repoName = new URLSearchParams(document.location.search).get("repo");

  if (repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
  } else {
    // if no repo was given, redirect to the homepage
    document.location.replace("./index.html");
  }
};

const getRepoIssues = function(repo) {
  // format the github api url
  const apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // make a get request to url
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayIssues(data);

        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful, redirect to homepage
      document.location.replace("./index.html");
    }
  });
};

const displayIssues = function(issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  // loop over given issues
  for (let i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    const issueEl = document.createElement("a");
    issueEl.classList.add("list-item", "flex-row", "justify-space-between", "align-center");
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title
    const titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    const typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    // append to the dom
    issueContainerEl.appendChild(issueEl);
  }
};

const displayWarning = function(repo) {
  // add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  // create link element
  const linkEl = document.createElement("a");
  linkEl.textContent = "GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
