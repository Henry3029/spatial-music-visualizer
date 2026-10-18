/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';

// Initialize the IWSDK World container using the project manifest
World.create(document.getElementById('scene-container')!, projectOptions)
  .then((world) => {
    console.log('Spatial Music Visualizer initialized successfully!');
  })
  .catch((error) => {
    console.error('Failed to initialize IWSDK world:', error);
  });
