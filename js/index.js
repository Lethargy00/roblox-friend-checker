let resolvedUserId = null;
const searchInput = document.getElementById("userId1");
searchInput.addEventListener("input", debounce(handleInput, 300));
const secondSearchInput = document.getElementById("secondInputSection");
secondSearchInput.addEventListener("input", debounce(handleInput, 300));

function handleInput(event) {
  const query = event.target.value;

  let body = {
    usernames: [query],
    excludeBannedUsers: false,
  };

  if (query.length > 0) {
    fetch("https://corsproxy.io/?https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {},
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          resolvedUserId = data.data[0].id;
        } else {
          resolvedUserId = null;
        }
      });
  } else {
    resultsDiv.innerHTML = "";
  }
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

let friendsList = [];
const resultDiv = document.getElementById("result");

function getFriends() {
  resultDiv.innerText = "";
  const userId = resolvedUserId;

  if (!userId) {
    alert("Please enter a valid username.");
    return;
  }

  const loadingDiv = document.getElementById("loading-svg");
  loadingDiv.style.display = "block";

  fetch(
    `https://corsproxy.io/?https://friends.roblox.com/v1/users/${userId}/friends/`
  )
    .then((response) => response.json())
    .then((data) => {
      friendsList = data.data || [];

      if (friendsList.length === 0) {
        const resultCountParagraph = document.getElementById(
          "result-count-paragraph"
        );

        resultCountParagraph.innerHTML = "No friends found for this user.";
      } else {
        const resultCount = document.getElementById("result-count");

        resultCount.innerText = friendsList.length;

        let number = 0;

        friendsList.forEach((friend) => {
          const tableCell1HTML = document.createElement("div");
          const tableCell2HTML = document.createElement("div");
          const tableCell3HTML = document.createElement("div");

          tableCell1HTML.classList.add("p-1", "pl-3", "mb-1", "rounded-l-lg");
          tableCell2HTML.classList.add("p-1", "mb-1");
          tableCell3HTML.classList.add("p-1", "pr-3", "mb-1", "rounded-r-lg");

          if (number % 2 == 0) {
            tableCell1HTML.classList.add("bg-[#FFD4DB]");
            tableCell2HTML.classList.add("bg-[#FFD4DB]");
            tableCell3HTML.classList.add("bg-[#FFD4DB]");
          }

          tableCell1HTML.innerText = friend.name;
          tableCell2HTML.innerText = friend.displayName;
          tableCell3HTML.innerText = friend.id;

          resultDiv.appendChild(tableCell1HTML);
          resultDiv.appendChild(tableCell2HTML);
          resultDiv.appendChild(tableCell3HTML);

          number++;
        });
        document.getElementById("loading-svg").style.display = "none";
        document.getElementById("result").style.display = "grid";
        document.getElementById("result-header").style.display = "grid";
        document.getElementById("result-count-paragraph").style.display =
          "block";
        document.getElementById("secondInputSection").style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("Error fetching friends:", error);
      resultDiv.innerText =
        "Error fetching friends. Check the username and try again.";
    });
}

function checkFriend() {
  const secondId = resolvedUserId;

  const friendMatch = document.getElementById("friend-match");

  if (secondId) {
    let matchHtml =
      "❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found! ❌ No match found!";
    friendsList.forEach((friend) => {
      if (friend.id === secondId) {
        document.getElementById("friend-match").style.display = "flex";
        document.getElementById("dark-background").style.display = "block";
        matchHtml = `✅ Match Found!\nName: ${friend.name}, Display Name: ${friend.displayName}`;
        return;
      }
      document.getElementById("friend-match").style.display = "flex";
      document.getElementById("dark-background").style.display = "block";
    });
    friendMatch.innerHTML = matchHtml;
  }

  document.getElementById("secondInputSection").style.display = "block";
}

function closeFriendMatch() {
  document.getElementById("friend-match").style.display = "none";
  document.getElementById("dark-background").style.display = "none";
}
