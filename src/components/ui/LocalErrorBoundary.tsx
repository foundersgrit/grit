"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class LocalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught localized error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-white/10 bg-bottle-green/30 flex flex-col items-center justify-center text-center min-h-[200px]">
          <h3 className="font-structural text-xl uppercase tracking-widest text-white mb-4">
            Brief Interruption
          </h3>
          <p className="font-editorial text-sm text-gray-400 mb-6 max-w-sm">
            {this.props.fallbackMessage || "We&apos;re experiencing a brief interruption. Try again shortly."}
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => this.setState({ hasError: false })}
          >
            Refresh Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
