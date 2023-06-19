import * as tf from '@tensorflow/tfjs';
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

export const loadImageNetLabels = async (): Promise<string[] | null> => {
  try {
    const response = await axios.get('./imagenet_labels.txt');
    const labels = response.data.split('\n');
    return labels;
  } catch (error) {
    console.error('Unable to load labels:', error);
    return null;
  }
};

export const loadModel = async () => {
  const model_url = "./MobileNetV3Large/model.json";

  const model = await tf.loadGraphModel(model_url);

  return model;
};

export const getClassLabels = async () => {
  const res = await fetch(
    "./imagenet-simple-labels.json"
  );

  const data = await res.json();

  return data;
};


