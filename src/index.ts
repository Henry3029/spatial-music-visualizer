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

// Initialize the IWSDK World container
World.create(document.getElementById('scene-container')!, projectOptions).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");

  // 1. Add scene lighting so the MeshStandardMaterial can be seen
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  world.scene.add(ambientLight);

  const dirLight = new DirectionalLight(0x00ffcc, 2.0);
  dirLight.position.set(1, 3, 2);
  world.scene.add(dirLight);

  // 2. Create the visualizer core mesh
  const geometry = new BoxGeometry(0.4, 0.4, 0.4);
  const material = new MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x003333,
    roughness: 0.2,
    metalness: 0.8
  });
  
  const coreMesh = new Mesh(geometry, material);

  // 3. Link the mesh to an ECS transform entity and position it at eye level
  const entity = world.createTransformEntity(coreMesh);
  entity.object3D!.position.set(0, 1.3, -1.5);

  // 4. Add interactive capabilities (hand grab & ray pointer)
  entity.addComponent(RayInteractable);
  entity.addComponent(OneHandGrabbable, {
    translate: true,
    rotate: true,
  });

  // 5. Run the audio-reactive pulse animation loop
  let time = 0;
  world.renderer.setAnimationLoop((timestamp, frame) => {
    time += 0.016 * 3;
    const scale = 1 + Math.sin(time) * 0.18;
    
    // Smoothly scale the mesh
    coreMesh.scale.set(scale, scale, scale);
    coreMesh.rotation.y += 0.005;
  });
}).catch((error) => {
  console.error("Failed to initialize IWSDK world:", error);
});
