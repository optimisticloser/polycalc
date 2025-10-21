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

export const projectileMeta: FormulaMeta = {
  id: 'projectile',
  title: 'Projectile Motion',
  description: 'Motion of an object under the influence of gravity',
  
  template: 'x(t) = {{v0}} cos({{theta}}) t, y(t) = {{v0}} sin({{theta}}) t - ½ {{g}} t²',
  
  variables: {
    v0: {
      id: 'v0',
      symbol: 'v_0',
      label: 'v₀',
      name: 'Initial Velocity',
      description: 'Speed at which the projectile is launched',
      contextualInfo: 'Higher values result in longer trajectories',
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 20,
      decimals: 1,
      editable: true,
      color: '#3b82f6',
      aiContext: 'Initial velocity determines how far and how high the projectile will travel',
      aiHints: [
        'Doubling v0 roughly quadruples the range',
        'v0 affects both horizontal distance and maximum height',
        'Real projectiles have air resistance that reduces effective range'
      ]
    },
    theta: {
      id: 'theta',
      symbol: '\\theta',
      label: 'θ',
      name: 'Launch Angle',
      description: 'Angle above the horizontal at which the projectile is launched',
      contextualInfo: '45° gives maximum range in ideal conditions',
      min: 0,
      max: 90,
      step: 1,
      defaultValue: 45,
      decimals: 0,
      editable: true,
      color: '#ef4444',
      format: 'angle',
      aiContext: 'Launch angle affects the shape of the trajectory - low angles give flat trajectories, high angles give tall trajectories',
      aiHints: [
        '45° gives the maximum range in a vacuum',
        '30° and 60° give the same range but different maximum heights',
        'Small angles are useful for horizontal distance, large angles for height'
      ]
    },
    g: {
      id: 'g',
      symbol: 'g',
      label: 'g',
      name: 'Gravity',
      description: 'Acceleration due to gravity',
      contextualInfo: 'Earth gravity is approximately 9.8 m/s²',
      min: 1,
      max: 20,
      step: 0.1,
      defaultValue: 9.8,
      decimals: 1,
      editable: true,
      color: '#10b981',
      aiContext: 'Gravity pulls the projectile downward, creating the parabolic trajectory',
      aiHints: [
        'Lower gravity (like on the Moon) results in much longer trajectories',
        'Higher gravity (like on Jupiter) makes trajectories much shorter',
        'Gravity only affects vertical motion, not horizontal'
      ]
    }
  },
  
  aiContext: 'Projectile motion follows a parabolic path due to constant gravitational acceleration',
  aiScenarios: [
    {
      name: 'Maximum Range',
      description: 'Optimal angle for maximum distance',
      values: { v0: 20, theta: 45, g: 9.8 }
    },
    {
      name: 'High Arc',
      description: 'Tall trajectory with less horizontal distance',
      values: { v0: 20, theta: 75, g: 9.8 }
    },
    {
      name: 'Low Gravity',
      description: 'Trajectory on the Moon',
      values: { v0: 20, theta: 45, g: 1.6 }
    }
  ]
};

