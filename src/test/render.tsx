import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ThemeConfig from "../config/theme.config";

type WrapperProps = {
  children: React.ReactNode;
};

type TestRenderOptions = {
  initialEntries?: string[];
};

const testRender = (
  Component: React.ReactElement,
  Options: RenderOptions & TestRenderOptions = {}
) => {
  function Wrapper({ children }: WrapperProps) {
    return (
      <ThemeConfig>
        <MemoryRouter initialEntries={Options.initialEntries}>
          {children}
        </MemoryRouter>
      </ThemeConfig>
    );
  }
  return render(Component, { wrapper: Wrapper, ...Options });
};

export default testRender;
