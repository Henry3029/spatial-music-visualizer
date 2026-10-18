import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { VisualizerSystem } from './systems/visualizer-system.js';

// Initialize the IWSDK World container and register our custom system
World.create(document.getElementById('scene-container')!, projectOptions)
  .then((world) => {
    console.log('Spatial Music Visualizer initialized successfully!');
    
    // Register the visualizer system so the engine runs its init and update loops
    world.registerSystem(VisualizerSystem);
  })
  .catch((error) => {
    console.error('Failed to initialize IWSDK world:', error);
  });
