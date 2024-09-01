// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Main app function
function initApp() {
  console.log("initApp called");
  tg.ready();
  tg.expand();

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
  tg.sendData(JSON.stringify({ action: "profile" }));
  tg.onEvent("message", function (message) {
    console.log("Profile data received:", message);
    try {
      const profile = JSON.parse(message.data);
      document.getElementById("profile-content").innerHTML = `
        <h3>${profile.username}</h3>
        <p>${profile.bio}</p>
        <p>Favorite cryptocurrencies: ${profile.favorite_cryptocurrencies}</p>
      `;
    } catch (error) {
      console.error("Error parsing profile data:", error);
    }
  });
}

// Load feed
function loadFeed() {
  console.log("loadFeed called");
  tg.sendData(JSON.stringify({ action: "feed" }));
  tg.onEvent("message", function (message) {
    console.log("Feed data received:", message);
    try {
      const feed = JSON.parse(message.data);
      const feedHtml = feed
        .map(
          (item) => `
            <div class="post">
              <h3>${item.author}</h3>
              <p>${item.post.content}</p>
              <p>Tags: ${item.post.tags}</p>
              <p>Posted: ${new Date(item.post.created_at).toLocaleString()}</p>
            </div>
          `
        )
        .join("");
      document.getElementById("feed-content").innerHTML = feedHtml;
    } catch (error) {
      console.error("Error parsing feed data:", error);
    }
  });
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
    tg.sendData(
      JSON.stringify({ action: "post", content: content, tags: tags })
    );
    tg.onEvent("message", function (message) {
      console.log("Post creation response:", message);
      alert("Post created successfully!");
      showSection("feed");
    });
  };
}

// Initialize the app when the document is ready
document.addEventListener("DOMContentLoaded", initApp);
console.log("Script loaded");
