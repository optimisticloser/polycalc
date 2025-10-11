export const toolSchema = [
  { type: "function", function: {
      name: "setVariable", description: "Set a variable by name",
      parameters: { type: "object", properties: { name: {type:"string"}, value: {type:"number"} }, required:["name","value"] }
  }},
  { type: "function", function: {
      name: "showStep", description: "Focus a specific step index",
      parameters: { type: "object", properties: { index: {type:"integer", minimum:0} }, required:["index"] }
  }},
  { type: "function", function: {
      name: "switchFormula", description: "Switch to another formula id",
      parameters: { type: "object", properties: { id: {type:"string"} }, required:["id"] }
  }},
  { type: "function", function: {
      name: "reset", description: "Reset current or given formula",
      parameters: { type: "object", properties: { formulaId: {type:"string"} } }
  }},
] as const;
