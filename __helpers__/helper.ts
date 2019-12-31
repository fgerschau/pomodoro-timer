import { ShallowWrapper, HTMLAttributes } from 'enzyme';

export function getByTestId<P = HTMLAttributes>(
  wrapper: ShallowWrapper<any, any>,
  id: string,
): ShallowWrapper<P, any, any> {
  return wrapper.find(`[data-test-id="${id}"]`) as any as ShallowWrapper<P>;
}
