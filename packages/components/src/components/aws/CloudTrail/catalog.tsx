import { ComponentCatalogEntry } from "../../../domain";
import View from "./View";
import { customDataFetcher } from "./configManager";
import { Model } from "./model";
import { SampleData } from "./sampleData";
import React from "react";

export const CloudTrailCatalogComponent: ComponentCatalogEntry<Model> = {
  title: "CloudTrail",
  subtitle: "Stream live updates from CloudTrail",
  sampleData: SampleData,
  sampleUpdate: SampleData,
  customDataFetcher: customDataFetcher,
  component: (props) => <View {...props} />,
  type: "cloudtrail",
  icon: `<svg width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">    <!-- Generator: Sketch 64 (93537) - https://sketch.com -->    <title>Icon-Architecture/64/Arch_AWS-Cloud-Trail_64</title>    <desc>Created with Sketch.</desc>    <defs>        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">            <stop stop-color="#B0084D" offset="0%"></stop>            <stop stop-color="#FF4F8B" offset="100%"></stop>        </linearGradient>    </defs>    <g id="Icon-Architecture/64/Arch_AWS-Cloud-Trail_64" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">        <g id="Icon-Architecture-BG/64/Management-Governance" fill="url(#linearGradient-1)">            <rect id="Rectangle" x="0" y="0" width="80" height="80"></rect>        </g>        <path d="M25,52.996052 L29,52.996052 L29,50.994078 L25,50.994078 L25,52.996052 Z M59.971,38.1634268 C59.746,35.1264322 58.261,32.8902273 55.902,32.1004485 C54.003,31.4668238 51.911,31.914265 50.318,33.2125451 C49.352,31.3076668 47.9,29.4418271 46.702,28.2596615 C42.406,24.0194805 37.668,22.9384146 32.616,25.0454922 C28.106,26.9223428 24,33.0874217 24,37.9812471 L24,38.1714347 C21.293,39.0863368 19.109,41.0742969 18.074,43.608796 L19.926,44.3655422 C21.245,41.1353571 24.332,40.1223583 25.247,39.8891283 C25.69,39.7760168 26,39.376623 26,38.9191719 L26,37.9812471 C26,33.9362587 29.657,28.444844 33.385,26.8933142 C37.68,25.1025485 41.578,26.0114447 45.298,29.6850669 C46.88,31.2456057 48.427,33.5608886 49.06,35.3176207 C49.184,35.6639622 49.488,35.913208 49.852,35.9682623 C50.212,36.0233166 50.577,35.8741695 50.799,35.5798793 C51.904,34.1104304 53.696,33.4738027 55.269,33.9993209 C57.004,34.5808943 58,36.3966847 58,38.9822341 C58,39.4717168 58.354,39.8891283 58.836,39.9692073 C59.569,40.0913277 66,41.3515703 66,47.9911171 C66,54.8678977 59.281,54.996024 59,54.998026 L36,54.998026 L36,57 L59.002,57 C62.114,56.9939941 68,55.1041306 68,47.9911171 C68,41.7839967 63.279,38.989241 59.971,38.1634268 L59.971,38.1634268 Z M31,52.996052 L45,52.996052 L45,50.994078 L31,50.994078 L31,52.996052 Z M27,57 L33,57 L33,54.998026 L27,54.998026 L27,57 Z M12,57 L15,57 L15,54.998026 L12,54.998026 L12,57 Z M15,48.9921041 L24,48.9921041 L24,46.9901301 L15,46.9901301 L15,48.9921041 Z M13,52.996052 L23,52.996052 L23,50.994078 L13,50.994078 L13,52.996052 Z M27,48.9921041 L34,48.9921041 L34,46.9901301 L27,46.9901301 L27,48.9921041 Z M17,57 L25,57 L25,54.998026 L17,54.998026 L17,57 Z" id="AWS-Cloud-Trail_Icon_64_Squid" fill="#FFFFFF"></path>    </g></svg>`,
  defaultSize: [900, 500],
};
