import { components } from "./components";

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export interface Component {
  id: string;
  def: ElementType<typeof components>;
  playing: boolean;
  selected: boolean;
  title: string;
  layout: {
    location: number[];
    size: number[];
    lastLocation: number[];
  };
  props?: any;
}

export interface AwsComponent<T> extends Component {
  config: {
    accountId?: string;
    ssoUrl?: string;
    region?: string;
    permissionSet?: string;
  };
  props: T;
}
