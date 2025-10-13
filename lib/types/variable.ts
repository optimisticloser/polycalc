export interface VariableMeta {
  // Identification
  id: string;              // Name internally (ex: "alpha")
  symbol: string;          // LaTeX symbol (ex: "\\alpha")
  label: string;           // Label for display (ex: "α")
  
  // Description
  name: string;            // Full name (ex: "Growth Rate")
  description: string;     // Detailed description
  contextualInfo?: string; // Specific contextual information
  
  // Values and Restrictions
  min: number;             // Minimum allowed value
  max: number;             // Maximum allowed value
  step: number;            // Default increment
  defaultValue: number;    // Default value
  
  // Units and Formatting
  units?: string;          // Units of measurement
  decimals?: number;       // Default decimal places
  format?: 'number' | 'percentage' | 'angle'; // Type of formatting
  
  // Interaction
  editable: boolean;       // Whether editable by user
  color?: string;          // Theme color (optional)
  
  // AI Context
  aiContext?: string;      // Specific context for AI tutor
  aiHints?: string[];      // Hints that AI can provide
}

export interface FormulaMeta {
  id: string;                      // ID of the formula
  title: string;                   // Title of the formula
  description?: string;            // Description of the formula
  
  // Formula Structure
  template: string;                // LaTeX template with placeholders
  explodedTemplate?: string;       // Specific template for exploded mode
  
  // Variables
  variables: Record<string, VariableMeta>;
  
  // AI Context
  aiContext?: string;              // General context for tutor
  aiScenarios?: Array<{            // Predefined scenarios
    name: string;
    description: string;
    values: Record<string, number>;
  }>;
}