export const normalMeta: FormulaMeta = {
  id: 'normal',
  title: 'Normal Distribution',
  description: 'The bell curve that describes many natural phenomena',
  
  template: 'f(x) = 1/({{sigma}} √(2π)) e^(-(x-{{mu}})²/(2{{sigma}}²))',
  
  variables: {
    mu: {
      id: 'mu',
      symbol: '\\mu',
      label: 'μ',
      name: 'Mean',
      description: 'The center of the distribution',
      contextualInfo: 'Shifts the entire curve left or right',
      min: -10,
      max: 10,
      step: 0.1,
      defaultValue: 0,
      decimals: 1,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The mean determines the center of the distribution, where the peak is located',
      aiHints: [
        '68% of values fall within one standard deviation of the mean',
        'The mean is the average value in the distribution',
        'In a normal distribution, mean = median = mode'
      ]
    },
    sigma: {
      id: 'sigma',
      symbol: '\\sigma',
      label: 'σ',
      name: 'Standard Deviation',
      description: 'Measure of spread or variability',
      contextualInfo: 'Larger values create wider curves',
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      decimals: 1,
      editable: true,
      color: '#ef4444',
      aiContext: 'Standard deviation controls how spread out the values are from the mean',
      aiHints: [
        'Small σ creates a tall, narrow curve',
        'Large σ creates a short, wide curve',
        'σ is the square root of the variance'
      ]
    }
  },
  
  aiContext: 'The normal distribution appears throughout nature and statistics due to the Central Limit Theorem',
  aiScenarios: [
    {
      name: 'Standard Normal',
      description: 'Mean 0, Standard Deviation 1',
      values: { mu: 0, sigma: 1 }
    },
    {
      name: 'Wide Spread',
      description: 'High variability',
      values: { mu: 0, sigma: 3 }
    },
    {
      name: 'Shifted Right',
      description: 'Positive mean',
      values: { mu: 3, sigma: 1 }
    }
  ]
};

export const gravityMeta: FormulaMeta = {
  id: 'gravity',
  title: 'Newton\'s Law of Universal Gravitation',
  description: 'The force of attraction between two masses',
  
  template: 'F = G {{m1}} {{m2}} / {{r}}²',
  
  variables: {
    m1: {
      id: 'm1',
      symbol: 'm_1',
      label: 'm₁',
      name: 'First Mass',
      description: 'Mass of the first object',
      contextualInfo: 'Larger masses create stronger gravitational forces',
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 10,
      decimals: 0,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The first mass contributes directly to the gravitational force',
      aiHints: [
        'Doubling m1 doubles the force',
        'Mass is measured in kilograms',
        'Earth has a mass of about 6×10²⁴ kg'
      ]
    },
    m2: {
      id: 'm2',
      symbol: 'm_2',
      label: 'm₂',
      name: 'Second Mass',
      description: 'Mass of the second object',
      contextualInfo: 'Larger masses create stronger gravitational forces',
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 5,
      decimals: 0,
      editable: true,
      color: '#ef4444',
      aiContext: 'The second mass contributes directly to the gravitational force',
      aiHints: [
        'Doubling m2 doubles the force',
        'Force is proportional to the product of both masses',
        'The Sun has about 333,000 times Earth\'s mass'
      ]
    },
    r: {
      id: 'r',
      symbol: 'r',
      label: 'r',
      name: 'Distance',
      description: 'Distance between the centers of the two objects',
      contextualInfo: 'Force decreases rapidly with distance',
      min: 1,
      max: 50,
      step: 0.5,
      defaultValue: 10,
      decimals: 1,
      editable: true,
      color: '#10b981',
      aiContext: 'Distance has an inverse-square relationship with force',
      aiHints: [
        'Doubling the distance reduces force to 1/4',
        'Tripling the distance reduces force to 1/9',
        'This is why gravity is weak at large distances'
      ]
    }
  },
  
  aiContext: 'Gravity is the weakest of the four fundamental forces but dominates at large scales',
  aiScenarios: [
    {
      name: 'Earth-Moon',
      description: 'Approximate Earth-Moon system',
      values: { m1: 100, m2: 1, r: 30 }
    },
    {
      name: 'Close Objects',
      description: 'Strong force at short distance',
      values: { m1: 50, m2: 50, r: 5 }
    },
    {
      name: 'Distant Objects',
      description: 'Weak force at large distance',
      values: { m1: 50, m2: 50, r: 40 }
    }
  ]
};

