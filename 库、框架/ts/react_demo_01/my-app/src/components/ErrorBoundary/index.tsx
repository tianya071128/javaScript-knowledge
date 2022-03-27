import React from 'react';
import DevHandlerError from './DevHandlerError';
import ProdHandlerError from './ProdHandlerError';
import './index.scss';

interface ComponentState {
  error?: Error & {
    code?: string;
  };
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
      const ErrorComponent =
        process.env.NODE_ENV === 'development'
          ? DevHandlerError
          : ProdHandlerError;

      return <ErrorComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}
