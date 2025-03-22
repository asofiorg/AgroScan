const cameraElement = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const analyzeButton = document.getElementById('analyzeButton');
const backButton = document.getElementById('backButton');
const switchCameraButton = document.getElementById('switchCamera');
const networkStatus = document.getElementById('networkStatus');
const loadingIndicator = document.getElementById('loadingIndicator');
const loadingProgress = loadingIndicator.querySelector('.loading-progress');
const resultsPanel = document.getElementById('resultsPanel');
const resultsList = document.getElementById('resultsList');
const closeResults = document.getElementById('closeResults');

let currentStream = null;
let facingMode = 'environment'; 
let model = null;
let modelId = null;

// Constants for model configuration
const MODEL_CONFIG = {
  inputSize: [224, 224],
  meanRGB: [127.5, 127.5, 127.5],
  stdRGB: [127.5, 127.5, 127.5]
};

const urlParams = new URLSearchParams(window.location.search);
modelId = urlParams.get('model') || 'cocoa-disease';

function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  networkStatus.dataset.status = isOnline ? 'online' : 'offline';
  networkStatus.querySelector('.network-text').textContent = isOnline ? 'Online' : 'Offline';
  
  networkStatus.style.transform = 'scale(1.1)';
  setTimeout(() => {
    networkStatus.style.transform = 'scale(1)';
  }, 200);
}

updateNetworkStatus();

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Preprocess image tensor
function preprocessImage(imageTensor) {
  // Normalize to [-1, 1]
  const normalized = imageTensor.sub(tf.tensor1d(MODEL_CONFIG.meanRGB))
                               .div(tf.tensor1d(MODEL_CONFIG.stdRGB));
  return normalized;
}

async function loadTensorFlow() {
  try {
    // Check if TF is already loaded
    if (window.tf) {
      console.log('TensorFlow.js already loaded');
      return;
    }

    console.log('Loading TensorFlow.js from cache...');
    const response = await fetch('/tf.js');
    if (!response.ok) {
      throw new Error(`Failed to fetch TensorFlow.js: ${response.status}`);
    }

    const tfContent = await response.text();
    const tfScript = document.createElement('script');
    tfScript.text = tfContent;
    document.head.appendChild(tfScript);

    // Wait for TF to be available
    await new Promise((resolve, reject) => {
      const maxAttempts = 50; // 5 seconds
      let attempts = 0;
      
      const checkTf = () => {
        attempts++;
        console.log(`Checking for TF (attempt ${attempts})...`);
        
        if (window.tf) {
          console.log('TensorFlow.js is available');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout waiting for TensorFlow.js to load'));
        } else {
          setTimeout(checkTf, 100);
        }
      };
      
      checkTf();
    });

  } catch (error) {
    console.error('Error loading TensorFlow.js:', error);
    throw error;
  }
}

