import type { Vars } from '@/lib/state/store';
import QuadraticView from '@/modules/views/QuadraticView';
import ProjectileView from '@/modules/views/ProjectileView';

export type Preset = { id: string; title: string; vars: Vars };
export type FormulaDef = {
  id: string;
  title: string;
  defaults: Vars;
  presets: Preset[];
  view: () => JSX.Element;
};

export const registry: FormulaDef[] = [
  {
    id: 'quadratic',
    title: 'Quadratic (Parabola)',
    defaults: { a: 1, b: 0, c: 0 },
    presets: [
      { id:'two-roots', title:'Two roots', vars:{ a:1, b:0, c:-4 }},
      { id:'touches', title:'Touches axis', vars:{ a:1, b:-4, c:4 }},
      { id:'no-real', title:'No real roots', vars:{ a:1, b:0, c:4 }},
    ],
    view: QuadraticView,
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    defaults: { v0: 50, theta: 0.785, g: 9.81 },
    presets: [
      { id:'30deg', title:'30°', vars:{ theta: Math.PI/6 }},
      { id:'45deg', title:'45°', vars:{ theta: Math.PI/4 }},
      { id:'60deg', title:'60°', vars:{ theta: Math.PI/3 }},
    ],
    view: ProjectileView,
  },
];

export const ids = registry.map(r => r.id);
export function getFormula(id: string) {
  return registry.find(r => r.id === id) ?? registry[0];
}
