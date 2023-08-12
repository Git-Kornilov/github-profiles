'use strict';

// use axios library

const API_URL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// make user card
const crateUserCard = function (user) {
  const cardHTML = `
	<div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>

        <div class="user-info">
          <h2>${user.name}</h2>

          <p>
            ${user.bio ? user.bio : 'no information'}
          </p>

          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
       		<li>${user.following} <strong>Following</strong></li>
        	<li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div id="repos"></div>
        </div>
      </div>
	`;

  main.innerHTML = cardHTML;
};

// make user repos card
const addReposToCard = function (repos) {
  const reposEl = document.getElementById('repos');

  // only ten repos
  repos.slice(0, 10).forEach(repo => {
    const repoEl = document.createElement('a');

    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
};

// make error card
const createErrorCard = function (err) {
  const cardHTMLError = `
  <div class="card">
    <h1>${err}</h1>    
  </div>
  `;

  main.innerHTML = cardHTMLError;
};

// fetch user repos info
const getRepos = async function (username) {
  try {
    const { data } = await axios.get(
      API_URL + username + '/repos?sort=created'
    ); // ?sort repos created time

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
};

// fetch user info
const getUser = async function (username) {
  try {
    const { data } = await axios.get(API_URL + username);

    crateUserCard(data); // make user card
    getRepos(username); // make user repos
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this username');
    }
  }
};

// listener for search user input form
form.addEventListener('submit', e => {
  e.preventDefault();

  const user = search.value;

  if (user) getUser(user);

  search.value = '';
});
