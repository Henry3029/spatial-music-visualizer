import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';

// Import your system so the engine executes it on startup
import './systems/visualizer-system.js';

// Initialize the IWSDK World container
World.create(document.getElementById('scene-container')!, projectOptions)
  .then((world) => {
    console.log('Spatial Music Visualizer initialized successfully!');
  })
  .catch((error) => {
    console.error('Failed to initialize IWSDK world:', error);
  });
