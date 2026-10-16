import { 
  World, 
  SessionMode, 
  BoxGeometry, 
  Mesh, 
  MeshStandardMaterial, 
  RayInteractable, 
  OneHandGrabbable 
} from '@iwsdk/core';

// Initialize the IWSDK World container
World.create(document.getElementById('scene-container')!, {
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    features: {
      handTracking: true,
    },
  },
  features: {
    grabbing: {
      useHandPinchForGrab: true,
    },
    locomotion: false, // Seated-optimized: no locomotion needed
  },
  input: {
    canvasPointerEvents: true,
  },
}).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");

  // 1. Create an audio-reactive core object floating in front of the user (Seated 2-foot radius)
  const visualizerCoreGeometry = new BoxGeometry(0.3, 0.3, 0.3);
  const visualizerCoreMaterial = new MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x004444,
    roughness: 0.2 
  });
  
  const coreMesh = new Mesh(visualizerCoreGeometry, visualizerCoreMaterial);
  coreMesh.position.set(0, 1.2, -0.6); // Placed right at eye-level within comfortable reach

  // 2. Register it as an ECS entity with interaction & grab capabilities
  world.createTransformEntity(coreMesh)
    .addComponent(RayInteractable)
    .addComponent(OneHandGrabbable, {
      translate: true,
      rotate: true,
    });

// 3. Add a simple pulse animation loop simulating audio reactivity
  let time = 0;
  
  // Use Three.js / animation loop frame listener or entity component update
  world.renderer.setAnimationLoop((timestamp, frame) => {
    // Delta time calculation or fixed increment
    time += 0.016 * 3; // roughly 60fps delta
    const scale = 1 + Math.sin(time) * 0.15;
    coreMesh.scale.set(scale, scale, scale);
  });
});