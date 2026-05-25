declare module "react-simple-maps" {
  import type { CSSProperties, ReactNode } from "react";

  export type RsmGeography = {
    rsmKey: string;
    properties: Record<string, unknown>;
  };

  export type GeographyProps = {
    geography: unknown;
    style?: Record<string, CSSProperties>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    key?: string;
  };

  export function ComposableMap(props: {
    projection?: string;
    projectionConfig?: Record<string, number | number[]>;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }): ReactNode;

  export function Geographies(props: {
    geography: string | object;
    parseGeographies?: (geographies: RsmGeography[]) => RsmGeography[];
    children: (args: { geographies: RsmGeography[] }) => ReactNode;
  }): ReactNode;

  export function Geography(props: GeographyProps): ReactNode;

  export function Sphere(props: {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
  }): ReactNode;

  export function Graticule(props: { stroke?: string; strokeWidth?: number }): ReactNode;

  export function Marker(props: {
    coordinates: [number, number];
    children?: ReactNode;
  }): ReactNode;
}
