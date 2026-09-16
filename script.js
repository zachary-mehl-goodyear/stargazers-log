const list = document.querySelector("#starred");
const status = document.querySelector("#status");
const errorMessage =
  "The starred repositories could not be loaded. Please try again later.";
const starredDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function setStatus(message) {
  status.textContent = message;
}

function isValidEvent(event) {
  return (
    event !== null &&
    typeof event === "object" &&
    typeof event.name === "string" &&
    event.name.trim().length > 0 &&
    typeof event.starred === "string" &&
    starredDatePattern.test(event.starred)
  );
}

async function loadStarredRepositories() {
  if (!list || !status) {
    return;
  }

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error("Request failed.");
    }

    const events = await response.json();

    if (!Array.isArray(events) || !events.every(isValidEvent)) {
      throw new Error("Invalid response data.");
    }

    list.replaceChildren();

    if (events.length === 0) {
      setStatus("No starred repositories found.");
      return;
    }

    const items = events.map((event) => {
      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      return item;
    });

    list.replaceChildren(...items);
    setStatus(
      `${events.length} starred ${
        events.length === 1 ? "repository" : "repositories"
      } loaded.`
    );
  } catch {
    list.replaceChildren();
    setStatus(errorMessage);
  } finally {
    list.setAttribute("aria-busy", "false");
  }
}

void loadStarredRepositories();
