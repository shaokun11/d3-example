const drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};
const height = $(document).height();
const width = $(document).width();

const color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
};

let rootNode;
const chart = data => {
  const root = d3.hierarchy(data);
  rootNode = root;
  const links = root.links();
  const nodes = root.descendants();
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.id)
        .distance(0)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  let svgGroup = d3
    .select("#tree-container")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function() {
        const { k, x, y } = d3.event.transform;
        d3.select("#tree-container > svg > g").attr(
          "transform",
          "translate(" + x + y + ")scale(" + k + ")"
        );
      })
    );
  let svg = svgGroup.append("g");

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg
    .append("g")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", d => (d.children ? null : "#000"))
    .attr("stroke", d => (d.children ? null : "#fff"))
    .attr("r", 3.5)
    .call(drag(simulation));

  node.on("click", function(d) {
    $("#myModal")
      .append(`<p>account: ${d.data.name}</p>`)
      .append(`<p>parent: ${d.data.parent}</p>`)
      .append(`<p>child count : ${d.data.children.length}</p>`)
      .modal();
  });

  $("#myModal").on("modal:close", function() {
    $(this).empty();
  });

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
  });
};

chart(rawData);

let mockData = {
  name: "root",
  children: [
    {
      name: "one",
      children: [
        {
          name: "two",
          children: [
            {
              name: "three",
              children: [],
              parent: "two",
              data: "",
            },
          ],
          parent: "one",
          data: "",
        },
        {
          name: "two 2",
          children: [],
          parent: "one",
          data: "",
        },
      ],
      parent: "root",
      data: "",
    },
  ],
};

