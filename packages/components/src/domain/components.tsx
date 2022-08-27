import { AccessCard, AWS } from "@cloudcanvas/types";
import { AwsComponent } from "./core";
import { DataFetcher } from "../ports/DataFetcher";
import { DynamoWatcherCatalogComponent } from "../components/aws/DynamoWatcher/catalog";
import { v4 } from "uuid";

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
  sampleData: () => T;
  sampleUpdate: () => T;
  component: (props: AwsComponentProps<P>) => JSX.Element;
  icon: string;
  defaultSize: number[];
};

// The goal of this is to create a catalog item and the required props and generate
export const generateComponenEntry = ({
  type,
  accessCard,
  customData,
  location,
}: {
  type: string; // ComponentCatalogEntry["type"]
  accessCard: AccessCard;
  customData: any;
  location?: number[];
}): AwsComponent<any, any> => {
  return {
    id: v4(),
    type,
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

// export const DynamoWatcherComponentDef = {
//   name: "DynamoDB watcher",
//   subtitle: "Watch live updates from a stream-enabled DynamoDB table",
//   sampleData: DynamoWatcherSampleData,
//   component: (
//     awsClient: AWS,
//     playing: boolean,
//     authorised: boolean,
//     tableName: string
//   ) => (
//     <DynamoWatcher
//       awsClient={awsClient}
//       playing={playing}
//       authorised={authorised}
//       customProps={{
//         tableName,
//       }}
//     />
//   ),
//   type: "dynamoDbWatcher", // now id
//   generateComponent: ({
//     title,
//     config,
//     customData,
//     location,
//   }: {
//     title: string;
//     config: AwsComponent["config"];
//     customData: CustomData;
//     location?: number[];
//   }): AwsComponent => {
//     return {
//       id: "",
//       title: title,
//       layout: {
//         size: [900, 500],
//         location: location || [0, 0],
//         lastLocation: location || [0, 0],
//       },
//       playing: true,
//       def: DynamoWatcherComponentDef,
//       selected: false,
//       config: config,
//       props: {
//         tableName: customData.value,
//       },
//     };
//   },
//   icon: `<svg width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Icon-Architecture/64/Arch_Amazon-DynamoDB_64</title>    <desc>Created with Sketch.</desc>    <defs>        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">            <stop stop-color="#2E27AD" offset="0%"></stop>            <stop stop-color="#527FFF" offset="100%"></stop>        </linearGradient>    </defs>    <g id="Icon-Architecture/64/Arch_Amazon-DynamoDB_64" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">        <g id="Icon-Architecture-BG/64/Database" fill="url(#linearGradient-1)">            <rect id="Rectangle" x="0" y="0" width="80" height="80"></rect>        </g>        <path d="M52.0859525,54.8502506 C48.7479569,57.5490338 41.7449661,58.9752927 35.0439749,58.9752927 C28.3419838,58.9752927 21.336993,57.548042 17.9999974,54.8492588 L17.9999974,60.284515 L18.0009974,60.284515 C18.0009974,62.9952002 24.9999974,66.0163299 35.0439749,66.0163299 C45.0799617,66.0163299 52.0749525,62.9991676 52.0859525,60.290466 L52.0859525,54.8502506 Z M52.0869525,44.522272 L54.0869499,44.5113618 L54.0869499,44.522272 C54.0869499,45.7303271 53.4819507,46.8580436 52.3039522,47.8905439 C53.7319503,49.147199 54.0869499,50.3800499 54.0869499,51.257824 C54.0869499,51.263775 54.0859499,51.2687342 54.0859499,51.2746852 L54.0859499,60.284515 L54.0869499,60.284515 C54.0869499,65.2952658 44.2749628,68 35.0439749,68 C25.8349871,68 16.0499999,65.3071678 16.003,60.3192292 C16.003,60.31427 16,60.3093109 16,60.3043517 L16,51.2548485 C16,51.2528648 16.002,51.2498893 16.002,51.2469138 C16.005,50.3691398 16.3609995,49.1412479 17.7869976,47.8875684 C16.3699995,46.6358725 16.01,45.4149236 16.001,44.5440924 L16.002,44.5440924 C16.002,44.540125 16,44.5371495 16,44.5331822 L16,35.483679 C16,35.4807035 16.002,35.477728 16.002,35.4747525 C16.005,34.5969784 16.3619995,33.3690866 17.7879976,32.1173908 C16.3699995,30.8647031 16.01,29.6427623 16.001,28.7729229 L16.002,28.7729229 C16.002,28.7689556 16,28.7649882 16,28.7610209 L16,19.7125095 C16,19.709534 16.002,19.7065585 16.002,19.703583 C16.019,14.6997751 25.8199871,12 35.0439749,12 C40.2549681,12 45.2609615,12.8281823 48.7779569,14.2722941 L48.0129579,16.1052054 C44.7299622,14.7573015 40.0029684,13.9836701 35.0439749,13.9836701 C24.9999882,13.9836701 18.0009974,17.0047998 18.0009974,19.7174687 C18.0009974,22.4291458 24.9999882,25.4502754 35.0439749,25.4502754 C35.3149746,25.4532509 35.5799742,25.4502754 35.8479739,25.4403571 L35.9319738,27.4220435 C35.6359742,27.4339456 35.3399745,27.4339456 35.0439749,27.4339456 C28.3419838,27.4339456 21.336993,26.0066949 18,23.3079117 L18,28.7401923 L18.0009974,28.7401923 L18.0009974,28.7630046 C18.0109974,29.8034395 19.0779959,30.7119605 19.9719948,31.2892085 C22.6619912,33.0040913 27.4819849,34.1754485 32.8569778,34.4184481 L32.7659779,36.4001346 C27.3209851,36.1531677 22.5529914,35.0234675 19.4839954,33.2917235 C18.7279964,33.8570695 18.0009974,34.6217743 18.0009974,35.4886382 C18.0009974,38.2003153 24.9999882,41.2214449 35.0439749,41.2214449 C36.0289736,41.2214449 37.0069723,41.1887143 37.9519711,41.1232532 L38.0909709,43.1019642 C37.1009722,43.1704008 36.0749736,43.205115 35.0439749,43.205115 C28.3419838,43.205115 21.336993,41.7778644 18,39.0790811 L18,44.5113618 L18.0009974,44.5113618 C18.0109974,45.574609 19.0779959,46.4821381 19.9719948,47.060378 C23.0479907,49.0232196 28.8239831,50.2451604 35.0439749,50.2451604 L35.4839744,50.2451604 L35.4839744,52.2288305 L35.0439749,52.2288305 C28.7249832,52.2288305 22.9819908,51.0554896 19.4699954,49.0728113 C18.7179964,49.6371655 18.0009974,50.397903 18.0009974,51.257824 C18.0009974,53.9695011 24.9999882,56.9916225 35.0439749,56.9916225 C45.0799617,56.9916225 52.0749525,53.9744602 52.0859525,51.2647668 L52.0859525,51.2548485 L52.0859525,51.2538566 C52.0839525,50.391952 51.3639534,49.6312145 50.6099544,49.0668603 C50.1219551,49.3435823 49.5989558,49.6103859 49.0039566,49.8553692 L48.2379576,48.022458 C48.9639566,47.7239156 49.5939558,47.4015692 50.1109551,47.0623616 C51.0129539,46.4742034 52.0869525,45.5547723 52.0869525,44.522272 L52.0869525,44.522272 Z M60.6529412,30.0166841 L55.0489486,30.0166841 C54.717949,30.0166841 54.4069494,29.8540231 54.2219497,29.5822603 C54.0349499,29.3104975 53.99695,28.9643471 54.1189498,28.6598537 L57.5279453,20.1380068 L44.6189702,20.1380068 L38.6189702,32.0400276 L45.0009618,32.0400276 C45.3199614,32.0400276 45.619961,32.1917784 45.8089608,32.44668 C45.9959605,32.7025735 46.0509604,33.0308709 45.9539606,33.3333806 L40.2579681,51.089212 L60.6529412,30.0166841 Z M63.7219372,29.7121907 L38.7229701,55.539576 C38.5279703,55.7399267 38.2659707,55.8440694 38.000971,55.8440694 C37.8249713,55.8440694 37.6479715,55.7994368 37.4899717,55.7052124 C37.0899722,55.4691557 36.9069725,54.992083 37.0479723,54.5517083 L43.6339636,34.0236978 L37.0009724,34.0236978 C36.6539728,34.0236978 36.3329732,33.8461593 36.1499735,33.5535679 C35.9679737,33.2609766 35.9509737,32.8959813 36.1069735,32.5885124 L43.1069643,18.7028214 C43.2759641,18.3665893 43.6219636,18.1543366 44.0009631,18.1543366 L59.0009434,18.1543366 C59.331943,18.1543366 59.6429425,18.3179894 59.8279423,18.5887604 C60.0149421,18.861515 60.052942,19.2066736 59.9309422,19.5121588 L56.5219467,28.0330139 L62.9999381,28.0330139 C63.3999376,28.0330139 63.7629371,28.2710544 63.9199369,28.6360497 C64.0769367,29.0020368 63.9989368,29.4255504 63.7219372,29.7121907 L63.7219372,29.7121907 Z M19.4549955,60.6743062 C20.8719936,61.4727334 22.6559912,62.1442057 24.7569885,62.6678947 L25.2449878,60.7437346 C23.3459903,60.2706293 21.6859925,59.6497405 20.4429942,58.949505 L19.4549955,60.6743062 Z M24.7569885,46.7985335 L25.2449878,44.8753653 C23.3459903,44.4012681 21.6859925,43.7803794 20.4429942,43.0801438 L19.4549955,44.804945 C20.8719936,45.6033722 22.6549912,46.2748446 24.7569885,46.7985335 L24.7569885,46.7985335 Z M19.4549955,28.9355839 L20.4429942,27.2107827 C21.6839925,27.9110182 23.3449903,28.5309151 25.2449878,29.0060041 L24.7569885,30.9291723 C22.6529912,30.4044916 20.8699936,29.7330193 19.4549955,28.9355839 L19.4549955,28.9355839 Z" id="Amazon-DynamoDB_Icon_64_Squid" fill="#FFFFFF"></path>    </g></svg>`,
// } as const;

// export const LambdaWatcherComponentDef = {
//   name: "Lambda watcher",
//   subtitle: "View live logs from a Lamdba function",
//   sampleData: DynamoWatcherSampleData,
//   component: (data: any) => (
//     <div style={{ width: "100%", height: "100%", background: "orange" }}></div>
//   ),
//   type: "lambdaWatcher",
//   generateComponent: ({
//     title,
//     config,
//     customData,
//   }: {
//     title: string;
//     config: AwsComponent["config"];
//     customData: CustomData;
//   }): AwsComponent => {
//     return {
//       id: "",
//       title: title,
//       layout: {
//         size: [900, 500],
//         location: [0, 0],
//         lastLocation: [0, 0],
//       },
//       playing: true,
//       def: LambdaWatcherComponentDef,
//       selected: false,
//       config: config,
//       props: {
//         functionArn: customData.value,
//       },
//     };
//   },
//   icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">    <!-- Generator: Sketch 64 (93537) - https://sketch.com -->    <title>Icon-Architecture/64/Arch_AWS-Lambda_64</title>    <desc>Created with Sketch.</desc>    <defs>        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">            <stop stop-color="#C8511B" offset="0%"></stop>            <stop stop-color="#FF9900" offset="100%"></stop>        </linearGradient>    </defs>    <g id="Icon-Architecture/64/Arch_AWS-Lambda_64" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">        <g id="Icon-Architecture-BG/64/Compute" fill="url(#linearGradient-1)">            <rect id="Rectangle" x="0" y="0" width="80" height="80"></rect>        </g>        <path d="M28.0075352,66 L15.5907274,66 L29.3235885,37.296 L35.5460249,50.106 L28.0075352,66 Z M30.2196674,34.553 C30.0512768,34.208 29.7004629,33.989 29.3175745,33.989 L29.3145676,33.989 C28.9286723,33.99 28.5778583,34.211 28.4124746,34.558 L13.097944,66.569 C12.9495999,66.879 12.9706487,67.243 13.1550766,67.534 C13.3374998,67.824 13.6582439,68 14.0020416,68 L28.6420072,68 C29.0299071,68 29.3817234,67.777 29.5481094,67.428 L37.563706,50.528 C37.693006,50.254 37.6920037,49.937 37.5586944,49.665 L30.2196674,34.553 Z M64.9953491,66 L52.6587274,66 L32.866809,24.57 C32.7014253,24.222 32.3486067,24 31.9617091,24 L23.8899822,24 L23.8990031,14 L39.7197081,14 L59.4204149,55.429 C59.5857986,55.777 59.9386172,56 60.3255148,56 L64.9953491,56 L64.9953491,66 Z M65.9976745,54 L60.9599868,54 L41.25928,12.571 C41.0938963,12.223 40.7410777,12 40.3531778,12 L22.89768,12 C22.3453987,12 21.8963569,12.447 21.8953545,12.999 L21.884329,24.999 C21.884329,25.265 21.9885708,25.519 22.1780103,25.707 C22.3654452,25.895 22.6200358,26 22.8866544,26 L31.3292417,26 L51.1221625,67.43 C51.2885485,67.778 51.6393624,68 52.02626,68 L65.9976745,68 C66.5519605,68 67,67.552 67,67 L67,55 C67,54.448 66.5519605,54 65.9976745,54 L65.9976745,54 Z" id="AWS-Lambda_Icon_64_Squid" fill="#FFFFFF"></path>    </g></svg>`,
// } as const;

export const componentCatalog = [DynamoWatcherCatalogComponent] as const;
