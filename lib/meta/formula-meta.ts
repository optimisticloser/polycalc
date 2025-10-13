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

export const sineMeta: FormulaMeta = {
  id: 'sine',
  title: 'Sine Wave',
  description: 'A sinusoidal wave function representing periodic oscillation',
  
  // Fórmula LaTeX com placeholders para variáveis
  template: 'x(t) = {{A}} cos({{omega}} · t + {{phi}})',
  
  // Metadados das variáveis
  variables: {
    A: {
      id: 'A',
      symbol: 'A',
      label: 'A',
      name: 'Amplitude',
      description: 'Maximum displacement from equilibrium',
      contextualInfo: 'Controls the height of the wave peaks and troughs',
      min: 0,
      max: 10,
      step: 0.1,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The amplitude determines the maximum value the wave can reach',
      aiHints: [
        'Higher values create taller waves',
        'When A = 0, the wave becomes a flat line',
        'Amplitude affects the volume in sound waves'
      ]
    },
    omega: {
      id: 'omega',
      symbol: '\\omega',
      label: 'ω',
      name: 'Angular Frequency',
      description: 'Rate of change of the phase of the sine wave',
      contextualInfo: 'Determines how many oscillations occur per unit time',
      min: 0.1,
      max: 10,
      step: 0.1,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#ef4444',
      aiContext: 'Angular frequency controls how quickly the wave oscillates',
      aiHints: [
        'Higher values create more oscillations in the same time period',
        'Related to frequency by: f = ω / (2π)',
        'Affects the pitch in sound waves'
      ]
    },
    phi: {
      id: 'phi',
      symbol: '\\phi',
      label: 'φ',
      name: 'Phase Shift',
      description: 'Horizontal shift of the wave',
      contextualInfo: 'Determines where the wave starts in its cycle',
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
      defaultValue: 0,
      decimals: 2,
      editable: true,
      color: '#10b981',
      aiContext: 'Phase shift moves the wave horizontally without changing its shape',
      aiHints: [
        'Positive values shift the wave to the left',
        'Negative values shift the wave to the right',
        'Phase is important in wave interference patterns'
      ]
    }
  },
  
  aiContext: 'Sine waves are fundamental in physics, describing oscillations, waves, and periodic phenomena',
  aiScenarios: [
    {
      name: 'Standard Wave',
      description: 'Basic sine wave with unit amplitude',
      values: { A: 1, omega: 1, phi: 0 }
    },
    {
      name: 'High Frequency',
      description: 'Rapid oscillations',
      values: { A: 1, omega: 5, phi: 0 }
    },
    {
      name: 'Large Amplitude',
      description: 'Tall wave peaks',
      values: { A: 5, omega: 1, phi: 0 }
    }
  ]
};

export const eulerMeta: FormulaMeta = {
  id: 'euler',
  title: 'Euler\'s Formula',
  description: 'The relationship between exponential and trigonometric functions',
  
  // Fórmula LaTeX com placeholders para variáveis
  template: 're^{{i}{theta}}',
  
  // Metadados das variáveis
  variables: {
    r: {
      id: 'r',
      symbol: 'r',
      label: 'r',
      name: 'Magnitude',
      description: 'Distance from origin in complex plane',
      contextualInfo: 'Controls the radius of the complex number',
      min: 0,
      max: 2,
      step: 0.05,
      defaultValue: 1,
      decimals: 2,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The magnitude represents the distance from the origin in the complex plane',
      aiHints: [
        'Larger values create longer vectors',
        'When r = 0, the complex number is at the origin',
        'Affects the size of the real and imaginary parts'
      ]
    },
    theta: {
      id: 'theta',
      symbol: '\\theta',
      label: 'θ',
      name: 'Angle',
      description: 'Angle from positive real axis',
      contextualInfo: 'Determines the direction of the complex number',
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
      defaultValue: 0,
      decimals: 2,
      editable: true,
      color: '#f59e0b',
      aiContext: 'The angle determines the direction of the complex number in the plane',
      aiHints: [
        'Positive angles rotate counter-clockwise',
        'θ = π/2 gives a purely imaginary number',
        'θ = π gives a negative real number'
      ]
    }
  },
  
  aiContext: 'Euler\'s formula connects exponential functions with trigonometry, forming the foundation of complex analysis',
  aiScenarios: [
    {
      name: 'Unit Circle',
      description: 'Points on the unit circle',
      values: { r: 1, theta: 0 }
    },
    {
      name: 'Pure Imaginary',
      description: 'Point on imaginary axis',
      values: { r: 1, theta: Math.PI/2 }
    },
    {
      name: 'Large Magnitude',
      description: 'Far from origin',
      values: { r: 1.5, theta: Math.PI/4 }
    }
  ]
};

// Registro de metadados de fórmulas
export const formulaMetaRegistry: Record<string, FormulaMeta> = {
  quadratic: quadraticMeta,
  'predator-prey': predatorPreyMeta,
  sine: sineMeta,
  euler: eulerMeta,
};

// Função para obter metadados de uma fórmula
export function getFormulaMeta(id: string): FormulaMeta | undefined {
  return formulaMetaRegistry[id];
}