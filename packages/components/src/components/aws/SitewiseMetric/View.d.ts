import "./View.css";
import { Model } from "./model";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
declare const _default: (props: AwsComponentProps<CustomData>) => JSX.Element;
export default _default;
export declare type ViewProps = {
    data: Model;
    selected: boolean;
    setSelected: () => void;
};
export declare const View: ({ data, selected, setSelected }: ViewProps) => JSX.Element;
