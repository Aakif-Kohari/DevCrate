import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    // NOT setting `pool` here. Diagnostic history for whoever hits this next:
    // both "forks" (default) and "threads" fail identically on at least one
    // Windows machine with "Timeout waiting for worker to respond" at ~60s.
    // Since that's consistent across two fundamentally different worker
    // strategies (subprocess vs. worker_threads), it's not a pool-config
    // problem — it points to something in the local environment (antivirus/
    // EDR scanning node_modules and slowing process/thread creation past the
    // timeout is the most common real-world cause). See
    // .maintainer/MAINTAINER_SETUP.md for the diagnostic checklist. CI
    // (ubuntu-latest) runs these tests successfully on every PR regardless.
  },
})
