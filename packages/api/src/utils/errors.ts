export const EnvironmentError = (variable: string) =>
  new Error(`❌ Environment Error: ${variable} must be defined.`);
