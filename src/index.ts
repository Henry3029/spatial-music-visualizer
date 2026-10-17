import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';

// Initialize the IWSDK World container
World.create(document.getElementById('scene-container')!, projectOptions).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");

  // Find the visualizer core node we defined in main.iwsdk.scene.json
  const visualizerEntity = world.getEntityById("visualizer-core");

  if (visualizerEntity) {
    console.log("Found visualizer core entity!");
    
    // Run the audio-reactive pulse animation loop
    let time = 0;
    world.renderer.setAnimationLoop((timestamp, frame) => {
      time += 0.016 * 3;
      const scale = 1 + Math.sin(time) * 0.18;
      
      // Update the entity's scale smoothly
      visualizerEntity.transform.scale.set(scale, scale, scale);
      visualizerEntity.transform.rotation.y += 0.005;
    });
  } else {
    console.warn("Could not find visualizer-core in the scene manifest.");
  }
}).catch((error) => {
  console.error("Failed to initialize IWSDK world:", error);
});
