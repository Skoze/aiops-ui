import React, { useEffect, useRef, useContext, useState } from 'react';
import { DurationContext } from '@/layouts';
import { getTopology } from '@/api/topology';
import Graph from '@/components/Topology/graph';
import ServiceSelector from '@/components/Topology/service-selector';
import styles from './index.css';

export default function() {
  const svgRef = useRef();
  const graph = useRef(null);
  const { duration } = useContext(DurationContext);
  const [services, setServices] = useState([]);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  useEffect(() => {
    graph.current = new Graph(svgRef.current);
  }, []);
  useEffect(() => {
    let isFetching = true;
    getTopology(duration).then(res => {
      if (isFetching) {
        setData({ nodes: res.nodes, links: res.calls });
        setServices(res.nodes.filter(node => node.isReal));
      }
    });
    return () => (isFetching = false);
  }, [duration]);

  useEffect(() => {
    if (graph.current instanceof Graph) {
      graph.current.setOption(subData(data, selectedServiceIds));
    }
  }, [data, selectedServiceIds]);

  return (
    <div className={styles['container']}>
      <svg ref={svgRef} className={styles['svg']} width="100%" height="100%"></svg>
      <div className={styles['service-selector']}>
        <ServiceSelector services={services} onChange={setSelectedServiceIds}></ServiceSelector>
      </div>
    </div>
  );
}

function subData({ nodes, links }, ids) {
  const subNodes = [];
  const subLinks = [];
  const nodeIds = new Set(nodes.map(node => node.id));
  const subNodeIds = new Set();
  for (let link of links) {
    const { source, target } = link;
    if (nodeIds.has(source) && nodeIds.has(target)) {
      if (ids.includes(source) || ids.includes(target)) {
        subLinks.push({ ...link });
        subNodeIds.add(source);
        subNodeIds.add(target);
      }
    }
  }
  for (let node of nodes) {
    if (subNodeIds.has(node.id)) {
      subNodes.push({ ...node });
    }
  }
  return { nodes: subNodes, links: subLinks };
}
