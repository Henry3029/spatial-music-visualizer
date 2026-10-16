import { 
  World, 
  SessionMode, 
  BoxGeometry, 
  Mesh, 
  MeshStandardMaterial, 
  RayInteractable, 
  OneHandGrabbable,
  AmbientLight,
  DirectionalLight
} from '@iwsdk/core';

World.create(document.getElementById('scene-container')!, {
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    features: { handTracking: true },
  },
  features: {
    grabbing: { useHandPinchForGrab: true },
    locomotion: false,
  },
  input: { canvasPointerEvents: true },
}).then((world) => {
  console.log("Spatial Music Visualizer initialized successfully!");

  // Add lights so MeshStandardMaterial is visible!
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  world.scene.add(ambientLight);

  const visualizerCoreGeometry = new BoxGeometry(0.3, 0.3, 0.3);
  const visualizerCoreMaterial = new MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x004444,
    roughness: 0.2 
  });
  
  const coreMesh = new Mesh(visualizerCoreGeometry, visualizerCoreMaterial);
  coreMesh.position.set(0, 1.2, -0.6);
  world.scene.add(coreMesh);

  world.createTransformEntity(coreMesh)
    .addComponent(RayInteractable)
    .addComponent(OneHandGrabbable, { translate: true, rotate: true });

  let time = 0;
  world.renderer.setAnimationLoop((timestamp, frame) => {
    time += 0.016 * 3;
    const scale = 1 + Math.sin(time) * 0.15;
    coreMesh.scale.set(scale, scale, scale);
  });
});