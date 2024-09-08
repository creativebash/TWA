// Initialize Telegram WebApp
const TWApp = window.Telegram.WebApp;

// Global variable to track the current action
let currentAction = null;

// Placeholder data for user information
const userDataPlaceholder = {
  user: {
    id: 966521814,
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    language_code: "en",
    allows_write_to_pm: true,
  },
  chat_instance: "-2324007710334587311",
  chat_type: "private",
  auth_date: "1725135456",
  hash: "4a0ac40dde18d0146cc2e01234567893dbd96253a8f43deee9042d29f1340355",
};

// ! Determine whether to use real or placeholder data
const userData =
  TWApp && Object.keys(TWApp.initDataUnsafe).length > 0
    ? TWApp.initDataUnsafe
    : userDataPlaceholder;

// Display user data in the webview
document.getElementById("webview_data").innerHTML = JSON.stringify(
  userData,
  null,
  2
);

// Main app initialization
function initApp() {
  console.log("App initializing...");
  TWApp.ready();
  TWApp.expand();

  // Set up navigation
  document.querySelector("nav").addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").substring(1);
      console.log("Navigating to section:", sectionId);
      showSection(sectionId);
    }
  });

  // Initial section load
  showSection("profile");
}

// Function to display a specific section
function showSection(sectionId) {
  console.log("Displaying section:", sectionId);
  document.querySelectorAll("main > section").forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });

  // Update the current action
  currentAction = sectionId;

  switch (sectionId) {
    case "profile":
      loadProfile();
      break;
    case "feed":
      loadFeed();
      break;
    case "create-post":
      setupPostForm();
      break;
  }
}

// Load the user profile section
function loadProfile() {
  console.log("Loading user profile...");
  sendDataToBot({ action: "profile" });
}

// Load the feed section
function loadFeed() {
  console.log("Loading feed...");
  sendDataToBot({ action: "feed" });
}

// Set up the post creation form
function setupPostForm() {
  console.log("Setting up post form...");
  const form = document.getElementById("post-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    const tags = document.getElementById("post-tags").value;
    sendDataToBot({ action: "post", content, tags });
  };
}

// Function to send data to the bot
function sendDataToBot(data) {
  const dataToSend = JSON.stringify(data);
  console.log("Sending data to bot:", dataToSend);
  TWApp.sendData(dataToSend);
}

// Handle incoming messages from the bot
function handleIncomingMessages() {
  TWApp.onEvent("message", function (message) {
    console.log("Message received:", message);

    try {
      const data = JSON.parse(message.data);
      processIncomingData(data);
    } catch (error) {
      console.error("Error parsing incoming message:", error);
    }
  });
}

// Process the incoming data based on the action
function processIncomingData(data) {
  switch (data.action) {
    case "profile":
      if (data.user) {
        document.getElementById("profile-content").innerHTML = `
          <h3>${data.user.username}</h3>
          <p>${data.user.bio}</p>
          <p>Favorite cryptocurrencies: ${data.user.favorite_cryptocurrencies}</p>
        `;
      }
      break;

    case "feed":
      if (Array.isArray(data.posts)) {
        const feedHtml = data.posts
          .map(
            (item) => `
              <div class="post">
                <h3>${item.author}</h3>
                <p>${item.post.content}</p>
                <p>Tags: ${item.post.tags}</p>
                <p>Posted: ${new Date(
                  item.post.created_at
                ).toLocaleString()}</p>
              </div>
            `
          )
          .join("");
        document.getElementById("feed-content").innerHTML = feedHtml;
      }
      break;

    case "post":
      if (data.post) {
        alert("Post created successfully!");
        showSection("feed");
      }
      break;

    default:
      console.warn("Unknown action:", data.action);
  }
}

// Initialize the app when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  handleIncomingMessages();
});

console.log("Script loaded");
