import { AWS } from "@cloudcanvas/types";
import { Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form";
declare type Config<M, U> = Pick<DataFetcher<M, U>, "initialData"> & {
    customData: CustomData;
};
declare type Props<M, U> = {
    config: Config<M, U>;
    ports: {
        aws: AWS;
    };
};
export declare type StreamConfig = {
    functionName: string;
};
export declare const makeLambdaStreamController: (props: Props<Model, Update>) => DataFetcher<Model, Update>;
export {};
