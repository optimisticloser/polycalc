import type { FormulaMeta } from '@/lib/types/variable';

export const quadraticMeta: FormulaMeta = {
  id: 'quadratic',
  title: 'Quadratic Function',
  description: 'A parabola defined by the function y = ax² + bx + c',
  
  // Fórmula LaTeX com placeholders para variáveis
  template: 'y = {{a}}x^2 + {{b}}x + {{c}}',
  
  // Metadados das variáveis
  variables: {
    a: {
      id: 'a',
      symbol: 'a',
      label: 'a',
      name: 'Quadratic Coefficient',
      description: 'Controls the opening and direction of the parabola',
      contextualInfo: 'Positive values create upward-opening parabolas, negative values create downward-opening ones',
      min: -5,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The "a" coefficient determines how "wide" the parabola is and whether it opens upward or downward',
      aiHints: [
        'Try values between -2 and 2 to see different curvatures',
        'Values close to zero make the parabola more "open"',
        'Negative values make the parabola open downward'
      ]
    },
    b: {
      id: 'b',
      symbol: 'b',
      label: 'b',
      name: 'Linear Coefficient',
      description: 'Horizontally shifts the vertex of the parabola',
      contextualInfo: 'The value of "b" affects the position of the axis of symmetry',
      min: -5,
      max: 5,
      step: 0.1,
      defaultValue: 0,
      decimals: 2,
      editable: true,
      color: '#10b981',
      aiContext: 'The "b" coefficient influences where the parabola vertex is located horizontally',
      aiHints: [
        'Positive values move the vertex to the left',
        'Negative values move the vertex to the right',
        'Try combining with different values of "a"'
      ]
    },
    c: {
      id: 'c',
      symbol: 'c',
      label: 'c',
      name: 'Constant Term',
      description: 'Vertically shifts the parabola',
      contextualInfo: 'The value of "c" is where the parabola crosses the y-axis',
      min: -5,
      max: 5,
      step: 0.1,
      defaultValue: 0,
      decimals: 2,
      editable: true,
      color: '#f59e0b',
      aiContext: 'The "c" coefficient represents the y-intercept of the parabola',
      aiHints: [
        'Positive values move the parabola upward',
        'Negative values move the parabola downward',
        'When c = 0, the parabola passes through the origin'
      ]
    }
  },
  
  aiContext: 'The quadratic function is used to model phenomena such as projectile trajectories, optimization, and areas',
  aiScenarios: [
    {
      name: 'Two real roots',
      description: 'Parabola that crosses the x-axis at two points',
      values: { a: 1, b: 0, c: -4 }
    },
    {
      name: 'Vertex at origin',
      description: 'Parabola with vertex at the origin',
      values: { a: 1, b: 0, c: 0 }
    },
    {
      name: 'No real roots',
      description: 'Parabola that does not cross the x-axis',
      values: { a: 1, b: 0, c: 4 }
    }
  ]
};

