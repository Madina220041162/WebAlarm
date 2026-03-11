import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

let modelPromise;

const TARGET_SYNONYMS = {
  cat: ["cat", "kitten", "tabby"],
  dog: ["dog", "puppy"],
  person: ["person", "man", "woman", "boy", "girl", "human"],
  car: ["car", "automobile", "sedan", "cab", "taxi", "jeep", "van"],
  bottle: ["bottle", "water bottle"],
  cup: ["cup", "mug", "coffee", "espresso"],
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
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for validation"));
    img.src = src;
  });
}

function getLowerCaseClass(prediction) {
  return (prediction?.className || "").toLowerCase();
}

export function doesPredictionMatchTarget(predictions, target) {
  const synonyms = TARGET_SYNONYMS[target] || [target];
  const lowerSynonyms = synonyms.map((s) => s.toLowerCase());

  return predictions.some((prediction) => {
    const className = getLowerCaseClass(prediction);
    return lowerSynonyms.some((word) => className.includes(word));
  });
}

export async function classifyImageFile(file) {
  const model = await getModel();
  const objectUrl = URL.createObjectURL(file);

  try {
    const imageEl = await loadImageElement(objectUrl);
    return await model.classify(imageEl, 5);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
