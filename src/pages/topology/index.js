import React, { useEffect, useRef, useContext } from 'react';
import { DurationContext } from '@/layouts';
import { getTopology } from '@/api/topology';
import Graph from '@/components/Topology/graph';
import styles from './index.css';

export default function() {
  const svgRef = useRef();
  const graph = useRef(null);
  const { duration } = useContext(DurationContext);
  useEffect(() => {
    graph.current = new Graph(svgRef.current);
  }, []);
  useEffect(() => {
    let isFetching = true;
    getTopology(duration).then(res => {
      if (graph.current instanceof Graph && isFetching) {
        graph.current.setOption({ nodes: res.nodes, links: res.calls });
      }
    });
    return () => (isFetching = false);
  }, [duration]);
  return <svg ref={svgRef} className={styles['svg']} width="100%" height="100%"></svg>;
}
