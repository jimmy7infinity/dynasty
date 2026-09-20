export type MoveIntent = {
  x: number;
  z: number;
  active: boolean;
};

export function createIntent(): MoveIntent {
  return { x: 0, z: 0, active: false };
}

export function setIntent(intent: MoveIntent, x: number, z: number): void {
  intent.x = x;
  intent.z = z;
  intent.active = true;
}

export function stepToward(
  px: number,
  pz: number,
  intent: MoveIntent,
  speed: number,
  dt: number,
): { x: number; z: number } {
  if (!intent.active) {
    return { x: px, z: pz };
  }
  const dx = intent.x - px;
  const dz = intent.z - pz;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.6) {
    intent.active = false;
    return { x: intent.x, z: intent.z };
  }
  const step = Math.min(speed * dt, dist);
  return { x: px + (dx / dist) * step, z: pz + (dz / dist) * step };
}
