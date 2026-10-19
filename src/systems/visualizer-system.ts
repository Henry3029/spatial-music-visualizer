import { createSystem } from '@iwsdk/core';
import { BoxGeometry, Mesh, MeshStandardMaterial, Group } from 'three';
import { VisualizerCore } from '../components/visualizer-component.js';

export class VisualizerSystem extends createSystem({
  cores: { required: [VisualizerCore] },
}) {
  private visualizerGroups = new Map<any, Group>();
  private barsMap = new Map<any, Mesh[]>();
  private time = 0;

  init(): void {
    this.queries.cores.entities.forEach((entity) => {
      // 1. Get the existing object3D provided automatically by the scene JSON
      const parentObject = entity.object3D;
      if (!parentObject) return;

      // 2. Create your animation group and ADD it as a child (DO NOT OVERWRITE object3D)
      const visualizerGroup = new Group();
      parentObject.add(visualizerGroup);

      const bars: Mesh[] = [];
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
        
        visualizerGroup.add(bar);
        bars.push(bar);
      }

      // Add glowing center core
      const coreGeo = new BoxGeometry(0.25, 0.25, 0.25);
      const coreMat = new MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0x550022,
        roughness: 0.2,
        metalness: 0.8,
      });
      const centerCore = new Mesh(coreGeo, coreMat);
      visualizerGroup.add(centerCore);
      bars.push(centerCore);

      // Store references for the update loop
      this.visualizerGroups.set(entity, visualizerGroup);
      this.barsMap.set(entity, bars);
    });
  }

  update(delta: number): void {
    this.time += delta * 2.5;

    this.queries.cores.entities.forEach((entity) => {
      const visualizerGroup = this.visualizerGroups.get(entity);
      const bars = this.barsMap.get(entity);

      // Rotate the inner group safely
      if (visualizerGroup) {
        visualizerGroup.rotation.y += 0.005;
      }

      // Animate the pulsing bars
      if (bars) {
        bars.forEach((bar, index) => {
          if (index < bars.length - 1) {
            const wave = Math.sin(this.time + index * 0.7) * 0.4 + 0.6;
            bar.scale.y = Math.max(0.2, wave * 2);
          } else {
            const pulse = 1 + Math.sin(this.time * 2) * 0.2;
            bar.scale.set(pulse, pulse, pulse);
          }
        });
      }
    });
  }
}
