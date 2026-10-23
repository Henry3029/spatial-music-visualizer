import { createSystem, type Entity } from '@iwsdk/core';
import { BoxGeometry, Mesh, MeshStandardMaterial, Group } from 'three';
import { VisualizerCore } from '../components/visualizer-component.js';

export class VisualizerSystem extends createSystem({
  cores: { required: [VisualizerCore] },
}) {
  private visualizerGroups = new Map<Entity, Group>();
  private barsMap = new Map<Entity, Mesh[]>();
  private time = 0;

  init(): void {
    // Safely subscribe using the official IWSDK ECS pattern from AGENTS.md
    this.cleanupFuncs.push(
      this.queries.cores.subscribe(
        'qualify',
        (entity) => this.setupVisualizer(entity),
        true, // true means catch up on entities already in the scene
      ),
      this.queries.cores.subscribe('disqualify', (entity) =>
        this.cleanupVisualizer(entity),
      ),
    );
  }

  private setupVisualizer(entity: Entity): void {
    const parentObject = entity.object3D;
    if (!parentObject || this.visualizerGroups.has(entity)) return;

    // Ensure it stays locked safely in world/local space
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
  }

  private cleanupVisualizer(entity: Entity): void {
    const group = this.visualizerGroups.get(entity);
    if (group) {
      group.clear();
      this.visualizerGroups.delete(entity);
      this.barsMap.delete(entity);
    }
  }

    update(delta: number): void {
    // We can keep the time tracker if needed, but skip updating the animations
    const safeDelta = (typeof delta === 'number' && !isNaN(delta)) ? Math.min(delta, 0.1) : 0.016;
    this.time = (isNaN(this.time) ? 0 : this.time) + (safeDelta * 2.5);

    for (const entity of this.queries.cores.entities) {
      const visualizerGroup = this.visualizerGroups.get(entity);
      const bars = this.barsMap.get(entity);

      // 1. STABILIZE ROTATION: Commented out so the group stays completely still
      if (visualizerGroup) {
        // visualizerGroup.rotation.y += 0.005; 
      }

      // 2. STABILIZE BARS & CORE: Locked to a clean, default scale of 1
      if (bars) {
        bars.forEach((bar, index) => {
          if (index < bars.length - 1) {
            // Lock standard bars to a flat, stable height
            bar.scale.set(1, 1, 1);
          } else {
            // Lock the center core to a stable size
            bar.scale.set(1, 1, 1);
          }
        });
      }
    }
  }
}
