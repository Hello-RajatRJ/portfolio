// ─── Hot Wheels Track & Ramp Physics ──────────────────────────────────────

export interface HotWheelsPhysicsResult {
  groundY: number;
  rampPitch: number;      // Chassis pitch angle to conform to ramp slope
  launchVelY: number;     // Upward impulse when launching off a ramp lip
  boostApplied: boolean;  // True on the frame a booster pad is activated
  boostSpeed: number;     // Extra forward speed to inject
  inAir: boolean;         // Whether the car is currently airborne
}

// Boost pad locations
export const BOOST_PADS = [
  { id: 'boost-stunt-ramp', x: 75, z: 4.0, radius: 2.6, boostSpeed: 20.0 },
  { id: 'boost-downtown-runway', x: 0, z: -18.0, radius: 2.4, boostSpeed: 15.0 },
  { id: 'boost-east-flyover',  x: 11, z: 10.5, radius: 2.2, boostSpeed: 13.0 },
  { id: 'boost-west-circuit',  x: -9, z: -6.0, radius: 2.2, boostSpeed: 13.0 },
];

// Cooldown tracking for booster pads
const boostCooldowns = new Map<string, number>();

/**
 * Evaluates the car's position against Hot Wheels ramps, elevated flyovers, and booster pads.
 */
export function checkHotWheelsTrack(
  posX: number,
  posZ: number,
  _speed: number,
  posY: number,
  vx: number,
  vz: number,
  dt: number
): HotWheelsPhysicsResult {
  let groundY = 0;
  let rampPitch = 0;
  let launchVelY = 0;
  let boostApplied = false;
  let boostSpeed = 0;

  // ── 1. BOOSTER PADS DETECTION ───────────────────────────────────────────
  for (const [id, time] of boostCooldowns.entries()) {
    if (time > 0) {
      boostCooldowns.set(id, Math.max(0, time - dt));
    }
  }

  for (const pad of BOOST_PADS) {
    const dx = posX - pad.x;
    const dz = posZ - pad.z;
    if (dx * dx + dz * dz < pad.radius * pad.radius) {
      const cd = boostCooldowns.get(pad.id) || 0;
      if (cd <= 0) {
        boostCooldowns.set(pad.id, 1.8); // 1.8s cooldown
        boostApplied = true;
        boostSpeed = pad.boostSpeed;
      }
      break;
    }
  }

  // ── 2. DOWNTOWN CENTRAL SPEEDWAY (x ≈ 0: Smooth Level Boulevard) ──────
  const rampWidth = 4.6;
  const isDowntownAvenue = Math.abs(posX) <= rampWidth / 2;
  if (isDowntownAvenue && posZ >= -40.0 && posZ <= 40.0) {
    groundY = 0.06;
  }

  // ── 3. OUTER STUNT ARENA MEGA LAUNCH RAMP & RING OF FIRE (x ≈ 75 beside Bowling) ──
  const isStuntRampX = Math.abs(posX - 75) <= rampWidth / 2;

  if (isStuntRampX) {
    // Flat Outer Runway approaching the launch (z: -18.0 -> 9.5)
    if (posZ >= -18.0 && posZ < 9.5) {
      groundY = 0.06;
    }
    // A. Launch Incline Ramp (z: 9.5 -> 14.0, height climbs from 0.06 -> 3.2m)
    else if (posZ >= 9.5 && posZ <= 14.0) {
      const progress = (posZ - 9.5) / 4.5;
      groundY = 0.06 + progress * (3.2 - 0.06);
      rampPitch = -0.58; // Nose up ~33 degrees

      // Launch off the lip at z = 14.0 moving south at speed
      if (posZ >= 13.5 && vz > 4.5 && Math.abs(posX - 75) <= 2.0 && posY <= groundY + 0.35) {
        const forwardSpeed = Math.sqrt(vx * vx + vz * vz);
        launchVelY = Math.min(8.5, forwardSpeed * 0.36);
      }
    }
    // B. Free-flight through the Ring of Fire (z: 14.0 -> 19.5)
    else if (posZ > 14.0 && posZ < 19.5) {
      groundY = 0; // In the air!
    }
    // C. Landing Catch Ramp (z: 19.5 -> 24.5, height drops 2.8m -> 0.06m)
    else if (posZ >= 19.5 && posZ <= 24.5) {
      const progress = (posZ - 19.5) / 5.0;
      groundY = 0.06 + (1 - progress) * (2.8 - 0.06);
      rampPitch = 0.45; // Nose down to absorb landing
    }
    // Exit Runway (z: 24.5 -> 38.0)
    else if (posZ > 24.5 && posZ <= 38.0) {
      groundY = 0.06;
    }
  }

  // ── 4. EAST ELEVATED FLYOVER HIGHWAY ───────────────────────────────────
  const isEastFlyoverX = Math.abs(posX - 11.0) <= 2.3;
  if (isEastFlyoverX) {
    // On-ramp climbing from south (z: 10.0 -> 6.0)
    if (posZ >= 6.0 && posZ <= 10.0) {
      const progress = (10.0 - posZ) / 4.0;
      groundY = progress * 2.8;
      rampPitch = vz < 0 ? -0.45 : 0.45;
    }
    // High elevated straight flyover (z: -6.0 -> 6.0)
    else if (posZ > -6.0 && posZ < 6.0) {
      groundY = 2.8;
      rampPitch = 0;
    }
    // Off-ramp descending to north (z: -10.0 -> -6.0)
    else if (posZ <= -6.0 && posZ >= -10.0) {
      const progress = (posZ - (-10.0)) / 4.0;
      groundY = progress * 2.8;
      rampPitch = vz > 0 ? -0.45 : 0.45;
    }
  }

  const inAir = posY > groundY + 0.35;

  return {
    groundY,
    rampPitch,
    launchVelY,
    boostApplied,
    boostSpeed,
    inAir,
  };
}
