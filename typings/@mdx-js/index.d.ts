declare module "@mdx-js/mdx" {
  export interface Options {
    filepath?: string;
    footnotes?: boolean;
    mdPlugins?: any[];
    hastPlugins?: any[];
    compilers?: any[];
    blocks?: string[];
    skipExport?: boolean;
    layout?: boolean;
    preserveNewlines?: boolean;
  }
  function mdx(content: string, options?: Options): string;
  export function sync(content: string, options?: Options): string;
  export default mdx;
}

declare module "@mdx-js/tag" {
  import * as React from "react";

  export interface LayoutProps {
    children: React.ReactNode[];
    id: string;
  }

  export interface MDXTagProps<T extends keyof JSX.IntrinsicElements> {
    name: T;
    parentName?: keyof JSX.IntrinsicElements;
    props?: JSX.IntrinsicElements[T];
    children?: React.ReactNode[] | string;
    components?: { [key: string]: <T>(props: T) => React.ReactElement<T> };
    Layout?: ({ children, id }: LayoutProps) => React.ReactNode[];
    layoutProps?: LayoutProps;
  }

  export class MDXTag<T extends keyof JSX.IntrinsicElements> extends React.Component<MDXTagProps<T>, {}> {
    public render(): JSX.Element;
  }
}