// Show/hide loading indicator
function setLoading(isLoading, progress = 0) {
  if (isLoading) {
    loadingIndicator.classList.remove('hidden');
    loadingProgress.textContent = `${Math.round(progress * 100)}%`;
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Load model from cache
async function loadModel() {
  try {
    console.log('Starting model loading process...');
    setLoading(true, 0);
    await loadTensorFlow();
    console.log('TensorFlow.js loaded successfully');
    setLoading(true, 0.3);

    const modelPath = `/${modelId}`;
    console.log('Loading model from:', modelPath);

    // First verify model files are in cache
    const cache = await caches.open('agroscan-v1-ml');
    const modelFiles = ['model.json', 'weights.bin', 'metadata.json'];
    
    for (const file of modelFiles) {
      const response = await cache.match(`${modelPath}/${file}`);
      if (!response) {
        throw new Error(`Model file not found in cache: ${file}`);
      }
      console.log(`Found ${file} in cache`);
    }
    setLoading(true, 0.5);

    // Load the model
    model = await tf.loadLayersModel(`${modelPath}/model.json`, {
      onProgress: (fraction) => {
        console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
        setLoading(true, 0.5 + fraction * 0.4);
      }
    });

    // Warm up the model
    console.log('Warming up model...');
    setLoading(true, 0.9);
    const dummyInput = tf.zeros([1, ...MODEL_CONFIG.inputSize, 3]);
    await model.predict(dummyInput).data();
    dummyInput.dispose();
    
    console.log('Model loaded and warmed up successfully');
    setLoading(false);
    analyzeButton.disabled = false;
  } catch (error) {
    console.error('Error loading model:', error);
    setLoading(false);
    throw error;
  }
}

// Initialize camera
async function initCamera() {
  try {
    console.log('Initializing camera...');
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: {
        facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };

    console.log('Requesting camera access...');
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;
    
    // Set srcObject and play
    cameraElement.srcObject = stream;
    
    // Wait for video to be ready
    await new Promise((resolve) => {
      cameraElement.onloadedmetadata = () => {
        console.log('Camera metadata loaded');
        resolve();
      };
    });
    
    // Start playing
    await cameraElement.play();
    console.log('Camera initialized successfully');
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error(`Camera access failed: ${error.message}`);
  }
}

// Switch camera
async function switchCamera() {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await initCamera();
}

// Analyze image
async function analyzeImage() {
  if (!model) {
    alert('Model not loaded. Please wait or refresh the page.');
    return;
  }

  analyzeButton.disabled = true;
  let tensors = [];

  try {
    // Show loading
    setLoading(true, 0);

    // Capture frame and convert to tensor
    const videoFrame = tf.browser.fromPixels(cameraElement);
    tensors.push(videoFrame);

    // Resize to model input size
    const resized = tf.image.resizeBilinear(videoFrame, MODEL_CONFIG.inputSize);
    tensors.push(resized);

    // Add batch dimension and normalize
    const batched = tf.expandDims(resized);
    tensors.push(batched);
    
    const normalized = preprocessImage(batched);
    tensors.push(normalized);

    // Run inference
    setLoading(true, 0.5);
    const predictions = await model.predict(normalized).data();
    
    // Get metadata for class names
    const cache = await caches.open('agroscan-v1-ml');
    const metadataResponse = await cache.match(`/${modelId}/metadata.json`);
    if (!metadataResponse) {
      throw new Error('Model metadata not found in cache');
    }
    
    const metadata = await metadataResponse.json();
    
    // Get the top 3 predictions
    const topK = 3;
    const topPredictions = Array.from(predictions)
      .map((prob, i) => ({
        className: metadata.labels[i],
        probability: prob
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, topK);

    // Clear previous results
    resultsList.innerHTML = '';

    // Add results to panel
    topPredictions.forEach((pred, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.dataset.rank = index + 1;
      resultItem.innerHTML = `
        <span class="result-name">${pred.className}</span>
        <span class="result-probability">${(pred.probability * 100).toFixed(1)}%</span>
      `;
      resultsList.appendChild(resultItem);
    });

    // Hide loading and show results
    setLoading(false);
    resultsPanel.classList.remove('hidden');

    // Pause video but keep stream
    cameraElement.pause();

  } catch (error) {
    console.error('Error analyzing image:', error);
    alert('Error analyzing image. Please try again.');
    // Make sure video is playing
    if (cameraElement.paused) {
      await cameraElement.play();
    }
  } finally {
    // Cleanup tensors
    tensors.forEach(tensor => tensor.dispose());
    analyzeButton.disabled = false;
  }
}

// Close results and restart camera
async function closeResultsAndRestartCamera() {
  resultsPanel.classList.add('hidden');
  await cameraElement.play();
}

// Event Listeners
backButton.addEventListener('click', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  window.location.href = 'index.html';
});

switchCameraButton.addEventListener('click', switchCamera);
analyzeButton.addEventListener('click', analyzeImage);
closeResults.addEventListener('click', closeResultsAndRestartCamera);

// Initialize camera and load model on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Starting initialization...');
    analyzeButton.disabled = true;
    
    // Initialize camera and load model in parallel
    const [cameraResult, modelResult] = await Promise.allSettled([
      initCamera(),
      loadModel()
    ]);

    // Check for errors
    if (cameraResult.status === 'rejected') {
      throw new Error(`Camera initialization failed: ${cameraResult.reason}`);
    }
    if (modelResult.status === 'rejected') {
      throw new Error(`Model loading failed: ${modelResult.reason}`);
    }

    console.log('Initialization complete!');
  } catch (error) {
    console.error('Initialization error:', error);
    alert(`Error: ${error.message}\nPlease make sure you have granted camera permissions and are online for the first use.`);
  }
}); 