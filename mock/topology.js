import nodes from './topology.json';
export default {
  'POST /aiops/topology/topology': (() => {
    let currNodes = nodeGenerator();
    let count = 0;
    return (req, res) => {
      count++;
      if (!(count % 5)) {
        currNodes = nodeGenerator();
      }
      res.end(
        JSON.stringify({
          nodes: currNodes.map(node => {
            if (node.exception !== undefined) {
              return { ...node, exception: Math.random() };
            } else {
              return node;
            }
          }),
          calls: edgeGenerator(currNodes),
        }),
      );
    };
  })(),
};

function nodeGenerator() {
  const copyNodes = [...nodes];
  let result = [];
  let nodeLength = Math.floor((copyNodes.length - 2) * Math.random()) + 3;
  for (let i = 0; i < nodeLength; i++) {
    result.push(copyNodes.splice(Math.floor(copyNodes.length * Math.random()), 1)[0]);
  }
  return result;
}

function edgeGenerator(nodes) {
  let result = [];
  let nodeLength = nodes.length;
  let edgeLength = Math.floor(nodeLength * 2 * Math.random()) + 2;
  for (let i = 0; i < edgeLength; i++) {
    const source = nodes[Math.floor(nodeLength * Math.random())].id;
    const target = nodes[Math.floor(nodeLength * Math.random())].id;
    if (
      source !== target &&
      !result.some(val => val.id === `${source}_${target}` || val.id === `${target}_${source}`)
    ) {
      result.push({ id: `${source}_${target}`, source, target });
    }
  }
  return result;
}
