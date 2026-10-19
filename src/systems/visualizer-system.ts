import { createSystem } from '@iwsdk/core';
import { BoxGeometry, Mesh, MeshStandardMaterial, Group } from 'three';
import { VisualizerCore } from '../components/visualizer-component.js';

export class VisualizerSystem extends createSystem({
  cores: { required: [VisualizerCore] },
}) {
  private rootGroup = new Group();
  private visualizerGroup = new Group();
  private bars: Mesh[] = [];
  private time = 0;

  init(): void {
    this.queries.cores.entities.forEach((entity) => {
      // 1. Attach the Root Container to the ECS entity (This is what gets grabbed)
      entity.object3D = this.rootGroup;
      entity.object3D.position.set(0, 1.3, -1.8);

      // 2. Nest the animated visualizer matrix inside the root container
      this.rootGroup.add(this.visualizerGroup);

      // Create a circular spatial matrix of 8 neon nodes
      const count = 8;
      const radius = 0.7;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const geometry = new BoxGeometry(0.12, 0.5, 0.12);
        
        const material = new MeshStandardMaterial({
          color: 0x00ffcc,
          emissive: 0x004444,
          roughness: 0.1,
          metalness: 0.9,
        });

        const bar = new Mesh(geometry, material);
        bar.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        
        this.visualizerGroup.add(bar);
        this.bars.push(bar);
      }

      // Add a glowing center core object
      const coreGeo = new BoxGeometry(0.25, 0.25, 0.25);
      const coreMat = new MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0x550022,
        roughness: 0.2,
        metalness: 0.8,
      });
      const centerCore = new Mesh(coreGeo, coreMat);
      this.visualizerGroup.add(centerCore);
      this.bars.push(centerCore);
    });
  }

  update(delta: number): void {
    this.time += delta * 2.5;

    // Rotate the inner visualizer matrix smoothly
    this.visualizerGroup.rotation.y += 0.005;

    // Animate local scales (pulsing effect) without touching root position
    this.bars.forEach((bar, index) => {
      if (index < this.bars.length - 1) {
        const wave = Math.sin(this.time + index * 0.7) * 0.4 + 0.6;
        bar.scale.y = Math.max(0.2, wave * 2);
      } else {
        const pulse = 1 + Math.sin(this.time * 2) * 0.2;
        bar.scale.set(pulse, pulse, pulse);
      }
    });
  }
}
