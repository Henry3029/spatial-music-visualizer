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
      const parentObject = entity.object3D;
      if (!parentObject) return;

      // Force lock starting position safely
      parentObject.position.set(0, 1.3, -1.5);

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

      // Center glowing core
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

      this.visualizerGroups.set(entity, visualizerGroup);
      this.barsMap.set(entity, bars);
    });
  }

  update(delta: number): void {
    // 1. Sanitize delta: Default to 0.016 (60fps) if delta is missing or NaN
    const safeDelta = (typeof delta === 'number' && !isNaN(delta)) ? Math.min(delta, 0.1) : 0.016;
    
    // 2. Safely increment time with strict NaN protection
    this.time = (isNaN(this.time) ? 0 : this.time) + (safeDelta * 2.5);

    this.queries.cores.entities.forEach((entity) => {
      const visualizerGroup = this.visualizerGroups.get(entity);
      const bars = this.barsMap.get(entity);

      if (visualizerGroup) {
        visualizerGroup.rotation.y += 0.005;
      }

      if (bars) {
        bars.forEach((bar, index) => {
          if (index < bars.length - 1) {
            const wave = Math.sin(this.time + index * 0.7) * 0.4 + 0.6;
            const safeScale = isNaN(wave) ? 1 : Math.max(0.2, wave * 2);
            bar.scale.set(1, safeScale, 1);
          } else {
            const pulse = 1 + Math.sin(this.time * 2) * 0.2;
            const safePulse = isNaN(pulse) ? 1 : Math.max(0.2, pulse);
            bar.scale.set(safePulse, safePulse, safePulse);
          }
        });
      }
    });
  }
}
