import traces from './traces.json';
import spans1 from './spans1.json';
import spans2 from './spans2.json';

const spans = [spans1, spans2];
export default {
  'POST /aiops/trace/trace': (req, res) => {
    const {
      traceState,
      minTraceDuration,
      maxTraceDuration,
      queryOrder,
      paging: { pageNum, pageSize },
    } = req.body;
    let myTraces = [...traces];
    switch (String(traceState)) {
      case 'SUCCESS':
        myTraces = myTraces.filter(val => !val.isError);
        break;
      case 'ERROR':
        myTraces = myTraces.filter(val => val.isError);
        break;
    }
    if (minTraceDuration) {
      myTraces = myTraces.filter(val => val.duration >= minTraceDuration);
    }
    if (maxTraceDuration) {
      myTraces = myTraces.filter(val => val.duration <= maxTraceDuration);
    }
    switch (String(queryOrder)) {
      case 'BY_START_TIME':
        myTraces.sort((a, b) => b.start - a.start);
        break;
      case 'BY_DURATION':
        myTraces.sort((a, b) => b.duration - a.duration);
        break;
    }
    res.end(
      JSON.stringify({
        total: myTraces.length,
        traces: myTraces.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      }),
    );
  },
  'GET /aiops/trace/span': (() => {
    let index = 0;
    return (query, res) => {
      index = (index + 1) % spans.length;
      res.end(JSON.stringify(spans[index]));
    };
  })(),
};
