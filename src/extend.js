import { interface, implements } from 'sweet-interfaces';
import { Functor } from './functor';
import { Category } from './category';

interface Extend extends Functor {
  // extend :: Extend w => w a ~> (w a -> b) -> w b
  extend(f) {
    return this[Extend.duplicate]()[Functor.map](f);
  }

  // duplicate :: Extend w => w a ~> w (w a)
  duplicate() {
    return this[Extend.extend](Function[Category.id]);
  }
}
// TODO: change to default export once sweet-js/sweet-core/issues/620 ships
export { Extend };

const { extend, duplicate } = Extend;

Array.prototype[extend] = function extend(f) {
  return this.map((_, idx, xs) => f(xs.slice(idx)));
};
Array.prototype[duplicate] = function duplicate() {
  return this.map((_, idx, xs) => xs.slice(idx));
};
Array implements Extend;

Function.prototype[extend] = function extend(f) {
  return x => f(y => this(x.concat(y)));
};
Function.prototype[duplicate] = function duplicate() {
  return x => y => this(x.concat(y));
};
Function implements Extend;
