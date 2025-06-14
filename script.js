const readline = require("readline");
const https = require("https");

// Function to make HTTPS GET request and parse JSON
function fetchFriends(userId) {
  const url = `https://friends.roblox.com/v1/users/${userId}/friends/`;
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
            resolve(json.data);
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
    const friends = await fetchFriends(userId1);

    const userId2 = await askQuestion("Enter roblox user ID to compare: ");
    const targetId = parseInt(userId2, 10);

    const match = friends.find((friend) => friend.id === targetId);

    if (match) {
      console.log(
        `✅ Match found! Name: ${match.name}, Display Name: ${match.displayName}`
      );
    } else {
      console.log("❌ No match found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
