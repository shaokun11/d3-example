let chart = (data) => {
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
  );
//   const svg = d3.create("svg");
  let svgGroup = d3
    .select("#tree-container")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function () {
        const { k, x, y } = d3.event.transform;
        d3.select("#tree-container > svg > g").attr(
          "transform",
          "translate(" + x + y + ")scale(" + k + ")"
        );
      })
    );
  let svg = svgGroup.append("g");
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y)
    );

  svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
    .attr(
      "transform",
      (d) => `
      rotate(${(d.x * 180) / Math.PI - 90})
      translate(${d.y},0)
    `
    )
    .attr("fill", (d) => (d.children ? "#555" : "#999"))
    .attr("r", 2.5);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .attr(
      "transform",
      (d) => `
      rotate(${(d.x * 180) / Math.PI - 90}) 
      translate(${d.y},0) 
      rotate(${d.x >= Math.PI ? 180 : 0})
    `
    )
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr("text-anchor", (d) =>
      d.x < Math.PI === !d.children ? "start" : "end"
    )
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr("stroke", "white");

  return svg.attr("viewBox", [-width / 2, -height / 2, width, height]).node();
};

function autoBox() {
  document.body.appendChild(this);
  const { x, y, width, height } = this.getBBox();
  document.body.removeChild(this);
  return [x, y, width, height];
}
let width = 1000;
let height = 768;
let radius = width / 4;
let tree = d3.cluster().size([2 * Math.PI, radius - 100]);

let data = {
  name: "flare",
  children: [
    {
      name: "cluster",
      children: [
        { name: "AgglomerativeCluster", value: 938 },
        { name: "CommunityStructure", value: 812 },
        { name: "HierarchicalCluster", value: 6714 },
        { name: "MergeEdge", value: 743 },
      ],
    },
    {
      name: "graph",
      children: [
        { name: "BetweennessCentrality", value: 938 },
        { name: "LinkDistance", value: 812 },
        { name: "MaxFlowMinCut", value: 714 },
        { name: "ShortestPaths", value: 743 },
        { name: "SpanningTree", value: 743 },
      ],
    },
  ],
};
chart(data);