export const predatorPreyMeta: FormulaMeta = {
  id: 'predator-prey',
  title: 'Predator-Prey Model (Lotka-Volterra)',
  description: 'Models the population dynamics between prey and predators',
  
  // Fórmula LaTeX com placeholders para variáveis
  template: '\\begin{cases} \\frac{dx}{dt} = {{\\alpha}}x - {{\\beta}}xy \\\\ \\frac{dy}{dt} = {{\\delta}}xy - {{\\gamma}}y \\end{cases}',
  
  // Metadados das variáveis
  variables: {
    alpha: {
      id: 'alpha',
      symbol: '\\alpha',
      label: 'α',
      name: 'Prey Growth Rate',
      description: 'Natural reproduction rate of prey in the absence of predators',
      contextualInfo: 'Determines how quickly the prey population grows',
      min: 0.1,
      max: 3,
      step: 0.05,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#3b82f6',
      aiContext: 'α represents the natural growth rate of prey when there are no predators',
      aiHints: [
        'Higher values make the prey population grow faster',
        'Values close to zero result in very slow growth',
        'This parameter affects the frequency of oscillations'
      ]
    },
    beta: {
      id: 'beta',
      symbol: '\\beta',
      label: 'β',
      name: 'Predation Rate',
      description: 'Rate at which prey are consumed by predators',
      contextualInfo: 'Controls the efficiency of predation',
      min: 0.1,
      max: 3,
      step: 0.05,
      defaultValue: 0.5,
      decimals: 2,
      editable: true,
      color: '#ef4444',
      aiContext: 'β represents the predation rate, affecting how predators reduce the prey population',
      aiHints: [
        'Higher values indicate more efficient predators',
        'Lower values indicate prey with better defenses',
        'This parameter affects the amplitude of oscillations'
      ]
    },
    gamma: {
      id: 'gamma',
      symbol: '\\gamma',
      label: 'γ',
      name: 'Predator Mortality Rate',
      description: 'Natural mortality rate of predators in the absence of prey',
      contextualInfo: 'Determines how quickly predators die without food',
      min: 0.1,
      max: 3,
      step: 0.05,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#10b981',
      aiContext: 'γ represents the natural mortality rate of predators',
      aiHints: [
        'Higher values indicate predators with shorter life expectancy',
        'Lower values indicate more resilient predators',
        'Affects the system equilibrium'
      ]
    },
    delta: {
      id: 'delta',
      symbol: '\\delta',
      label: 'δ',
      name: 'Conversion Efficiency',
      description: 'Efficiency with which predators convert prey into new predators',
      contextualInfo: 'Controls how many new predators emerge from each prey consumed',
      min: 0.1,
      max: 3,
      step: 0.05,
      defaultValue: 0.5,
      decimals: 2,
      editable: true,
      color: '#f59e0b',
      aiContext: 'δ represents the energy efficiency of the food chain',
      aiHints: [
        'Higher values indicate more efficient conversion of prey to predators',
        'Lower values indicate greater energy loss in the chain',
        'Influences the maximum size of the predator population'
      ]
    },
    x0: {
      id: 'x0',
      symbol: 'x_0',
      label: 'x₀',
      name: 'Initial Prey Population',
      description: 'Initial number of individuals in the prey population',
      contextualInfo: 'Initial condition for the simulation',
      min: 1,
      max: 10,
      step: 0.1,
      defaultValue: 5,
      decimals: 1,
      editable: true,
      color: '#8b5cf6',
      aiContext: 'x₀ is the initial prey population',
      aiHints: [
        'Higher values result in higher amplitude oscillations',
        'Very small values can lead to extinction',
        'Affects the initial position in phase space'
      ]
    },
    y0: {
      id: 'y0',
      symbol: 'y_0',
      label: 'y₀',
      name: 'Initial Predator Population',
      description: 'Initial number of individuals in the predator population',
      contextualInfo: 'Initial condition for the simulation',
      min: 1,
      max: 10,
      step: 0.1,
      defaultValue: 3,
      decimals: 1,
      editable: true,
      color: '#ec4899',
      aiContext: 'y₀ is the initial predator population',
      aiHints: [
        'Higher values can lead to prey extinction',
        'Very small values can lead to predator extinction',
        'Determines the starting point in the cycle'
      ]
    }
  },
  
  aiContext: 'The Lotka-Volterra model describes the dynamics of ecological systems with predator-prey interactions',
  aiScenarios: [
    {
      name: 'Stable Cycle',
      description: 'Balanced oscillations between prey and predators',
      values: { alpha: 1.1, beta: 0.6, gamma: 1.1, delta: 0.6, x0: 5, y0: 3 }
    },
    {
      name: 'Efficient Predators',
      description: 'Predators with high hunting efficiency',
      values: { alpha: 1, beta: 0.9, gamma: 0.8, delta: 0.7, x0: 5, y0: 3 }
    },
    {
      name: 'Prey Explosion',
      description: 'Rapid growth of the prey population',
      values: { alpha: 1.5, beta: 0.4, gamma: 1, delta: 0.5, x0: 8, y0: 2 }
    }
  ]
};

// Registro de metadados de fórmulas
export const formulaMetaRegistry: Record<string, FormulaMeta> = {
  quadratic: quadraticMeta,
  'predator-prey': predatorPreyMeta,
};

// Função para obter metadados de uma fórmula
export function getFormulaMeta(id: string): FormulaMeta | undefined {
  return formulaMetaRegistry[id];
}