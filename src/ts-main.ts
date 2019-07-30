/*
 * @Author: saber2pr
 * @Date: 2019-07-30 14:00:58
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-07-30 14:01:42
 */

type Monad<T> = { readonly _wrapped_: () => T };

type pure = <T>(a: T) => Monad<T>;
const pure: <T>(a: T) => Monad<T> = value => ({ _wrapped_: () => value });

type join = <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B>;
const join: <A, B>(m: Monad<A>, f: (a: A) => Monad<B>) => Monad<B> = (m, f) =>
  f(m._wrapped_());

type liftA = <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B>;
const liftA: <A, B>(m: Monad<A>, f: (a: A) => B) => Monad<B> = (m, f) =>
  pure(f(m._wrapped_()));

const fmap = liftA;

type async_init = () => Monad<number>;
const async_init: () => Monad<number> = () => pure(1);

type async_join_add = (m: Monad<number>) => Monad<number>;
const async_join_add: (m: Monad<number>) => Monad<number> = m =>
  join(m, a => pure(a + 1));

type async_lift_add = (m: Monad<number>) => Monad<number>;
const async_lift_add: (m: Monad<number>) => Monad<number> = m =>
  liftA(m, a => a + 1);

type async_fmap_add = (m: Monad<number>) => Monad<number>;
const async_fmap_add: (m: Monad<number>) => Monad<number> = m =>
  fmap(m, a => a + 1);

const compose: <A, R1, R2>(
  f2: (a: R1) => R2,
  f1: (a: A) => R1
) => (a: A) => R2 = (f2, f1) => a => f2(f1(a));

function main() {
  // const a = async_fmap_add(
  //   async_lift_add(async_join_add(async_init()))
  // )._wrapped_();

  const a = compose(
    async_fmap_add,
    compose(
      async_lift_add,
      async_join_add
    )
  )(async_init())._wrapped_();

  return pure(() => console.log(a));
}

main()._wrapped_()();
