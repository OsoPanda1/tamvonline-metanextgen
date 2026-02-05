// world/WorldHUD.tsx
import { Html } from '@react-three/drei';

export function WorldHUD() {
  return (
    <Html fullscreen pointerEvents="none">
      <div className="absolute top-4 left-4 space-y-1 text-xs text-slate-100">
        <p className="font-semibold tracking-wide">
          TAMV MD‑X4 · Metaverso Latinoamericano
        </p>
        <p className="opacity-80">
          Controles: WASD / Flechas para moverte, arrastra con el ratón para orbitar.
        </p>
        <p className="opacity-60">
          Próximamente: HUD de ISABELLA AI (estado emocional, eventos federados, economía 75/25).
        </p>
      </div>
    </Html>
  );
}
