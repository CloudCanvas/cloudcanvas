import { CloudwatchAlarmCatalogComponent } from "../components/aws/CloudwatchAlarm/catalog";
import { DynamoWatcherCatalogComponent } from "../components/aws/DynamoWatcher/catalog";
import { LambdaWatcherCatalogComponent } from "../components/aws/LambdaWatcher/catalog";
import { SitewiseMetricCatalogComponent } from "../components/aws/SitewiseMetric/catalog";
import { SqWatcherCatalogComponent } from "../components/aws/Sqs/catalog";
import { CustomData } from "../components/form/v1";
import { DataFetcher } from "../ports/DataFetcher";
import { AwsComponent, AccessCard, AWS } from "cloudcanvas-types";
import { v4 } from "uuid";

export interface AwsComponentProps<P> {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  playing: boolean;
  authorised: boolean;
  awsClient: AWS;
  access: AccessCard;
  customProps: P;
  // allow a custom data fetcher for testing or overriding in general
  dataFetcher?: DataFetcher<any, any>;
  delay?: number;
  navigateTo: (path: string) => void;
}

export type ComponentCatalogEntry<T> = {
  type: string;
  title: string;
  subtitle: string;
  customDataFetcher: (aws: AWS, prefix?: string) => Promise<CustomData[]>;
  sampleData: () => T;
  sampleUpdate: () => T;
  component: (props: AwsComponentProps<CustomData>) => JSX.Element;
  icon: string;
  defaultSize: number[];
};

// The goal of this is to create a catalog item and the required props and generate
export const generateComponenEntry = ({
  type,
  title,
  accessCard,
  customData,
  location,
}: {
  type: string; // ComponentCatalogEntry["type"]
  title: string;
  accessCard: AccessCard;
  customData: any;
  location?: number[];
}): AwsComponent<any, any> => {
  return {
    id: v4(),
    type,
    title,
    state: {
      layout: {
        size: [900, 500],
        location: location || [0, 0],
        lastLocation: location || [0, 0],
      },
      playing: true,
      selected: false,
    },
    config: accessCard,
    props: customData,
  };
};

export const componentCatalog = [
  // CloudTrailCatalogComponent,
  LambdaWatcherCatalogComponent,
  DynamoWatcherCatalogComponent,
  SqWatcherCatalogComponent,
  CloudwatchAlarmCatalogComponent,
  SitewiseMetricCatalogComponent,
] as const;
