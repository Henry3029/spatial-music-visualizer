import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';

// Initialize the IWSDK World container safely
World.create(document.getElementById('scene-container')!, projectOptions).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");
}).catch((error) => {
  console.error("Failed to initialize IWSDK world:", error);
});
