import Trace from './d3-trace';
import { useRef, useEffect } from 'react';
export default function TraceTree({ spans, onSelect }) {
  const tree = useRef();
  const trace = useRef();
  useEffect(() => {
    trace.current = new Trace(tree.current);
  }, []);
  useEffect(() => {
    trace.current.addSelectListener(onSelect);
  }, [onSelect]);

  useEffect(() => {
    trace.current.render(buildTree(spans), spans);
  }, [spans]);
  return <div ref={tree}></div>;
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
