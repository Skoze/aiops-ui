import * as d3 from 'd3';
import d3tip from 'd3-tip';
import styles from './d3-trace-tree.css';

const barHeight = 48;
export default class Trace {
  constructor(el) {
    this.i = 0;
    this.handleClick = [];
    this.svg = d3
      .select(el)
      .append('svg')
      .attr('width', '100%');
    this.width = parseInt(this.svg.style('width'));
    this.tip = d3tip()
      .attr('class', styles['tip'])
      .html(d => {
        let html = `<div class="${styles['tip-label']}">${d.data.label}</div>`;
        if (!isNaN(d.data.dur)) {
          html += `<div class="${styles['tip-duration']}">SelfDuration: ${d.data.dur}ms</div>`;
        }
        if (!isNaN(d.data.endTime - d.data.startTime)) {
          html += `<div class="${styles['tip-duration']}">TotalDuration: ${d.data.endTime -
            d.data.startTime}ms</div>`;
        }
        return html;
      });
    this.svg.call(this.tip);
  }
  diagonal(d) {
    return `M ${d.source.y} ${d.source.x}
    L ${d.source.y} ${d.target.x - 30}
    L${d.target.y} ${d.target.x - 20}
    L${d.target.y} ${d.target.x}`;
  }

  addSelectListener(fn) {
    if (typeof fn === 'function') {
      this.handleClick.push(fn);
    }
  }

  resize() {
    this.width = parseInt(this.svg.style('width'));
  }
  destroy() {
    this.tip.hide();
  }

  render(data, row) {
    this.xAxis && this.xAxis.remove();
    this.data = data;
    this.min = d3.min(data.children.map(i => i.startTime));
    this.max = d3.max(data.children.map(i => i.endTime));
    this.list = Array.from(new Set(row.map(i => i.serviceCode)));
    this.xScale = d3
      .scaleLinear()
      .range([0, this.width * 0.387])
      .domain([0, this.max - this.min]);
    this.svg.attr('height', (row.length + 1) * barHeight);
    this.xAxis = this.svg
      .append('g')
      .attr('class', styles['trace-xaxis'])
      .attr('transform', `translate(${this.width * 0.618 - 20},${30})`)
      .call(
        d3.axisTop(this.xScale).tickFormat(d => {
          if (d === 0) {
            return 0;
          } else if (d >= 1000) {
            return d / 1000 + 's';
          } else {
            return d + 'ms';
          }
        }),
      );
    this.sequentialScale = d3
      .scaleSequential()
      .domain([0, this.list.length + 1])
      .interpolator(d3.interpolateCool);
    this.root = d3.hierarchy(this.data);
    this.root.x0 = 0;
    this.root.y0 = 0;
    this.update(this.root);
  }
  update(source) {
    const nodes = this.root.descendants();
    let index = -1;
    this.root.eachBefore(n => {
      n.x = (++index + 0.5) * barHeight;
      n.y = n.depth * 12;
    });
    const node = this.svg.selectAll('.trace-node').data(nodes, d => d.id || (d.id = ++this.i));
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('transform', `translate(${source.y0},${source.x0})`)
      .attr('class', 'trace-node')
      .style('opacity', 0);

    nodeEnter
      .append('text')
      .attr('x', 13)
      .attr('y', 5)
      .attr('fill', '#E54C17')
      .html(d => (d.data.isError ? '◉' : ''));
    nodeEnter
      .append('text')
      .attr('class', 'node-text')
      .attr('x', 35)
      .attr('y', -6)
      .attr('fill', '#333')
      .text(d => {
        if (d.data.label === 'TRACE_ROOT') {
          return '';
        }
        return d.data.label.length > 40 ? `${d.data.label.slice(0, 40)}...` : `${d.data.label}`;
      });
    nodeEnter
      .append('text')
      .attr('class', 'node-text')
      .attr('x', 35)
      .attr('y', 12)
      .attr('fill', '#ccc')
      .style('font-size', '11px')
      .text(d => `${d.data.layer || ''}${d.data.component ? ' - ' + d.data.component : ''}`);
    nodeEnter
      .append('rect')
      .attr('height', 6)
      .attr('width', d => {
        if (!d.data.endTime || !d.data.startTime) return 0;
        return this.xScale(d.data.endTime - d.data.startTime) + 1;
      })
      .attr('x', d =>
        !d.data.endTime || !d.data.startTime
          ? 0
          : this.width * 0.618 - 20 - d.y + this.xScale(d.data.startTime - this.min),
      )
      .style('fill', d => `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`);
    nodeEnter
      .transition()
      .duration(200)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('opacity', 1);
    nodeEnter
      .append('circle')
      .attr('r', 3)
      .style('cursor', 'pointer')
      .attr('stroke-width', 2.5)
      .attr('fill', d =>
        d._children
          ? `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`
          : 'rgb(255,255,255)',
      )
      .style('stroke', d =>
        d.data.label === 'TRACE_ROOT'
          ? ''
          : `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`,
      )
      .on('click', d => {
        if (!d.data.type) return;
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.update(d);
      });
    node
      .transition()
      .duration(200)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('opacity', 1)
      .select('circle')
      .attr('fill', d =>
        d._children
          ? `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`
          : 'rgb(255,255,255)',
      );

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition()
      .duration(200)
      .attr('transform', `translate(${source.y},${source.x})`)
      .style('opacity', 0)
      .remove();
    nodeEnter
      .append('rect')
      .attr('height', barHeight)
      .attr('class', styles['cover'])
      .attr('y', -barHeight / 2)
      .attr('x', 20)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .on('click', ({ data, depth }) => {
        if (depth) {
          this.handleClick.forEach(fn => fn(data));
        }
      });

    const link = this.svg.selectAll('.trace-link').data(this.root.links(), function(d) {
      return d.target.id;
    });

    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'trace-link')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', 2)
      .attr('d', d => {
        const o = { x: source.x0 + 35, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      })
      .transition()
      .duration(200)
      .attr('d', this.diagonal);

    link
      .transition()
      .duration(200)
      .attr('d', this.diagonal);

    link
      .exit()
      .transition()
      .duration(200)
      .attr('d', d => {
        const o = { x: source.x + 35, y: source.y };
        return this.diagonal({ source: o, target: o });
      })
      .remove();
    this.root.each(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
