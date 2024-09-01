// Initialize Telegram WebApp
const TWApp = window.Telegram.WebApp;

// Global variable to track the current action
let currentAction = null;

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

const userData =
  Telegram.WebApp && Object.keys(TWApp.initDataUnsafe).length > 0
    ? TWApp.initDataUnsafe
    : userDataPlaceholder;

document.getElementById("webview_data").innerHTML = JSON.stringify(
  userData,
  null,
  2
);

// Main app function
function initApp() {
  console.log("initApp called");
  TWApp.ready();
  TWApp.expand();

  // Set up navigation
  document.querySelector("nav").addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").substring(1);
      console.log("Navigation clicked:", sectionId);
      showSection(sectionId);
    }
  });

  // Initial load
  showSection("profile");
}

// Show specific section
function showSection(sectionId) {
  console.log("showSection called with:", sectionId);
  document.querySelectorAll("main > section").forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });

  // Update current action
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

// Load user profile
function loadProfile() {
  console.log("loadProfile called");
  TWApp.sendData(JSON.stringify({ action: "profile" }));
}

// Load feed
function loadFeed() {
  console.log("loadFeed called");
  TWApp.sendData(JSON.stringify({ action: "feed" }));
}

// Setup post form
function setupPostForm() {
  console.log("setupPostForm called");
  const form = document.getElementById("post-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    const tags = document.getElementById("post-tags").value;
    console.log("Sending post data:", content, tags);
    TWApp.sendData(
      JSON.stringify({ action: "post", content: content, tags: tags })
    );
  };
}

// Handle incoming messages
function handleIncomingMessages() {
  TWApp.onEvent("message", function (message) {
    console.log("Message received:", message);

    try {
      const data = JSON.parse(message.data);

      if (currentAction === "profile" && data.username) {
        document.getElementById("profile-content").innerHTML = `
          <h3>${data.username}</h3>
          <p>${data.bio}</p>
          <p>Favorite cryptocurrencies: ${data.favorite_cryptocurrencies}</p>
        `;
      } else if (currentAction === "feed" && Array.isArray(data)) {
        const feedHtml = data
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
      } else if (currentAction === "create-post" && data.action === "post") {
        alert("Post created successfully!");
        showSection("feed");
      }
    } catch (error) {
      console.error("Error parsing message data:", error);
    }
  });
}

// Initialize the app when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  handleIncomingMessages();
});
console.log("Script loaded");