export const logisticMeta: FormulaMeta = {
  id: 'logistic',
  title: 'Logistic Map',
  description: 'A simple nonlinear recurrence relation that can exhibit complex behavior',
  
  template: 'x_{n+1} = {{r}} x_n (1 - x_n)',
  
  variables: {
    r: {
      id: 'r',
      symbol: 'r',
      label: 'r',
      name: 'Growth Rate',
      description: 'Parameter that controls the behavior of the system',
      contextualInfo: 'Different values of r lead to different behaviors',
      min: 0,
      max: 4,
      step: 0.01,
      defaultValue: 2.5,
      decimals: 2,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The growth rate parameter determines whether the system converges, oscillates, or becomes chaotic',
      aiHints: [
        'r < 1: population dies out',
        '1 < r < 3: population converges to a stable value',
        '3 < r < 3.57: population oscillates',
        'r > 3.57: system becomes chaotic'
      ]
    },
    x0: {
      id: 'x0',
      symbol: 'x_0',
      label: 'x₀',
      name: 'Initial Value',
      description: 'Starting value of the sequence',
      contextualInfo: 'Must be between 0 and 1',
      min: 0.01,
      max: 0.99,
      step: 0.01,
      defaultValue: 0.5,
      decimals: 2,
      editable: true,
      color: '#ef4444',
      aiContext: 'The initial value can affect the trajectory in chaotic regimes',
      aiHints: [
        'Values must be between 0 and 1',
        'Different initial values can lead to different outcomes in chaotic regimes',
        'Represents normalized population (0 = extinct, 1 = maximum)'
      ]
    }
  },
  
  aiContext: 'The logistic map is a classic example of how simple nonlinear equations can produce complex, chaotic behavior',
  aiScenarios: [
    {
      name: 'Stable Equilibrium',
      description: 'Converges to a fixed point',
      values: { r: 2.5, x0: 0.5 }
    },
    {
      name: 'Period-2 Oscillation',
      description: 'Alternates between two values',
      values: { r: 3.2, x0: 0.5 }
    },
    {
      name: 'Chaos',
      description: 'Unpredictable behavior',
      values: { r: 3.9, x0: 0.5 }
    }
  ]
};

export const idealGasMeta: FormulaMeta = {
  id: 'ideal-gas',
  title: 'Ideal Gas Law',
  description: 'Relationship between pressure, volume, temperature and amount of gas',
  
  template: 'PV = nRT',
  
  variables: {
    P: {
      id: 'P',
      symbol: 'P',
      label: 'P',
      name: 'Pressure',
      description: 'Force exerted by gas per unit area',
      contextualInfo: 'Increases when temperature increases or volume decreases',
      min: 0.1,
      max: 10,
      step: 0.1,
      defaultValue: 1,
      decimals: 1,
      editable: true,
      color: '#3b82f6',
      aiContext: 'Pressure is directly proportional to temperature and inversely proportional to volume',
      aiHints: [
        'Measured in atmospheres (atm) or pascals (Pa)',
        'Higher pressure means more frequent molecular collisions',
        'Pressure in car tires increases when driving (heating)'
      ]
    },
    V: {
      id: 'V',
      symbol: 'V',
      label: 'V',
      name: 'Volume',
      description: 'Space occupied by the gas',
      contextualInfo: 'Expands when heated or pressure decreases',
      min: 1,
      max: 20,
      step: 0.5,
      defaultValue: 10,
      decimals: 1,
      editable: true,
      color: '#ef4444',
      aiContext: 'Volume is directly proportional to temperature and inversely proportional to pressure',
      aiHints: [
        'Measured in liters (L) or cubic meters (m³)',
        'Balloons expand when heated (volume increases)',
        'Gases expand to fill their containers'
      ]
    },
    T: {
      id: 'T',
      symbol: 'T',
      label: 'T',
      name: 'Temperature',
      description: 'Average kinetic energy of gas particles',
      contextualInfo: 'Higher temperature means faster particle motion',
      min: 100,
      max: 500,
      step: 10,
      defaultValue: 300,
      decimals: 0,
      editable: true,
      color: '#10b981',
      aiContext: 'Temperature is directly proportional to pressure and volume',
      aiHints: [
        'Measured in Kelvin (K)',
        '0 K is absolute zero - no particle motion',
        'Room temperature is about 300 K (27°C)'
      ]
    },
    n: {
      id: 'n',
      symbol: 'n',
      label: 'n',
      name: 'Moles',
      description: 'Amount of gas particles',
      contextualInfo: 'More particles mean more pressure',
      min: 0.1,
      max: 2,
      step: 0.1,
      defaultValue: 0.4,
      decimals: 1,
      editable: true,
      color: '#f59e0b',
      aiContext: 'The amount of gas is directly proportional to pressure and volume',
      aiHints: [
        'One mole contains 6.02×10²³ particles (Avogadro\'s number)',
        'Moles relate mass to number of particles',
        'Breathing in adds moles to your lungs'
      ]
    }
  },
  
  aiContext: 'The ideal gas law approximates the behavior of many gases under normal conditions',
  aiScenarios: [
    {
      name: 'Standard Conditions',
      description: 'STP: Standard Temperature and Pressure',
      values: { P: 1, V: 22.4, T: 273, n: 1 }
    },
    {
      name: 'High Pressure',
      description: 'Compressed gas',
      values: { P: 5, V: 10, T: 300, n: 2 }
    },
    {
      name: 'High Temperature',
      description: 'Heated gas',
      values: { P: 2, V: 10, T: 400, n: 0.4 }
    }
  ]
};

