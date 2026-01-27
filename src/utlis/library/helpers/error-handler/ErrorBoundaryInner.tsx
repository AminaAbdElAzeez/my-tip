import  { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallBackUIComponent?: ReactNode;
  hasError:boolean
  setHasError:Function
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidUpdate(prevProps: State, _previousState: State) {
    if(!this.props.hasError && prevProps.hasError) {
      this.setState({ hasError: false });
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.props.setHasError(true);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallBackUIComponent;
    }

    return this.props.children;
  }
}

export default ErrorBoundaryInner;