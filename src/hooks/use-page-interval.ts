import { useRef } from 'react';
import { useLoad, useUnload } from 'react-native-lifecycle';

export interface PageIntervalOptions {
  /**
   * setInterval 是否启用
   * @default true
   */
  enabled?: boolean;
}

export interface PageInterval {
  /**
   * 设置 setInterval 是否启用
   * @param enabled
   */
  setEnabled: (enabled: boolean) => void;
}

/**
 * 页面定时器，页面释放时释放
 * @param {function} fn
 * @param {number} ms 毫秒 default RESULTS.GRANTED
 * @param {object} options
 * @param {boolean} options.enabled 是否启用 default true
 * @public
 */
export default (
  fn: () => void,
  ms: number,
  options: PageIntervalOptions = {},
): PageInterval => {
  const { enabled = true } = options;
  const i = useRef<number | null>(null);
  const isEnabled = useRef<boolean>(enabled);

  useLoad(() => {
    i.current = setInterval(() => {
      if (isEnabled.current) {
        fn();
      }
    }, ms);
  });

  useUnload(() => {
    if (i.current) {
      clearInterval(i.current);
    }
  });

  const setEnabled = (enabled: boolean) => {
    isEnabled.current = enabled;
  };

  return {
    setEnabled,
  };
};