export const fourierMeta: FormulaMeta = {
  id: 'fourier',
  title: 'Fourier Series',
  description: 'Approximating a square wave with sine waves',
  
  template: 's_N(t) = Σ_{k=0}^{N-1} 4/((2k+1)π) sin(2π(2k+1){{f0}} t)',
  
  variables: {
    N: {
      id: 'N',
      symbol: 'N',
      label: 'N',
      name: 'Number of Terms',
      description: 'How many sine waves to sum',
      contextualInfo: 'More terms create a better approximation',
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 5,
      decimals: 0,
      editable: true,
      color: '#3b82f6',
      aiContext: 'The number of terms determines how well the series approximates the square wave',
      aiHints: [
        'More terms reduce the Gibbs phenomenon',
        'Each term adds higher frequency components',
        'Infinite terms would perfectly reproduce the square wave'
      ]
    },
    f0: {
      id: 'f0',
      symbol: 'f_0',
      label: 'f₀',
      name: 'Fundamental Frequency',
      description: 'Base frequency of the square wave',
      contextualInfo: 'Higher frequency makes the wave oscillate faster',
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      decimals: 1,
      editable: true,
      color: '#ef4444',
      aiContext: 'The fundamental frequency determines the period of the wave',
      aiHints: [
        'Period T = 1/f₀',
        'Higher frequency means shorter wavelength',
        'Musical notes have specific frequencies'
      ]
    }
  },
  
  aiContext: 'Fourier series show how complex waves can be built from simple sine waves',
  aiScenarios: [
    {
      name: 'Good Approximation',
      description: 'Multiple terms',
      values: { N: 10, f0: 1 }
    },
    {
      name: 'Rough Approximation',
      description: 'Few terms',
      values: { N: 3, f0: 1 }
    },
    {
      name: 'High Frequency',
      description: 'Fast oscillation',
      values: { N: 5, f0: 3 }
    }
  ]
};

// Registro de metadados de fórmulas
export const formulaMetaRegistry: Record<string, FormulaMeta> = {
  quadratic: quadraticMeta,
  'predator-prey': predatorPreyMeta,
  sine: sineMeta,
  euler: eulerMeta,
  projectile: projectileMeta,
  normal: normalMeta,
  gravity: gravityMeta,
  logistic: logisticMeta,
  'ideal-gas': idealGasMeta,
  fourier: fourierMeta,
};

// Função para obter metadados de uma fórmula
export function getFormulaMeta(id: string): FormulaMeta | undefined {
  return formulaMetaRegistry[id];
}