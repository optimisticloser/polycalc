import QuadraticView from '@/modules/views/QuadraticView';
import ProjectileView from '@/modules/views/ProjectileView';
import SineView from '@/modules/views/SineView';
import NormalView from '@/modules/views/NormalView';
import IdealGasView from '@/modules/views/IdealGasView';
import FourierView from '@/modules/views/FourierView';
import EulerView from '@/modules/views/EulerView';
import GravityView from '@/modules/views/GravityView';
import PredatorPreyView from '@/modules/views/PredatorPreyView';
import LogisticMapView from '@/modules/views/LogisticMapView';
import type { FormulaMeta } from '@/modules/registry-meta';
import { registryMeta, ids as metaIds } from '@/modules/registry-meta';

export type FormulaDef = FormulaMeta & { view: () => JSX.Element };

const viewMap: Record<string, () => JSX.Element> = {
  quadratic: QuadraticView,
  projectile: ProjectileView,
  sine: SineView,
  normal: NormalView,
  'ideal-gas': IdealGasView,
  'fourier-square': FourierView,
  'euler-complex': EulerView,
  gravity: GravityView,
  'predator-prey': PredatorPreyView,
  'logistic-map': LogisticMapView,
};

export const registry: FormulaDef[] = registryMeta.map((entry) => ({
  ...entry,
  view: viewMap[entry.id],
}));

export const ids = metaIds;

export function getFormula(id: string) {
  return registry.find((item) => item.id === id) ?? registry[0];
}
