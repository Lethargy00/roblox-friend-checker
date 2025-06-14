const readline = require("readline");
const https = require("https");

// Function to make HTTPS GET request and parse JSON
function fetchFriends(userId, nextCursor) {
  let url = `https://friends.roblox.com/v1/users/${userId}/friends/find?limit=50`;

  if (nextCursor != null && nextCursor.length > 0) {
    url = `https://friends.roblox.com/v1/users/${userId}/friends/find?limit=50&cursor=${nextCursor}`;
  }

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        // Collect data chunks
        res.on("data", (chunk) => {
          data += chunk;
        });

        // On end, parse and resolve
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject("Failed to parse response");
          }
        });
      })
      .on("error", (err) => {
        reject(err.message);
      });
  });
}

function fetchUserDetails(userId) {
  const url = `https://users.roblox.com/v1/users/${userId}`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        // Collect data chunks
        res.on("data", (chunk) => {
          data += chunk;
        });

        // On end, parse and resolve
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject("Failed to parse response");
          }
        });
      })
      .on("error", (err) => {
        reject(err.message);
      });
  });
}

// Function to prompt for input
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// Main logic
async function main() {
  try {
    const userId1 = await askQuestion("Enter roblox user ID: ");
    let allFriends = [];
    let allFriendsDetailed = [];
    let shouldContinue = true;
    let nextCursor = "";

    // Fetch all friends ids.
    do {
      let paginatedFriends = [];

      paginatedFriends = await fetchFriends(userId1, nextCursor);

      nextCursor = paginatedFriends.NextCursor;

      allFriends = allFriends.concat(paginatedFriends.PageItems);

      if (paginatedFriends.NextCursor == null) {
        shouldContinue = false;
      }
    } while (shouldContinue);

    // Fetch all friends details.
    for (let i = 0; i < allFriends.length; i++) {
      const detailedUser = await fetchUserDetails(allFriends[i].id);

      allFriendsDetailed = allFriendsDetailed.concat(detailedUser);
    }

    const userId2 = await askQuestion("Enter roblox user ID to compare: ");
    const targetId = parseInt(userId2, 10);

    const match = allFriendsDetailed.find((friend) => friend.id === targetId);

    if (match) {
      console.log(
        `✅ Match found! Name: ${match.name} Display Name: ${match.displayName}.`
      );
    } else {
      console.log("❌ No match found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
