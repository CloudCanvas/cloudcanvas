import React from "react";
import LambdaWatcher, { View, ViewProps } from "./View";

export default {
  title: "components/aws/LambdaWatcher",
  component: LambdaWatcher,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the LambdaWatcher component
const Template = (args: ViewProps) => () =>
  (
    <div
      style={{
        width: 600,
        height: 400,
        borderRadius: 3,
        borderWidth: 3,
        borderStyle: "solid",
        overflow: "scroll",
      }}
    >
      <View {...args} />
    </div>
  );

// Reuse that template for creating different stories
export const NoRecords = Template({ data: [] });

const sampleRecords = [
  {
    ingestionTime: 1661846715963,
    message:
      "START RequestId: 1c6ce96f-c514-4799-bebe-b5b85be7ee3d Version: $LATEST\n",
    timestamp: 1661846710504,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "Calculating for date 2022-08-30 00:00:00\n",
    timestamp: 1661846710531,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "199 tracks in total\n",
    timestamp: 1661846711388,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "First track date\n",
    timestamp: 1661846711410,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "2020-11-10 00:00:00\n",
    timestamp: 1661846711410,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "182 days tracked\n",
    timestamp: 1661846711411,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "There are before 2 months and one week so using 7 day SMA\n",
    timestamp: 1661846711528,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message:
      '{ "movingAverages": [{"score": 72.0, "tension": 73.0, "depression": 78.0, "anger": 67.0, "fatigue": 78.0, "confusion": 56.0, "vigour": 74.0, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 70.1666666667, "tension": 68.3333333333, "depression": 78.8333333333, "anger": 65.5, "fatigue": 78.8333333333, "confusion": 53.0, "vigour": 72.1666666667, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 68.3333333333, "tension": 63.6666666667, "depression": 79.6666666667, "anger": 64.0, "fatigue": 79.6666666667, "confusion": 50.0, "vigour": 70.3333333333, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 66.5, "tension": 59.0, "depression": 80.5, "anger": 62.5, "fatigue": 80.5, "confusion": 47.0, "vigour": 68.5, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 64.6666666667, "tension": 54.3333333333, "depression": 81.3333333333, "anger": 61.0, "fatigue": 81.3333333333, "confusion": 44.0, "vigour": 66.6666666667, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 62.8333333333, "tension": 49.6666666667, "depression": 82.1666666667, "anger": 59.5, "fatigue": 82.1666666667, "confusion": 41.0, "vigour": 64.8333333333, "score_ma7": null, "score_ma30": null, "anger_ma7": null, "anger_ma30": null, "tension_ma7": null, "tension_ma30": null, "depression_ma7": null, "depression_ma30": null, "confusion_ma7": null, "confusion_ma30": null, "vigour_ma7": null, "vigour_ma30": null, "fatigue_ma7": null, "fatigue_ma30": null}, {"score": 61.0, "tension": 45.0, "depression": 83.0, "anger": 58.0, "fatigue": 83.0, "confusion": 38.0, "vigour": 63.0, "score_ma7": 66.5, "score_ma30": null, "anger_ma7": 62.5, "anger_ma30": null, "tension_ma7": 59.0, "tension_ma30": null, "depression_ma7": 80.5, "depression_ma30": null, "confusion_ma7": 47.0, "confusion_ma30": null, "vigour_ma7": 68.5, "vigour_ma30": null, "fatigue_ma7": 80.5, "fatigue_ma30": null}, {"score": 60.25, "tension": 52.0, "depression": 74.0, "anger": 65.25, "fatigue": 67.0, "confusion": 51.0, "vigour": 54.5, "score_ma7": 64.8214285714, "score_ma30": null, "anger_ma7": 62.25, "anger_ma30": null, "tension_ma7": 56.0, "tension_ma30": null, "depression_ma7": 79.9285714286, "depression_ma30": null, "confusion_ma7": 46.2857142857, "confusion_ma30": null, "vigour_ma7": 65.7142857143, "vigour_ma30": null, "fatigue_ma7": 78.9285714286, "fatigue_ma30": null}, {"score": 59.5, "tension": 59.0, "depression": 65.0, "anger": 72.5, "fatigue": 51.0, "confusion": 64.0, "vigour": 46.0, "score_ma7": 63.2976190476, "score_ma30": null, "anger_ma7": 63.25, "anger_ma30": null, "tension_ma7": 54.6666666667, "tension_ma30": null, "depression_ma7": 77.9523809524, "depression_ma30": null, "confusion_ma7": 47.8571428571, "confusion_ma30": null, "vigour_ma7": 61.9761904762, "vigour_ma30": null, "fatigue_ma7": 74.9523809524, "fatigue_ma30": null}, {"score": 60.125, "tension": 62.0, "depression": 68.25, "anger": 66.625, "fatigue": 52.75, "confusion": 64.75, "vigour": 47.75, "score_ma7": 62.125, "score_ma30": null, "anger_ma7": 63.625, "anger_ma30": null, "tension_ma7": 54.4285714286, "tension_ma30": null, "depression_ma7": 76.3214285714, "depression_ma30": null, "confusion_ma7": 49.9642857143, "confusion_ma30": null, "vigour_ma7": 58.75, "vigour_ma30": null, "fatigue_ma7": 71.1071428571, "fatigue_ma30": null}, {"score": 60.75, "tension": 65.0, "depression": 71.5, "anger": 60.75, "fatigue": 54.5, "confusion": 65.5, "vigour": 49.5, "score_ma7": 61.3035714286, "score_ma30": null, "anger_ma7": 63.375, "anger_ma30": null, "tension_ma7": 55.2857142857, "tension_ma30": null, "depression_ma7": 75.0357142857, "depression_ma30": null, "confusion_ma7": 52.6071428571, "confusion_ma30": null, "vigour_ma7": 56.0357142857, "vigour_ma30": null, "fatigue_ma7": 67.3928571429, "fatigue_ma30": null}, {"score": 61.375, "tension": 68.0, "depression": 74.75, "anger": 54.875, "fatigue": 56.25, "confusion": 66.25, "vigour": 51.25, "score_ma7": 60.8333333333, "score_ma30": null, "anger_ma7": 62.5, "anger_ma30": null, "tension_ma7": 57.2380952381, "tension_ma30": null, "depression_ma7": 74.0952380952, "depression_ma30": null, "confusion_ma7": 55.7857142857, "confusion_ma30": null, "vigour_ma7": 53.8333333333, "vigour_ma30": null, "fatigue_ma7": 63.8095238095, "fatigue_ma30": null}, {"score": 62.0, "tension": 71.0, "depression": 78.0, "anger": 49.0, "fatigue": 58.0, "confusion": 67.0, "vigour": 53.0, "score_ma7": 60.7142857143, "score_ma30": null, "anger_ma7": 61.0, "anger_ma30": null, "tension_ma7": 60.2857142857, "tension_ma30": null, "depression_ma7": 73.5, "depression_ma30": null, "confusion_ma7": 59.5, "confusion_ma30": null, "vigour_ma7": 52.1428571429, "vigour_ma30": null, "fatigue_ma7": 60.3571428571, "fatigue_ma30": null}, {"score": 63.625, "tension": 71.875, "depression": 78.375, "anger": 52.375, "fatigue": 59.625, "confusion": 68.375, "vigour": 56.875, "score_ma7": 61.0892857143, "score_ma30": null, "anger_ma7": 60.1964285714, "anger_ma30": null, "tension_ma7": 64.125, "tension_ma30": null, "depression_ma7": 72.8392857143, "depression_ma30": null, "confusion_ma7": 63.8392857143, "confusion_ma30": null, "vigour_ma7": 51.2678571429, "vigour_ma30": null, "fatigue_ma7": 57.0178571429, "fatigue_ma30": null}, {"score": 65.25, "tension": 72.75, "depression": 78.75, "anger": 55.75, "fatigue": 61.25, "confusion": 69.75, "vigour": 60.75, "score_ma7": 61.8035714286, "score_ma30": null, "anger_ma7": 58.8392857143, "anger_ma30": null, "tension_ma7": 67.0892857143, "tension_ma30": null, "depression_ma7": 73.5178571429, "depression_ma30": null, "confusion_ma7": 66.5178571429, "confusion_ma30": null, "vigour_ma7": 52.1607142857, "vigour_ma30": null, "fatigue_ma7": 56.1964285714, "fatigue_ma30": null}, {"score": 66.875, "tension": 73.625, "depression": 79.125, "anger": 59.125, "fatigue": 62.875, "confusion": 71.125, "vigour": 64.625, "score_ma7": 62.8571428571, "score_ma30": null, "anger_ma7": 56.9285714286, "anger_ma30": null, "tension_ma7": 69.1785714286, "tension_ma30": null, "depression_ma7": 75.5357142857, "depression_ma30": null, "confusion_ma7": 67.5357142857, "confusion_ma30": null, "vigour_ma7": 54.8214285714, "vigour_ma30": null, "fatigue_ma7": 57.8928571429, "fatigue_ma30": null}, {"score": 68.5, "tension": 74.5, "depression": 79.5, "anger": 62.5, "fatigue": 64.5, "confusion": 72.5, "vigour": 68.5, "score_ma7": 64.0535714286, "score_ma30": null, "anger_ma7": 56.3392857143, "anger_ma30": null, "tension_ma7": 70.9642857143, "tension_ma30": null, "depression_ma7": 77.1428571429, "depression_ma30": null, "confusion_ma7": 68.6428571429, "confusion_ma30": null, "vigour_ma7": 57.7857142857, "vigour_ma30": null, "fatigue_ma7": 59.5714285714, "fatigue_ma30": null}, {"score": 70.125, "tension": 75.375, "depression": 79.875, "anger": 65.875, "fatigue": 66.125, "confusion": 73.875, "vigour": 72.375, "score_ma7": 65.3928571429, "score_ma30": null, "anger_ma7": 57.0714285714, "anger_ma30": null, "tension_ma7": 72.4464285714, "tension_ma30": null, "depression_ma7": 78.3392857143, "depression_ma30": null, "confusion_ma7": 69.8392857143, "confusion_ma30": null, "vigour_ma7": 61.0535714286, "vigour_ma30": null, "fatigue_ma7": 61.2321428571, "fatigue_ma30": null}, {"score": 71.75, "tension": 76.25, "depression": 80.25, "anger": 69.25, "fatigue": 67.75, "confusion": 75.25, "vigour": 76.25, "score_ma7": 66.875, "score_ma30": null, "anger_ma7": 59.125, "anger_ma30": null, "tension_ma7": 73.625, "tension_ma30": null, "depression_ma7": 79.125, "depression_ma30": null, "confusion_ma7": 71.125, "confusion_ma30": null, "vigour_ma7": 64.625, "vigour_ma30": null, "fatigue_ma7": 62.875, "fatigue_ma30": null}, {"score": 73.375, "tension": 77.125, "depression": 80.625, "anger": 72.625, "fatigue": 69.375, "confusion": 76.625, "vigour": 80.125, "score_ma7": 68.5, "score_ma30": null, "anger_ma7": 62.5, "anger_ma30": null, "tension_ma7": 74.5, "tension_ma30": null, "depression_ma7": 79.5, "depression_ma30": null, "confusion_ma7": 72.5, "confusion_ma30": null, "vigour_ma7": 68.5, "vigour_ma30": null, "fatigue_ma7": 64.5, "fatigue_ma30": null}, {"score": 75.0, "tension": 78.0, "depression": 81.0, "anger": 76.0, "fatigue": 71.0, "confusion": 78.0, "vigour": 84.0, "score_ma7": 70.125, "score_ma30": null, "anger_ma7": 65.875, "anger_ma30": null, "tension_ma7": 75.375, "tension_ma30": null, "depression_ma7": 79.875, "depression_ma30": null, "confusion_ma7": 73.875, "confusion_ma30": null, "vigour_ma7": 72.375, "vigour_ma30": null, "fatigue_ma7": 66.125, "fatigue_ma30": null}, {"score": 75.1818181818, "tension": 78.3636363636, "depression": 81.0, "anger": 74.7272727273, "fatigue": 71.5454545455, "confusion": 78.1818181818, "vigour": 83.0909090909, "score_ma7": 71.5438311688}  ]}',
    timestamp: 1661846711651,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message: "END RequestId: 1c6ce96f-c514-4799-bebe-b5b85be7ee3d\n",
    timestamp: 1661846711711,
    id: Math.random() + "",
  },
  {
    ingestionTime: 1661846715963,
    message:
      "REPORT RequestId: 1c6ce96f-c514-4799-bebe-b5b85be7ee3d\tDuration: 1206.02 ms\tBilled Duration: 1207 ms\tMemory Size: 512 MB\tMax Memory Used: 213 MB\tInit Duration: 4559.61 ms\t\n" +
      "XRAY TraceId: 1-630dc4b0-1ea25a15520104ec5be549b1\tSegmentId: 4439bb130193aef9\tSampled: true\t\n",
    timestamp: 1661846711711,
    id: Math.random() + "",
  },
];

export const SampleDataLogs = Template({ data: sampleRecords });
