import { Component, PropsWithChildren, useReducer } from "react";

export const ErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const [key, reset] = useReducer((key) => key + 1, 0);

  return (
    <ErrorBoundaryImpl key={key} onReset={reset}>
      {children}
    </ErrorBoundaryImpl>
  );
};

class ErrorBoundaryImpl extends Component<
  PropsWithChildren<{ onReset: () => void }>,
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="error-box">
          <p>Error!</p>
          <button onClick={this.reset}>reset</button>
        </div>
      );
    }

    return this.props.children;
  }
}
