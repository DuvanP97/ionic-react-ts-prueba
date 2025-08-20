// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.myapp',
  appName: 'proy-make-pizza',
  webDir: 'dist', // ← Vite construye en "dist"
};

export default config;