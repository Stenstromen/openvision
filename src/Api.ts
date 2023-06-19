import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';
tf.setBackend('cpu');

export const submitFile = async (file: File) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        Authorization: import.meta.env.VITE_API_KEY,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/predict`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
};

let model: mobilenet.MobileNet;
let labels: string[];

export const loadImageNetLabels = async () => {
  try {
    const response = await axios.get('./imagenet_labels.txt');
    labels = response.data.split('\n');
  } catch (error) {
    console.error('Unable to load labels:', error);
  }
};

export const loadModel = async () => {
  model = await mobilenet.load(); // Load MobileNet model
};

// Call these at app startup
//loadModel();
//loadImageNetLabels();

const imageToHTMLImageElement = (inp: ImageData) => new Promise<HTMLImageElement>((resolve, reject) => {
  const canvas = document.createElement('canvas');
  canvas.width = inp.width;
  canvas.height = inp.height;
  const ctx = canvas.getContext('2d');
  ctx?.putImageData(inp, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = dataUrl;
});

export const classifyImage = async (inp: HTMLImageElement) => {
  // inp is an HTMLImageElement

  // Make a prediction through the model on our image.
  const output = await model.classify(inp);

  const confidences: {[label: string]: number} = {};

  // TensorFlow.js MobileNet model's classify function returns an array of objects,
  // each with a className and probability.
  for (let i = 0; i < output.length; i++) {
    confidences[output[i].className] = output[i].probability;
  }

  // Sort by confidence, highest confidence first
  const sortedConfidences: {[label: string]: number} = {};
  Object.keys(confidences).sort((a, b) => confidences[b] - confidences[a]).forEach((key) => {
    sortedConfidences[key] = confidences[key];
  });

  console.log(sortedConfidences);

  return sortedConfidences;
};