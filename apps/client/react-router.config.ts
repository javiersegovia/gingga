import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  appDirectory: 'src',
  buildDirectory: 'build',
  future: {
    unstable_viteEnvironmentApi: true,
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
  },
} satisfies Config

declare module 'react-router' {
  interface Future {
    unstable_middleware: true
  }
}
