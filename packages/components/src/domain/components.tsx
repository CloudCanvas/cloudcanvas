import { AccessCard, AWS } from "@cloudcanvas/types";
import { AwsComponent } from "./core";
import { DataFetcher } from "../ports/DataFetcher";
import { DynamoWatcherCatalogComponent } from "../components/aws/DynamoWatcher/catalog";
import { LambdaWatcherCatalogComponent } from "../components/aws/LambdaWatcher/catalog";
import { v4 } from "uuid";
import { CustomData } from "../components/form";

export interface AwsComponentProps<P> {
  playing: boolean;
  authorised: boolean;
  awsClient: AWS;
  customProps: P;
  // allow a custom data fetcher for testing or overriding in general
  dataFetcher?: DataFetcher<any, any>;
}

export type ComponentCatalogEntry<T, P> = {
  type: string;
  title: string;
  subtitle: string;
  customDataFetcher: (aws: AWS) => Promise<CustomData[]>;
  sampleData: () => T;
  sampleUpdate: () => T;
  component: (props: AwsComponentProps<P>) => JSX.Element;
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
  DynamoWatcherCatalogComponent,
  LambdaWatcherCatalogComponent,
] as const;
