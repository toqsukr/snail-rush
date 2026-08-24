import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react'

export type ErrorBoundaryProps = PropsWithChildren<{ fallback: ReactNode }>

type ErrorBoundaryState = { failed: boolean }

/**
 * Last line of defence for the render tree: swaps a subtree for a fallback
 * once any of its descendants throws while rendering.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render failed under the error boundary', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
