import moment, { Moment } from 'moment';
import { useState, useCallback, useMemo } from 'react';
import { Duration, Step } from '@/components/Dashboard/type';

const steps = [Step.MONTH, Step.DAY, Step.HOUR, Step.MINUTE];

const pattern = {
  [Step.MONTH]: 'YYYY-MM',
  [Step.DAY]: 'YYYY-MM-DD',
  [Step.HOUR]: 'YYYY-MM-DD HH',
  [Step.MINUTE]: 'YYYY-MM-DD HHmm',
};

function getDuration([fromMoment, toMoment]): Duration {
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

function isDuration(val: Duration | [Moment, Moment]): val is Duration {
  return !!((<Duration>val).start && (<Duration>val).end && (<Duration>val).step);
}
function toMomentArr(val: Duration | [Moment, Moment]): [Moment, Moment] {
  if (isDuration(val)) {
    const { start, end, step } = val;
    return [moment(start, pattern[step]), moment(end, pattern[step])];
  } else {
    return val;
  }
}
function useDuration(init: Duration | [Moment, Moment] = [moment().subtract(15, 'm'), moment()]) {
  const [range, setRange] = useState(toMomentArr(init));

  const duration = useMemo(() => {
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

export { useDuration, getDuration };
