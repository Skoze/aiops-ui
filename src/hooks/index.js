import moment from 'moment';
import { useState, useCallback, useMemo } from 'react';

const steps = ['MONTH', 'DAY', 'HOUR', 'MINUTE'];

const pattern = {
  MONTH: 'YYYY-MM',
  DAY: 'YYYY-MM-DD',
  HOUR: 'YYYY-MM-DD HH',
  MINUTE: 'YYYY-MM-DD HHmm',
};

function getDuration([fromMoment, toMoment]) {
  const diff = moment.duration(toMoment.diff(fromMoment));
  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    const count = diff[`as${step[0] + step.slice(1).toLowerCase()}s`]();
    if (count >= 4 || index === steps.length - 1) {
      return {
        start: fromMoment.format(pattern[step]),
        end: toMoment.format(pattern[step]),
        step,
      };
    }
  }
}

export function useDuration(initRange = [moment().subtract(15, 'm'), moment()]) {
  const [range, setRange] = useState(initRange);

  const duration = useMemo(() => {
    console.log('change');
    return getDuration(range);
  }, [range]);

  const refresh = useCallback(() => {
    setRange(range => {
      const [fromMoment, toMoment] = range;
      const delta = moment.duration(moment().diff(toMoment));
      return [moment(fromMoment).add(delta), moment(toMoment).add(delta)];
    });
  }, []);

  const changeDuration = useCallback(([newFromMoment, newToMoment]) => {
    setRange(range => {
      const [fromMoment, toMoment] = range;
      if (fromMoment.isSame(newFromMoment) && toMoment.isSame(newToMoment)) {
        return range;
      } else {
        return [newFromMoment, newToMoment];
      }
    });
  }, []);
  return { duration, range, refresh, changeDuration };
}
