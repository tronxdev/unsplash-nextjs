export interface BasicRoute {
  basePath: string;
  pathPattern: RegExp;
  protected: boolean;
  searchSupported: boolean;
}

export type RoutingConfig = Record<string, BasicRoute>;
