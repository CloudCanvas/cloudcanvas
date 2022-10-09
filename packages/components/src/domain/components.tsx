import { AWS } from "@cloudcanvas/types";
// import { DynamoWatcherCatalogComponent } from "../components/aws/DynamoWatcher/catalog";
// import { LambdaWatcherCatalogComponent } from "../components/aws/LambdaWatcher/catalog";
import { CustomData } from "../components/form/v1";
import { SitewiseMetricCatalogComponent } from "../components/aws/SitewiseMetric/catalog";

export type ComponentCatalogEntry<T> = {
  type: string;
  title: string;
  subtitle: string;
  resourceFetcher?: (aws: AWS, prefix?: string) => Promise<CustomData[]>;
  dataFetcher?: (aws: AWS) => Promise<CustomData[]>;
  render(props: { data: T; selected: boolean }): JSX.Element;
  sampleData: () => T;
  sampleUpdate: () => T;
  icon: string;
  defaultSize: number[];
};

export const componentCatalog = [
  // DynamoWatcherCatalogComponent,
  // LambdaWatcherCatalogComponent,
  SitewiseMetricCatalogComponent,
] as ComponentCatalogEntry<any>[];
