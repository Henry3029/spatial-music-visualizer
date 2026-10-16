import { 
  World, 
  BoxGeometry, 
  Mesh, 
  MeshStandardMaterial, 
  RayInteractable, 
  OneHandGrabbable,
  AmbientLight,
  DirectionalLight
} from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';

// Initialize the IWSDK World container with project manifest options
World.create(document.getElementById('scene-container')!, projectOptions).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");

  // 1. Add Scene Lighting (Required for MeshStandardMaterial to render)
  const ambientLight = new AmbientLight(0xffffff, 1.2);
  world.scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0x00ffcc, 2.0);
  directionalLight.position.set(1, 2, 1);
  world.scene.add(directionalLight);

  // 2. Create the Audio-Reactive Visualizer Core (Seated 2-foot radius in front of user)
  const geometry = new BoxGeometry(0.35, 0.35, 0.35);
  const material = new MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x004444,
    roughness: 0.1,
    metalness: 0.8
  });
  
  const coreMesh = new Mesh(geometry, material);
  coreMesh.position.set(0, 1.2, -0.6); // Eye-level, comfortable seated reach
  world.scene.add(coreMesh);

  // 3. Register hand-tracking and grab capabilities
  world.createTransformEntity(coreMesh)
    .addComponent(RayInteractable)
    .addComponent(OneHandGrabbable, {
      translate: true,
      rotate: true,
    });

  // 4. Run the audio-reactive pulse animation loop
  let time = 0;
  world.renderer.setAnimationLoop((timestamp, frame) => {
    time += 0.016 * 3;
    const scale = 1 + Math.sin(time) * 0.18;
    coreMesh.scale.set(scale, scale, scale);
    coreMesh.rotation.y += 0.005;
  });
}).catch((error) => {
  console.error("Failed to initialize IWSDK world:", error);
});