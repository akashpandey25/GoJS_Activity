const $ = go.GraphObject.make;
    const myDiagram = $(go.Diagram, "myDiagramDiv");

  
    myDiagram.nodeTemplate = $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "yellow", strokeWidth: 1 }),
      $(go.TextBlock, { margin: 8, wrap: go.TextBlock.WrapFit, width: 120 },
        new go.Binding("text", "name"))
    );


    myDiagram.linkTemplate = $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

    myDiagram.layout=$(go.ForceDirectedLayout);
    fetch("https://oasis-open.github.io/cti-documentation/examples/example_json/apt1.json")
    .then(res=>res.json())
    .then(data => {
            const { nodeDataArray, linkDataArray } = transform(data); 
            myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        });


    function transform(data) {
    const stixObjects = data.objects; 
    const nodes = [];
    const links = [];

    stixObjects.forEach(obj => {
        const id = obj.id;
        const name = obj.name || obj.type;

        if (obj.type !== "relationship" ) {
        nodes.push({ key: id, name });
    
        }
    });

    stixObjects.forEach(obj => {
        if (obj.type === "relationship") {
        const from = obj.source_ref;
        const to = obj.target_ref;
        links.push({ from, to });
        }
    });

    return {
        nodeDataArray: nodes,
        linkDataArray: links
  };
}
