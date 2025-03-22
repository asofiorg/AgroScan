const CACHE_NAME = "agroscan-v1";

const welcomeMessage = document.getElementById("welcomeMessage");
const installPrompt = document.getElementById("installPrompt");
const pwaPrompt = document.getElementById("pwaPrompt");
const iosPrompt = document.getElementById("iosPrompt");
const installButton = document.getElementById("installButton");
const networkStatus = document.getElementById("networkStatus");

const MODELS = {
  "cocoa-disease": {
    name: "Cocoa Disease Detection",
    path: "/cocoa-disease",
    files: ["model.json", "weights.bin", "metadata.json"],
  },
};

function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  networkStatus.dataset.status = isOnline ? "online" : "offline";
  networkStatus.querySelector(".network-text").textContent = isOnline
    ? "Online"
    : "Offline";

  networkStatus.style.transform = "scale(1.1)";
  setTimeout(() => {
    networkStatus.style.transform = "scale(1)";
  }, 200);
}

updateNetworkStatus();

window.addEventListener("online", () => {
  updateNetworkStatus();
  initializeModels();
});

window.addEventListener("offline", () => {
  updateNetworkStatus();
  initializeModels();
});

const isPWA =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone ||
  document.referrer.includes("android-app://");

welcomeMessage.style.display = "block";
if (isPWA) {
  installPrompt.style.display = "none";
}
initializeModels();

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  pwaPrompt.style.display = "block";
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  deferredPrompt = null;

  if (outcome === "accepted") {
    pwaPrompt.style.display = "none";
  }
});

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  pwaPrompt.style.display = "none";
  iosPrompt.style.display = "block";
} else {
  iosPrompt.style.display = "none";
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {})
      .catch(() => {});
  });
}

async function initializeModels() {
  const modelCards = document.querySelectorAll(".model-card");
  const isOnline = navigator.onLine;

  for (const card of modelCards) {
    const modelId = card.dataset.model;
    const model = MODELS[modelId];

    if (!model) continue;

    try {
      card.dataset.status = "loading";
      updateModelStatus(card, "loading", "Checking model status...");

      const cacheStatus = await checkModelCache(model);

      if (!cacheStatus.isComplete) {
        if (!isOnline) {
          throw new Error("Model not cached and offline");
        }
        updateModelStatus(card, "loading", "Downloading model...");
        await cacheModelFiles(model);
      } else if (isOnline) {
        updateModelStatus(card, "loading", "Checking for updates...");
        const hasUpdate = await checkForUpdates(model);
        if (hasUpdate) {
          updateModelStatus(card, "loading", "Updating model...");
          await cacheModelFiles(model);
        }
      }

      const modelFiles = await verifyModelFiles(model);
      if (!modelFiles.success) {
        throw new Error(modelFiles.error);
      }

      card.dataset.status = "ready";
      updateModelStatus(card, "ready", "Ready to use");

      const scanButton = card.querySelector(".scan-button");
      scanButton.disabled = false;

      scanButton.addEventListener("click", () => {
        window.location.href = `/scan.html?model=${modelId}`;
      });
    } catch (error) {
      console.error(`Error loading model ${modelId}:`, error);
      card.dataset.status = "error";
      updateModelStatus(
        card,
        "error",
        isOnline
          ? `Error loading model: ${error.message}`
          : "Model not available offline"
      );
    }
  }
}

function updateModelStatus(card, status, text) {
  const statusText = card.querySelector(".status-text");
  statusText.textContent = text;
}

async function checkModelCache(model) {
  const cache = await caches.open(`${CACHE_NAME}-ml`);
  const cachedUrls = await cache.keys();
  const modelUrls = [
    "/tf.js",
    ...model.files.map((file) => `${model.path}/${file}`),
  ];

  const missingFiles = [];
  const cachedFiles = [];

  for (const url of modelUrls) {
    const isCached = cachedUrls.some((cachedUrl) =>
      cachedUrl.url.endsWith(url)
    );
    if (isCached) {
      cachedFiles.push(url);
    } else {
      missingFiles.push(url);
    }
  }

  return {
    isComplete: missingFiles.length === 0,
    missingFiles,
    cachedFiles,
  };
}

async function checkForUpdates(model) {
  try {
    const metadataUrl = `${model.path}/metadata.json`;
    const cachedMetadata = await caches.match(metadataUrl);
    const networkMetadata = await fetch(metadataUrl);

    if (!networkMetadata.ok) {
      throw new Error("Failed to fetch metadata");
    }

    if (!cachedMetadata) {
      return true;
    }

    const cachedData = await cachedMetadata.json();
    const networkData = await networkMetadata.json();

    const cachedVersion = cachedData.version || cachedData.timestamp;
    const networkVersion = networkData.version || networkData.timestamp;

    return cachedVersion !== networkVersion;
  } catch (error) {
    console.warn("Error checking for updates:", error);
    return false;
  }
}

async function cacheModelFiles(model) {
  const cache = await caches.open(`${CACHE_NAME}-ml`);
  const modelUrls = [
    "/tf.js",
    ...model.files.map((file) => `${model.path}/${file}`),
  ];

  const oldCachedUrls = await cache.keys();
  await Promise.all(
    oldCachedUrls
      .filter((cachedUrl) =>
        modelUrls.some((url) => cachedUrl.url.endsWith(url))
      )
      .map((cachedUrl) => cache.delete(cachedUrl))
  );

  await Promise.all(
    modelUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const responseToCache = response.clone();
        await cache.put(url, responseToCache);
      } catch (error) {
        throw new Error(`Failed to cache ${url}: ${error.message}`);
      }
    })
  );
}

async function verifyModelFiles(model) {
  try {
    const files = [
      "/tf.js",
      ...model.files.map((file) => `${model.path}/${file}`),
    ];

    for (const file of files) {
      const response = await caches.match(file);
      if (!response) {
        return { success: false, error: `Missing file: ${file}` };
      }

      if (file.endsWith(".json")) {
        const text = await response.text();
        try {
          JSON.parse(text);
        } catch (e) {
          return { success: false, error: `Invalid JSON in ${file}` };
        }
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

document.getElementById("scanButton").addEventListener("click", () => {
  window.location.href = "scan.html";
});
