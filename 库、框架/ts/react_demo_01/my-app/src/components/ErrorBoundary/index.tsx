import React from 'react';

interface ComponentState {
  error?: Error;
}

interface ComponentProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    console.dir(error);

    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { error };
  }

  render() {
    if (this.state.error) {
      return <p>{this.state.error?.message}</p>;
    }

    return this.props.children;
  }
}
