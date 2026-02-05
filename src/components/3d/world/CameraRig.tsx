// world/CameraRig.tsx
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from './useKeyboardControls';

const WALK_SPEED = 0.18;
const SMOOTHING = 0.15;

export function CameraRig() {
  const { camera } = useThree();
  const keysRef = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  useFrame(() => {
    const keys = keysRef.current;
    dir.current.set(0, 0, 0);

    if (keys.forward) dir.current.z -= 1;
    if (keys.backward) dir.current.z += 1;
    if (keys.left) dir.current.x -= 1;
    if (keys.right) dir.current.x += 1;

    if (dir.current.lengthSq() > 0) {
      dir.current.normalize();
      dir.current.applyQuaternion(camera.quaternion);
      dir.current.y = 0;
    }

    const targetVel = dir.current.multiplyScalar(WALK_SPEED);
    velocity.current.lerp(targetVel, SMOOTHING);
    camera.position.add(velocity.current);
  });

  return null;
}
