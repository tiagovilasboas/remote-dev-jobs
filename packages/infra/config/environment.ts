export interface EnvironmentConfig {
  JSEARCH_API_KEY?: string;
  NODE_ENV: string;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    JSEARCH_API_KEY: process.env.JSEARCH_API_KEY,
    NODE_ENV: process.env.NODE_ENV || "development",
  };
};

export const isProduction = (): boolean => {
  return getEnvironmentConfig().NODE_ENV === "production";
};

export const isDevelopment = (): boolean => {
  return getEnvironmentConfig().NODE_ENV === "development";
}; 