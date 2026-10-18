import { createSystem, RayInteractable, OneHandGrabbable } from '@iwsdk/core';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { VisualizerCore } from '../components/visualizer-component.js';

export class VisualizerSystem extends createSystem({
  cores: { required: [VisualizerCore] },
}) {
  private meshMap = new Map<any, Mesh>();
  private time = 0;

  init(): void {
    this.queries.cores.entities.forEach((entity) => {
      const geometry = new BoxGeometry(0.4, 0.4, 0.4);
      const material = new MeshStandardMaterial({ 
        color: 0x00ffcc, 
        emissive: 0x003333,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new Mesh(geometry, material);

      // Attach mesh directly to object3D
      entity.object3D = mesh;
      
      // Explicitly set starting position firmly in front of the camera
      entity.object3D.position.set(0, 1.3, -1.5);

      // Add interaction components
      entity.addComponent(RayInteractable);
      entity.addComponent(OneHandGrabbable, { translate: true, rotate: true });

      this.meshMap.set(entity, mesh);
    });
  }

  update(delta: number): void {
    this.time += delta * 3;
    const scale = 1 + Math.sin(this.time) * 0.18;

    this.queries.cores.entities.forEach((entity) => {
      const mesh = this.meshMap.get(entity);
      if (mesh) {
        // Pulsing animation
        mesh.scale.set(scale, scale, scale);
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;
      }
    });
  }
}
