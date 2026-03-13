import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

let modelPromise;

const TARGET_SYNONYMS = {
  cat: ["cat", "kitten", "tabby", "persian cat", "siamese cat"],
  dog: ["dog", "puppy", "golden retriever", "labrador", "terrier", "poodle"],
  person: ["person", "man", "woman", "boy", "girl", "human", "face"],
  car: ["car", "automobile", "sedan", "cab", "taxi", "jeep", "van", "sports car"],
  bottle: ["bottle", "water bottle", "wine bottle"],
  cup: ["cup", "mug", "coffee", "espresso", "teacup"],
  chair: ["chair", "seat", "armchair", "recliner", "stool"],
};

async function getModel() {
  if (!modelPromise) {
    modelPromise = mobilenet.load();
  }
  return modelPromise;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for validation"));
    img.src = src;
  });
}

function getLowerCaseClass(prediction) {
  return (prediction?.className || "").toLowerCase();
}

export function doesPredictionMatchTarget(predictions, target) {
  const normalizedTarget = target.toLowerCase();
  const synonyms = TARGET_SYNONYMS[normalizedTarget] || [normalizedTarget];
  const lowerSynonyms = synonyms.map((s) => s.toLowerCase());

  return predictions.some((prediction) => {
    const className = getLowerCaseClass(prediction);
    // Check if any synonym word exists within the detected class name
    return lowerSynonyms.some((word) => className.includes(word));
  });
}

export async function classifyImageFile(file) {
  const model = await getModel();
  const objectUrl = URL.createObjectURL(file);

  try {
    const imageEl = await loadImageElement(objectUrl);
    // Get top 10 predictions to be more forgiving
    return await model.classify(imageEl, 10);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}