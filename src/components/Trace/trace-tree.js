import Trace from './d3-trace';
import React, { useRef, useEffect } from 'react';
import { Spin } from 'antd';
export default function TraceTree({ spans, onSelect }) {
  const d3tree = useRef();
  const trace = useRef(null);
  useEffect(() => {
    trace.current = new Trace(d3tree.current);
    return () => {
      trace.current.destroy();
    };
  }, []);
  useEffect(() => {
    trace.current.addSelectListener(onSelect);
  }, [onSelect]);

  useEffect(() => {
    const spanTree = buildTree(spans);
    trace.current.render(spanTree, spans);

    let timeout = null;
    const resizeListener = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        trace.current.resize();
        trace.current.render(spanTree, spans);
      }, 1000);
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [spans]);

  return (
    <Spin spinning={!spans.length} delay={500} size="large">
      <div ref={d3tree} />
    </Spin>
  );
}

function buildTree(spans) {
  const root = { label: 'TRACE_ROOT', children: [] };
  const map = {};
  spans.forEach(span => {
    span.children = [];
    span.label = span.endpointName || 'no operation name';
    const { segmentId, spanId } = span;
    if (!map[segmentId]) {
      map[segmentId] = {};
    }
    map[segmentId][spanId] = span;
  });

  for (let segmentId in map) {
    const currentSegment = map[segmentId];
    for (let spanId in currentSegment) {
      const currentSpan = currentSegment[spanId];
      const {
        parentSpanId,
        refs: [ref],
      } = currentSpan;
      if (parentSpanId !== -1) {
        currentSegment[parentSpanId].children.push(currentSpan);
      } else if (ref) {
        const { parentSegmentId, parentSpanId } = ref;
        if (map[parentSegmentId] && map[parentSegmentId][parentSpanId]) {
          map[parentSegmentId][parentSpanId].children.push(currentSpan);
        } else if (parentSegmentId === undefined || parentSpanId === undefined) {
          root.children.push(currentSpan);
        }
      } else {
        root.children.push(currentSpan);
      }
    }
  }

  function traversal(span) {
    if (span.children) {
      span.children.sort((a, b) => {
        if (span.segmentId === a.segmentId && span.segmentId === b.segmentId) {
          return a.spanId - b.spanId;
        } else if (span.segmentId === a.segmentId) {
          return -1;
        } else if (span.segmentId === b.segmentId) {
          return 1;
        } else {
          return 0;
        }
      });
      span.dur = getSelfDuration(span);
      span.children.forEach(i => traversal(i));
    }
  }

  root.children.forEach(span => {
    traversal(span);
  });
  return root;
}

function getSelfDuration(span) {
  let durations = [[span.startTime, span.endTime]];
  span.children.forEach(child => {
    const temp = [];
    for (let duration of durations) {
      if (duration[1] < child.startTime || duration[0] > child.endTime) {
        temp.push(duration);
        continue;
      }
      if (child.startTime > duration[0]) {
        temp.push([duration[0], child.startTime - 1]);
      }
      if (child.endTime < duration[1]) {
        temp.push([child.endTime + 1, duration[1]]);
      }
    }
    durations = temp;
  });
  return durations.reduce((pre, [startTime, endTime]) => pre + endTime - startTime, 0);
}
