// Declare Variables
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let request = new XMLHttpRequest();

let values = [];

let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip");

// Declare Functions
let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  xAxisScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => item["Year"]) - 1,
      d3.max(values, (item) => item["Year"]) + 1,
    ])
    .range([padding, width - padding]);
  yAxisScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => new Date(item["Seconds"] * 1000)),
      d3.max(values, (item) => new Date(item["Seconds"] * 1000)),
    ])
    .range([padding, height - padding]);
};

let drawPoints = () => {
  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (item) => {
      return item["Year"];
    })
    .attr("data-yvalue", (item) => new Date(item["Seconds"] * 1000))
    .attr("cx", (item) => {
      return xAxisScale(item["Year"]);
    })
    .attr("cy", (item) => {
      return yAxisScale(new Date(item["Seconds"] * 1000));
    })
    .attr("fill", (item) => {
      if (item["Doping"] !== "") {
        return "#960018";
      } else {
        return "#4CBB17";
      }
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");
      if (item["Doping"] !== "") {
        tooltip.text(
          `${item["Year"]} - ${item["Name"]} - ${item["Time"]} - ${item["Doping"]}`
        );
      } else {
        tooltip.text(`${item["Year"]} - ${item["Name"]} - ${item["Time"]}`);
      }
      tooltip.attr("data-year", item["Year"])
    })
    .on("mouseout", (item) => tooltip.transition().style("visibility", "hidden"));
};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

request.open("GET", url, true);
request.onload = () => {
  values = JSON.parse(request.responseText);
  drawCanvas();
  generateScales();
  drawPoints();
  generateAxes();
};
request.send();
