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

  // 1. Add scene lighting so materials render brightly
  const ambientLight = new AmbientLight(0xffffff, 1.2);
  world.scene.add(ambientLight);

  const dirLight = new DirectionalLight(0x00ffcc, 2.5);
  dirLight.position.set(1, 3, 2);
  world.scene.add(dirLight);

  // 2. Create the visualizer core mesh (Neon Cyan Box)
  const geometry = new BoxGeometry(0.4, 0.4, 0.4);
  const material = new MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x003333,
    roughness: 0.2,
    metalness: 0.8
  });
  
  const coreMesh = new Mesh(geometry, material);

  // 3. Link mesh to an ECS transform entity and position it at eye level in front of user
  const entity = world.createTransformEntity(coreMesh);
  entity.object3D!.position.set(0, 1.3, -1.5);

  // 4. Add interaction components (Grabbing and Ray Pointers)
  entity.addComponent(RayInteractable);
  entity.addComponent(OneHandGrabbable, {
    translate: true,
    rotate: true,
  });

  // 5. Run the animation loop for pulsing and rotation
  let time = 0;
  world.renderer.setAnimationLoop((timestamp, frame) => {
    time += 0.016 * 3;
    const scale = 1 + Math.sin(time) * 0.18;
    
    // Smoothly scale and rotate the visualizer core
    coreMesh.scale.set(scale, scale, scale);
    coreMesh.rotation.y += 0.005;
    coreMesh.rotation.x += 0.002;
  });

}).catch((error) => {
  console.error("Failed to initialize IWSDK world:", error);
});
