import * as d3 from 'd3';
import d3tip from 'd3-tip';
import styles from './index.css';

export default class TopoGraph {
  constructor(selector) {
    this.svg = d3.select(selector);
    this.graph = this.svg.append('g');

    this.svg.call(this.onZoom()).on('click', () => {
      this.selected = null;
      this.updateGraph();
    });

    this.tip = d3tip()
      .attr('class', styles['tip'])
      .offset([-16, 0])
      .html(d => d.name);
    this.graph.call(this.tip);

    this.nodes = this.graph.append('g').selectAll();
    this.links = this.graph.append('g').selectAll();
    this.data = { nodes: [], links: [] };

    this.selected = null;
  }

  setOption({ nodes, links }) {
    const centerX = parseInt(this.svg.style('width')) >> 1;
    const centerY = parseInt(this.svg.style('height')) >> 1;
    diff(this.data.nodes, nodes);
    d3.forceSimulation()
      .force('collide', d3.forceCollide().radius(() => 50))
      .force('x', d3.forceX(centerX))
      .force('y', d3.forceY(centerY))
      .nodes(nodes)
      .force(
        'edge',
        d3
          .forceLink(links)
          .id(d => d.id)
          .strength(0),
      )
      .stop()
      .tick(300);
    this.data.nodes = nodes;
    this.data.links = links;
    this.selected = null;
    this.updateNodes();
    this.updateLinks();
    this.updateGraph();
  }

  updateNodes() {
    const nodes = this.nodes.data(this.data.nodes, d => d.id);
    const enter = nodes.enter().append('g');
    const exit = nodes.exit();
    this.nodes = nodes.merge(enter);
    exit
      .transition()
      .duration(400)
      .style('opacity', 0)
      .remove();
    enter
      .attr('class', styles['node'])
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .on('click', node => {
        d3.event.stopPropagation();
        this.selected = node;
        this.updateGraph();
      })
      .call(
        d3
          .drag()
          .on('start', this.tip.hide)
          .on('drag', d => {
            this.tip.hide();
            d.x = d3.event.x;
            d.y = d3.event.y;
            this.updateGraph();
          })
          .on('end', this.tip.show),
      )
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);
    enter
      .append('circle')
      .attr('class', styles['circle'])
      .attr('r', 24)
      .filter(d => d.isReal);
    // .attr('stroke', '#999');

    enter
      .append('image')
      .attr('width', 24)
      .attr('height', 24)
      .attr('transform', 'translate(-12, -12)')
      .attr('href', d => {
        return getNodeImg(d.type);
      });
    enter
      .append('text')
      .attr('transform', 'translate(0, 50)')
      .attr('text-anchor', 'middle')
      .text(d => (d.name.length > 20 ? `${d.name.substring(0, 20)}...` : d.name));

    this.nodes
      .selectAll('circle')
      .data(this.data.nodes, d => d.id)
      .filter(d => d.exception !== undefined)
      .attr('stroke', exception2Color);
  }
  updateLinks() {
    const links = this.links.data(this.data.links, d => d.id);
    const enter = links.enter().append('path');
    const exit = links.exit();
    this.links = links.merge(enter);

    exit
      .transition()
      .duration(400)
      .style('opacity', 0)
      .remove();
    enter
      .attr('class', styles['link'])
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);
  }

  updateGraph() {
    if (!this.rendering) {
      this.rendering = true;
      requestAnimationFrame(() => {
        this.nodes.attr('transform', d => `translate(${d.x},${d.y})`);
        this.links.attr('d', path);
        this.nodes
          .classed(styles['unselected'], false)
          .filter(node => {
            return !this.isRelatedNode(this.selected, node);
          })
          .classed(styles['unselected'], true);
        this.links
          .classed(styles['unselected'], false)
          .filter(link => {
            return !this.isRelatedLink(this.selected, link);
          })
          .classed(styles['unselected'], true);
        this.rendering = false;
      });
    }
  }
  isRelatedNode(node1, node2) {
    if (!node1 || !node2) {
      return true;
    }
    if (node1 === node2) {
      return true;
    }
    for (let { source, target } of this.data.links) {
      if ((source === node1 && target === node2) || (source === node2 && target === node1)) {
        return true;
      }
    }
    return false;
  }
  isRelatedLink(node, link) {
    if (!node || !link) {
      return true;
    }
    const { source, target } = link;
    if (source === node || target === node) {
      return true;
    } else {
      return false;
    }
  }

  onZoom() {
    return d3
      .zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', () => {
        const { x, y, k } = d3.event.transform;
        this.graph.attr('transform', `translate(${x},${y}) scale(${k})`);
      });
  }
}

function diff(oldNodes, newNodes) {
  newNodes.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    } else {
      return 0;
    }
  });
  let p1 = 0;
  let p2 = 0;
  while (p1 < oldNodes.length && p2 < newNodes.length) {
    if (oldNodes[p1].id === newNodes[p2].id) {
      newNodes[p2] = { ...newNodes[p2], fx: oldNodes[p1].x, fy: oldNodes[p1].y };
      p1++;
      p2++;
    }
    while (p1 < oldNodes.length && p2 < newNodes.length && oldNodes[p1].id !== newNodes[p2].id) {
      if (oldNodes[p1].id < newNodes[p2].id) {
        p1++;
      } else {
        p2++;
      }
    }
  }
  return newNodes;
}

function getNodeImg(type) {
  try {
    return require(`./assets/${type.toUpperCase()}.png`);
  } catch {
    return require('./assets/cube22.png');
  }
}

function path({ source: { x: sourceX, y: sourceY }, target: { x: targetX, y: targetY } }) {
  const middleX = (sourceX + targetX) / 2;
  const middleY = (targetY + sourceY) / 2 - 80;
  return `M${sourceX} ${sourceY} Q ${middleX} ${middleY} ${targetX} ${targetY}`;
}

const level = [0.1, 0.3, 0.6, 0.9];
function exception2Color({ exception }) {
  let index;
  for (index = 0; index < level.length; index++) {
    if (exception < level[index]) {
      break;
    }
  }
  return `hsl(${((level.length - index) / level.length) * 120}, 85%, 50%)`;
}
