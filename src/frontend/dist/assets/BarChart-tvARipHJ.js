import { l as generateCategoricalChart, B as Bar, m as formatAxisMap } from "./generateCategoricalChart-BlZ_UpE5.js";
import { X as XAxis, Y as YAxis } from "./YAxis-CqFXLIIE.js";
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
export {
  BarChart as B
};
