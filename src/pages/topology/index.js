import React, { useEffect, useRef, useContext, useState } from 'react';
import { DurationContext } from '@/layouts';
import { getTopology } from '@/api/topology';
import Graph from '@/components/Topology/graph';
import ServiceSelector from '@/components/Topology/service-selector';
import ServiceInfo from '@/components/Topology/service-info';
// import TagBase from '@/components/Base/tag-base';
import styles from './index.css';
// import { Drawer } from 'antd';

// const types = ['alarm', 'trace', 'instance', 'api'];
// const typeNames = ['告警', '调用链', '实例', '端点'];
// const typeMap = new Map(types.map((type, index) => [type, typeNames[index]]));
export default function() {
  const svgRef = useRef();
  const graph = useRef(null);
  const data = useRef({ nodes: [], links: [] });
  const { duration } = useContext(DurationContext);
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  // const [type, setType] = useState('none');
  // const [showDrawer, setShowDrawer] = useState(false);
  useEffect(() => {
    graph.current = new Graph(svgRef.current);
    graph.current.addSelectListener(setSelectedNode);
  }, []);
  useEffect(() => {
    let isFetching = true;
    getTopology(duration).then(res => {
      if (isFetching) {
        data.current = { nodes: res.nodes, links: res.calls };
        setServices(res.nodes.filter(node => node.isReal));
      }
    });
    return () => (isFetching = false);
  }, [duration]);

  useEffect(() => {
    if (graph.current instanceof Graph) {
      graph.current.setOption(subData(data.current, selectedServiceIds));
    }
  }, [selectedServiceIds]);

  return (
    <div className={styles['container']}>
      <svg ref={svgRef} className={styles['svg']} width="100%" height="100%"></svg>
      <div className={styles['service-selector']}>
        <ServiceSelector services={services} onChange={setSelectedServiceIds}></ServiceSelector>
      </div>
      {selectedNode && selectedNode.isReal && (
        // <div className={styles['tool-bar']}>
        //   {types.map(type => (
        //     <TagBase
        //       key={type}
        //       label={typeMap.get(type)}
        //       icon={tagIcon(type)}
        //       onClick={() => {
        //         setType(type);
        //         setShowDrawer(true);
        //       }}
        //     />
        //   ))}
        // </div>
        <div
          style={{
            position: 'absolute',
            left: '1em',
            top: '1em',
            minWidth: '400px',
            maxWidth: '500px',
            width: '40vw',
          }}
        >
          <ServiceInfo service={selectedNode} />
        </div>
      )}

      {/* <Drawer
        title={`${typeMap.get(type)}信息`}
        placement="left"
        visible={showDrawer}
        width="fit-content"
        drawerStyle={{ minWidth: '75vw', maxWidth: '100vw' }}
        destroyOnClose
        onClose={() => setShowDrawer(false)}
      >
        {selectedNode && selectedNode.name}
      </Drawer> */}
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

// function tagIcon(type) {
//   return require(`@/assets/${type.toUpperCase()}.png`);
// }
