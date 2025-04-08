import { lazy } from 'solid-js'
import type { Component } from 'solid-js'

// Helper function to create lazy-loaded components with proper typing
export function lazyLoad<T extends Component<any>>(
  importFn: () => Promise<{ default: T }>
): T {
  return lazy(importFn) as T
}
