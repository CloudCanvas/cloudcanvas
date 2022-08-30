import { AccessCard } from "@cloudcanvas/types";

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
