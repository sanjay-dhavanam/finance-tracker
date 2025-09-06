export const runtimeErrorOverlay = () => ({
  name: 'runtime-error-overlay-fallback',
  configResolved() {
    // No-op for production
  }
});

export const cartographer = () => ({
  name: 'cartographer-fallback',
  configResolved() {
    // No-op for production  
  }
});