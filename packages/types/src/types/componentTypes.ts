import { AccessCard, AccessCardv2 } from "./aws";

interface Component<T, P> {
  id: string;
  type: string;
  title: string;
  state: {
    playing: boolean;
    selected: boolean;
    layout: {
      location: number[];
      size: number[];
      lastLocation: number[];
    };
  };
  props: P;
}
interface Component<T, P> {
  id: string;
  type: string;
  title: string;
  state: {
    playing: boolean;
    selected: boolean;
    layout: {
      location: number[];
      size: number[];
      lastLocation: number[];
    };
  };
  props: P;
}

export interface AwsComponent<T, P> extends Component<T, P> {
  config: AccessCard;
  props: P;
}

export interface AwsShape extends AccessCardv2 {
  cloudprovider: "aws";
  resources: {
    resourceId: string;
    params?: any;
  }[];
  title: string;
}
