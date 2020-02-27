import React from 'react';
import DATA from './data';
import d3tip from 'd3-tip';
import * as d3 from 'd3';
import styles from './index.css';

export default class MyTopoTest extends React.Component {
  constructor(props) {
    super(props);
    this.nodes = [];
    this.edges = [];
    this.rendering = false;
  }
  componentDidMount() {
    //create svg
    this.svg = d3
      .select(`#${styles.topo}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(this.onZoom())
      .on('click', this.onUnselect());
    //create graph
    this.graph = this.svg.append('g');
    //create tip
    this.tip = d3tip()
      .offset([-16, 0])
      .attr('id', styles.tip)
      .html(d => {
        return `<div>${d.name}</div>`;
      });
    this.graph.call(this.tip);

    this.changeData();
  }
  componentWillUnmount() {
    //remove tip
    d3.selectAll(`#${styles.tip}`).remove();
  }
  initLayout() {
    const center = [
      parseInt(this.svg.style('width')) >> 1,
      parseInt(this.svg.style('height')) >> 1,
    ];
    this.force = d3
      .forceSimulation()
      .force(
        'collide',
        d3.forceCollide().radius(() => 50),
      )
      .force('radial', d3.forceRadial(20, ...center))
      .stop();
  }
  setData(data) {
    if (isDifferentNodes(data.nodes, this.nodes)) {
      console.log('nodes changed');
      this.initLayout();
      this.nodes = data.nodes;
      this.createNodes();
    } else if (!isDifferentEdges(data.edges, this.edges)) {
      return;
    }
    console.log('edges changed');
    this.edges = data.edges;
    this.createEdges();
    this.updateGraph();
  }
  createNodes() {
    this.nodeGroups && this.nodeGroups.remove();
    this.nodeGroups = this.graph.append('g');

    this.force.nodes(this.nodes);
    this.force.tick(1000);

    this.node = this.nodeGroups
      .selectAll()
      .data(this.nodes)
      .enter()
      .append('g')
      .classed(styles.node, true)
      .call(this.onDrag())
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .on('click', this.onSelect());
    this.node
      .append('circle')
      .classed(styles.circle, true)
      .filter(d => d.exception !== undefined)
      .attr('stroke', d => `hsl(${((100 - d.exception) / 100) * 120}, 50%, 50%)`);
    this.node
      .append('image')
      .classed(styles['node-type'], true)
      .attr('xlink:href', d => {
        return getNodeImg(d.type);
      });
    this.node
      .append('text')
      .classed(styles['node-text'], true)
      .text(d => (d.name.length > 20 ? `${d.name.substring(0, 20)}...` : d.name));
  }
  createEdges() {
    this.edgeGroups && this.edgeGroups.remove();
    this.edgeGroups = this.graph.append('g');

    this.force.force(
      'edge',
      d3.forceLink(this.edges).id(d => d.id),
    );

    this.edge = this.edgeGroups
      .selectAll()
      .data(this.edges)
      .enter()
      .append('path')
      .classed(styles.edge, true);
  }
  updateGraph() {
    if (!this.rendering) {
      this.rendering = true;
      requestAnimationFrame(() => {
        this.node.attr('transform', d => `translate(${d.x},${d.y})`);

        this.edge.attr('d', d => {
          return `M${d.source.x} ${d.source.y} Q ${(d.source.x + d.target.x) / 2} ${(d.target.y +
            d.source.y) /
            2 -
            80} ${d.target.x} ${d.target.y}`;
        });
        if (this.selected) {
          this.node
            .classed(styles.unselected, false)
            .filter(d => {
              return !this.isLinkNode(this.selected, d);
            })
            .classed(styles.unselected, true);
          this.edge
            .classed(styles.unselected, false)
            .filter(d => {
              return !this.isLinkEdge(this.selected, d);
            })
            .classed(styles.unselected, true);
        } else {
          this.node.classed(styles.unselected, false);
          this.edge.classed(styles.unselected, false);
        }
        this.rendering = false;
      });
    }
  }
  onDrag() {
    return d3
      .drag()
      .on('start', this.tip.hide)
      .on('drag', d => {
        this.tip.hide();
        d.x = d3.event.x;
        d.y = d3.event.y;
        this.updateGraph();
      })
      .on('end', this.tip.show);
  }
  onZoom() {
    return d3
      .zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', () => {
        this.graph.attr(
          'transform',
          `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${d3.event.transform.k})`,
        );
      });
  }
  onSelect() {
    return curnode => {
      d3.event.stopPropagation();
      this.selected = curnode;
      this.updateGraph();
    };
  }
  onUnselect() {
    return () => {
      this.selected = null;
      this.updateGraph();
    };
  }
  isLinkNode(node1, node2) {
    if (node1 === node2) {
      return true;
    }
    for (let { source, target } of this.edges) {
      if ((source === node1 && target === node2) || (source === node2 && target === node1)) {
        return true;
      }
    }
    return false;
  }
  isLinkEdge(node, edge) {
    const { source, target } = edge;
    if (source === node || target === node) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    return <div id={styles.topo}></div>;
  }
  changeData() {
    const that = this;
    let currNodes;
    function changeNodes() {
      currNodes = nodeGenerator();
      const edges = edgeGenerator(currNodes);
      const data = { nodes: JSON.parse(JSON.stringify(currNodes)), edges };
      that.setData(data);
    }

    function changeEdges() {
      const edges = edgeGenerator(currNodes);
      const data = { nodes: JSON.parse(JSON.stringify(currNodes)), edges };
      that.setData(data);
    }
    let count = 0;
    function a() {
      if (count % 5) {
        changeEdges();
      } else {
        changeNodes();
      }
      count++;
      setTimeout(a, 6000);
    }
    a();
  }
}

function getNodeImg(type) {
  try {
    return require(`./assets/${type.toUpperCase()}.png`);
  } catch {
    return require('./assets/cube22.png');
  }
}

function isDifferentNodes(nodes1, nodes2) {
  if (nodes1.length !== nodes2.length) {
    return true;
  }
  const set = new Set(nodes1.map(node => node.id));
  return nodes2.some(val => !set.has(val.id));
}
function isDifferentEdges(edges1, edges2) {
  if (edges1.length !== edges2.length) {
    return true;
  }
  const set = new Set(edges1.map(edge => edge.id));
  return edges2.some(val => !set.has(val.id));
}

function nodeGenerator() {
  const { nodes } = JSON.parse(JSON.stringify(DATA));
  let result = [];
  let nodeLength = Math.floor(nodes.length * Math.random()) + 1;
  for (let i = 0; i < nodeLength; i++) {
    result.push(nodes.splice(Math.floor(nodes.length * Math.random()), 1)[0]);
  }
  return result;
}

function edgeGenerator(nodes) {
  let result = [];
  let nodeLength = nodes.length;
  let edgeLength = Math.floor(((nodeLength * (nodeLength - 1)) / 2) * Math.random()) + 1;
  for (let i = 0; i < edgeLength; i++) {
    const source = nodes[Math.floor(nodeLength * Math.random())].id;
    const target = nodes[Math.floor(nodeLength * Math.random())].id;

    if (source !== target && !result.some(val => val.id === `${source}_${target}`)) {
      result.push({ id: `${source}_${target}`, source, target });
    }
  }
  return result;
}
