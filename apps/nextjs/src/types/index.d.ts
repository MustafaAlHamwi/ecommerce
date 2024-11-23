import type { z } from "zod";

import type { RouterOutputs } from "@acme/api";

//TuplifyUnion type will convert union type to array of the union to make sure all types are in-sync between the prisma schema and front-end
type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
type LastOf<T> =
  UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
    ? R
    : never;
type Push<T extends unknown[], V> = [...T, V];

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
export type EmailDetailsType = RouterOutputs["auth"]["isTrustedEmailProvider"];
