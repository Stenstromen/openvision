import * as tf from "@tensorflow/tfjs";
import localforage from "localforage";

tf.setBackend("cpu");

export const loadModel = async () => {
  const modelKey = "indexeddb://MobileNetV3Large-model";
  let model;

  try {
    model = await tf.loadGraphModel(modelKey);
  } catch (err) {
    const modelUrl = "./MobileNetV3Large/model.json";
    model = await tf.loadGraphModel(modelUrl);
    await model.save(modelKey);
  }

  return model;
};

export const getClassLabels = async () => {
  const LABELS_KEY = "class_labels";

  let labels = await localforage.getItem<string[]>(LABELS_KEY);

  if (!labels) {
    const res = await fetch("./imagenet-simple-labels.json");
    labels = await res.json();
    await localforage.setItem(LABELS_KEY, labels);
  }

  return labels;
};
