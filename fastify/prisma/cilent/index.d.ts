
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model team
 * 
 */
export type team = $Result.DefaultSelection<Prisma.$teamPayload>
/**
 * Model reagent
 * 
 */
export type reagent = $Result.DefaultSelection<Prisma.$reagentPayload>
/**
 * Model lot
 * 
 */
export type lot = $Result.DefaultSelection<Prisma.$lotPayload>
/**
 * Model operation
 * 
 */
export type operation = $Result.DefaultSelection<Prisma.$operationPayload>
/**
 * Model inventory
 * 
 */
export type inventory = $Result.DefaultSelection<Prisma.$inventoryPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Teams
 * const teams = await prisma.team.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Teams
   * const teams = await prisma.team.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.team`: Exposes CRUD operations for the **team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.teamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reagent`: Exposes CRUD operations for the **reagent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reagents
    * const reagents = await prisma.reagent.findMany()
    * ```
    */
  get reagent(): Prisma.reagentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lot`: Exposes CRUD operations for the **lot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lots
    * const lots = await prisma.lot.findMany()
    * ```
    */
  get lot(): Prisma.lotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.operation`: Exposes CRUD operations for the **operation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Operations
    * const operations = await prisma.operation.findMany()
    * ```
    */
  get operation(): Prisma.operationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventory`: Exposes CRUD operations for the **inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.inventoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    team: 'team',
    reagent: 'reagent',
    lot: 'lot',
    operation: 'operation',
    inventory: 'inventory',
    user: 'user'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "team" | "reagent" | "lot" | "operation" | "inventory" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      team: {
        payload: Prisma.$teamPayload<ExtArgs>
        fields: Prisma.teamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.teamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.teamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          findFirst: {
            args: Prisma.teamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.teamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          findMany: {
            args: Prisma.teamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>[]
          }
          create: {
            args: Prisma.teamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          createMany: {
            args: Prisma.teamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.teamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>[]
          }
          delete: {
            args: Prisma.teamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          update: {
            args: Prisma.teamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          deleteMany: {
            args: Prisma.teamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.teamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.teamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>[]
          }
          upsert: {
            args: Prisma.teamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.teamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.teamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      reagent: {
        payload: Prisma.$reagentPayload<ExtArgs>
        fields: Prisma.reagentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reagentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reagentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          findFirst: {
            args: Prisma.reagentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reagentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          findMany: {
            args: Prisma.reagentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>[]
          }
          create: {
            args: Prisma.reagentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          createMany: {
            args: Prisma.reagentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.reagentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>[]
          }
          delete: {
            args: Prisma.reagentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          update: {
            args: Prisma.reagentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          deleteMany: {
            args: Prisma.reagentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reagentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.reagentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>[]
          }
          upsert: {
            args: Prisma.reagentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reagentPayload>
          }
          aggregate: {
            args: Prisma.ReagentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReagent>
          }
          groupBy: {
            args: Prisma.reagentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReagentGroupByOutputType>[]
          }
          count: {
            args: Prisma.reagentCountArgs<ExtArgs>
            result: $Utils.Optional<ReagentCountAggregateOutputType> | number
          }
        }
      }
      lot: {
        payload: Prisma.$lotPayload<ExtArgs>
        fields: Prisma.lotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.lotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.lotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          findFirst: {
            args: Prisma.lotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.lotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          findMany: {
            args: Prisma.lotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>[]
          }
          create: {
            args: Prisma.lotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          createMany: {
            args: Prisma.lotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.lotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>[]
          }
          delete: {
            args: Prisma.lotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          update: {
            args: Prisma.lotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          deleteMany: {
            args: Prisma.lotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.lotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.lotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>[]
          }
          upsert: {
            args: Prisma.lotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lotPayload>
          }
          aggregate: {
            args: Prisma.LotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLot>
          }
          groupBy: {
            args: Prisma.lotGroupByArgs<ExtArgs>
            result: $Utils.Optional<LotGroupByOutputType>[]
          }
          count: {
            args: Prisma.lotCountArgs<ExtArgs>
            result: $Utils.Optional<LotCountAggregateOutputType> | number
          }
        }
      }
      operation: {
        payload: Prisma.$operationPayload<ExtArgs>
        fields: Prisma.operationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.operationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.operationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          findFirst: {
            args: Prisma.operationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.operationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          findMany: {
            args: Prisma.operationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>[]
          }
          create: {
            args: Prisma.operationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          createMany: {
            args: Prisma.operationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.operationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>[]
          }
          delete: {
            args: Prisma.operationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          update: {
            args: Prisma.operationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          deleteMany: {
            args: Prisma.operationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.operationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.operationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>[]
          }
          upsert: {
            args: Prisma.operationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$operationPayload>
          }
          aggregate: {
            args: Prisma.OperationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOperation>
          }
          groupBy: {
            args: Prisma.operationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OperationGroupByOutputType>[]
          }
          count: {
            args: Prisma.operationCountArgs<ExtArgs>
            result: $Utils.Optional<OperationCountAggregateOutputType> | number
          }
        }
      }
      inventory: {
        payload: Prisma.$inventoryPayload<ExtArgs>
        fields: Prisma.inventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.inventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.inventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          findFirst: {
            args: Prisma.inventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.inventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          findMany: {
            args: Prisma.inventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>[]
          }
          create: {
            args: Prisma.inventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          createMany: {
            args: Prisma.inventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.inventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>[]
          }
          delete: {
            args: Prisma.inventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          update: {
            args: Prisma.inventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          deleteMany: {
            args: Prisma.inventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.inventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.inventoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>[]
          }
          upsert: {
            args: Prisma.inventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.inventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.inventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.userCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.userUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    team?: teamOmit
    reagent?: reagentOmit
    lot?: lotOmit
    operation?: operationOmit
    inventory?: inventoryOmit
    user?: userOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    reagent: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | TeamCountOutputTypeCountReagentArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountReagentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reagentWhereInput
  }


  /**
   * Count Type ReagentCountOutputType
   */

  export type ReagentCountOutputType = {
    lot: number
    operation: number
    inventory: number
  }

  export type ReagentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | ReagentCountOutputTypeCountLotArgs
    operation?: boolean | ReagentCountOutputTypeCountOperationArgs
    inventory?: boolean | ReagentCountOutputTypeCountInventoryArgs
  }

  // Custom InputTypes
  /**
   * ReagentCountOutputType without action
   */
  export type ReagentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReagentCountOutputType
     */
    select?: ReagentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReagentCountOutputType without action
   */
  export type ReagentCountOutputTypeCountLotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lotWhereInput
  }

  /**
   * ReagentCountOutputType without action
   */
  export type ReagentCountOutputTypeCountOperationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: operationWhereInput
  }

  /**
   * ReagentCountOutputType without action
   */
  export type ReagentCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventoryWhereInput
  }


  /**
   * Count Type LotCountOutputType
   */

  export type LotCountOutputType = {
    operation: number
    inventory: number
  }

  export type LotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operation?: boolean | LotCountOutputTypeCountOperationArgs
    inventory?: boolean | LotCountOutputTypeCountInventoryArgs
  }

  // Custom InputTypes
  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotCountOutputType
     */
    select?: LotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountOperationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: operationWhereInput
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventoryWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    operation: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operation?: boolean | UserCountOutputTypeCountOperationArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOperationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: operationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamAvgAggregateOutputType = {
    id: number | null
  }

  export type TeamSumAggregateOutputType = {
    id: number | null
  }

  export type TeamMinAggregateOutputType = {
    id: number | null
    name: string | null
    using: boolean | null
    phone: string | null
    note: string | null
  }

  export type TeamMaxAggregateOutputType = {
    id: number | null
    name: string | null
    using: boolean | null
    phone: string | null
    note: string | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    using: number
    phone: number
    note: number
    _all: number
  }


  export type TeamAvgAggregateInputType = {
    id?: true
  }

  export type TeamSumAggregateInputType = {
    id?: true
  }

  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    using?: true
    phone?: true
    note?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    using?: true
    phone?: true
    note?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    using?: true
    phone?: true
    note?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which team to aggregate.
     */
    where?: teamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teams to fetch.
     */
    orderBy?: teamOrderByWithRelationInput | teamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: teamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type teamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: teamWhereInput
    orderBy?: teamOrderByWithAggregationInput | teamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: teamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _avg?: TeamAvgAggregateInputType
    _sum?: TeamSumAggregateInputType
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: number
    name: string
    using: boolean
    phone: string
    note: string
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends teamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type teamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    using?: boolean
    phone?: boolean
    note?: boolean
    reagent?: boolean | team$reagentArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type teamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    using?: boolean
    phone?: boolean
    note?: boolean
  }, ExtArgs["result"]["team"]>

  export type teamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    using?: boolean
    phone?: boolean
    note?: boolean
  }, ExtArgs["result"]["team"]>

  export type teamSelectScalar = {
    id?: boolean
    name?: boolean
    using?: boolean
    phone?: boolean
    note?: boolean
  }

  export type teamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "using" | "phone" | "note", ExtArgs["result"]["team"]>
  export type teamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | team$reagentArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type teamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type teamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $teamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "team"
    objects: {
      reagent: Prisma.$reagentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      using: boolean
      phone: string
      note: string
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type teamGetPayload<S extends boolean | null | undefined | teamDefaultArgs> = $Result.GetResult<Prisma.$teamPayload, S>

  type teamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<teamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface teamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['team'], meta: { name: 'team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {teamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends teamFindUniqueArgs>(args: SelectSubset<T, teamFindUniqueArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {teamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends teamFindUniqueOrThrowArgs>(args: SelectSubset<T, teamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends teamFindFirstArgs>(args?: SelectSubset<T, teamFindFirstArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends teamFindFirstOrThrowArgs>(args?: SelectSubset<T, teamFindFirstOrThrowArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends teamFindManyArgs>(args?: SelectSubset<T, teamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {teamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends teamCreateArgs>(args: SelectSubset<T, teamCreateArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {teamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends teamCreateManyArgs>(args?: SelectSubset<T, teamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {teamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends teamCreateManyAndReturnArgs>(args?: SelectSubset<T, teamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {teamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends teamDeleteArgs>(args: SelectSubset<T, teamDeleteArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {teamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends teamUpdateArgs>(args: SelectSubset<T, teamUpdateArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {teamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends teamDeleteManyArgs>(args?: SelectSubset<T, teamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends teamUpdateManyArgs>(args: SelectSubset<T, teamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {teamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends teamUpdateManyAndReturnArgs>(args: SelectSubset<T, teamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {teamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends teamUpsertArgs>(args: SelectSubset<T, teamUpsertArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends teamCountArgs>(
      args?: Subset<T, teamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends teamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: teamGroupByArgs['orderBy'] }
        : { orderBy?: teamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, teamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the team model
   */
  readonly fields: teamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__teamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reagent<T extends team$reagentArgs<ExtArgs> = {}>(args?: Subset<T, team$reagentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the team model
   */
  interface teamFieldRefs {
    readonly id: FieldRef<"team", 'Int'>
    readonly name: FieldRef<"team", 'String'>
    readonly using: FieldRef<"team", 'Boolean'>
    readonly phone: FieldRef<"team", 'String'>
    readonly note: FieldRef<"team", 'String'>
  }
    

  // Custom InputTypes
  /**
   * team findUnique
   */
  export type teamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter, which team to fetch.
     */
    where: teamWhereUniqueInput
  }

  /**
   * team findUniqueOrThrow
   */
  export type teamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter, which team to fetch.
     */
    where: teamWhereUniqueInput
  }

  /**
   * team findFirst
   */
  export type teamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter, which team to fetch.
     */
    where?: teamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teams to fetch.
     */
    orderBy?: teamOrderByWithRelationInput | teamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for teams.
     */
    cursor?: teamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * team findFirstOrThrow
   */
  export type teamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter, which team to fetch.
     */
    where?: teamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teams to fetch.
     */
    orderBy?: teamOrderByWithRelationInput | teamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for teams.
     */
    cursor?: teamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * team findMany
   */
  export type teamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter, which teams to fetch.
     */
    where?: teamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teams to fetch.
     */
    orderBy?: teamOrderByWithRelationInput | teamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing teams.
     */
    cursor?: teamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * team create
   */
  export type teamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * The data needed to create a team.
     */
    data: XOR<teamCreateInput, teamUncheckedCreateInput>
  }

  /**
   * team createMany
   */
  export type teamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many teams.
     */
    data: teamCreateManyInput | teamCreateManyInput[]
  }

  /**
   * team createManyAndReturn
   */
  export type teamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * The data used to create many teams.
     */
    data: teamCreateManyInput | teamCreateManyInput[]
  }

  /**
   * team update
   */
  export type teamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * The data needed to update a team.
     */
    data: XOR<teamUpdateInput, teamUncheckedUpdateInput>
    /**
     * Choose, which team to update.
     */
    where: teamWhereUniqueInput
  }

  /**
   * team updateMany
   */
  export type teamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update teams.
     */
    data: XOR<teamUpdateManyMutationInput, teamUncheckedUpdateManyInput>
    /**
     * Filter which teams to update
     */
    where?: teamWhereInput
    /**
     * Limit how many teams to update.
     */
    limit?: number
  }

  /**
   * team updateManyAndReturn
   */
  export type teamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * The data used to update teams.
     */
    data: XOR<teamUpdateManyMutationInput, teamUncheckedUpdateManyInput>
    /**
     * Filter which teams to update
     */
    where?: teamWhereInput
    /**
     * Limit how many teams to update.
     */
    limit?: number
  }

  /**
   * team upsert
   */
  export type teamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * The filter to search for the team to update in case it exists.
     */
    where: teamWhereUniqueInput
    /**
     * In case the team found by the `where` argument doesn't exist, create a new team with this data.
     */
    create: XOR<teamCreateInput, teamUncheckedCreateInput>
    /**
     * In case the team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<teamUpdateInput, teamUncheckedUpdateInput>
  }

  /**
   * team delete
   */
  export type teamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
    /**
     * Filter which team to delete.
     */
    where: teamWhereUniqueInput
  }

  /**
   * team deleteMany
   */
  export type teamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which teams to delete
     */
    where?: teamWhereInput
    /**
     * Limit how many teams to delete.
     */
    limit?: number
  }

  /**
   * team.reagent
   */
  export type team$reagentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    where?: reagentWhereInput
    orderBy?: reagentOrderByWithRelationInput | reagentOrderByWithRelationInput[]
    cursor?: reagentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReagentScalarFieldEnum | ReagentScalarFieldEnum[]
  }

  /**
   * team without action
   */
  export type teamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the team
     */
    select?: teamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the team
     */
    omit?: teamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teamInclude<ExtArgs> | null
  }


  /**
   * Model reagent
   */

  export type AggregateReagent = {
    _count: ReagentCountAggregateOutputType | null
    _avg: ReagentAvgAggregateOutputType | null
    _sum: ReagentSumAggregateOutputType | null
    _min: ReagentMinAggregateOutputType | null
    _max: ReagentMaxAggregateOutputType | null
  }

  export type ReagentAvgAggregateOutputType = {
    id: number | null
    warn_number: number | null
    price: number | null
    teamid: number | null
    warn_days: number | null
  }

  export type ReagentSumAggregateOutputType = {
    id: number | null
    warn_number: number | null
    price: number | null
    teamid: number | null
    warn_days: number | null
  }

  export type ReagentMinAggregateOutputType = {
    id: number | null
    name: string | null
    specifications: string | null
    warn_number: number | null
    price: number | null
    creation_time: Date | null
    storage_condition: string | null
    teamid: number | null
    using: boolean | null
    warn_days: number | null
  }

  export type ReagentMaxAggregateOutputType = {
    id: number | null
    name: string | null
    specifications: string | null
    warn_number: number | null
    price: number | null
    creation_time: Date | null
    storage_condition: string | null
    teamid: number | null
    using: boolean | null
    warn_days: number | null
  }

  export type ReagentCountAggregateOutputType = {
    id: number
    name: number
    specifications: number
    warn_number: number
    price: number
    creation_time: number
    storage_condition: number
    teamid: number
    using: number
    warn_days: number
    _all: number
  }


  export type ReagentAvgAggregateInputType = {
    id?: true
    warn_number?: true
    price?: true
    teamid?: true
    warn_days?: true
  }

  export type ReagentSumAggregateInputType = {
    id?: true
    warn_number?: true
    price?: true
    teamid?: true
    warn_days?: true
  }

  export type ReagentMinAggregateInputType = {
    id?: true
    name?: true
    specifications?: true
    warn_number?: true
    price?: true
    creation_time?: true
    storage_condition?: true
    teamid?: true
    using?: true
    warn_days?: true
  }

  export type ReagentMaxAggregateInputType = {
    id?: true
    name?: true
    specifications?: true
    warn_number?: true
    price?: true
    creation_time?: true
    storage_condition?: true
    teamid?: true
    using?: true
    warn_days?: true
  }

  export type ReagentCountAggregateInputType = {
    id?: true
    name?: true
    specifications?: true
    warn_number?: true
    price?: true
    creation_time?: true
    storage_condition?: true
    teamid?: true
    using?: true
    warn_days?: true
    _all?: true
  }

  export type ReagentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reagent to aggregate.
     */
    where?: reagentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reagents to fetch.
     */
    orderBy?: reagentOrderByWithRelationInput | reagentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reagentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reagents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reagents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reagents
    **/
    _count?: true | ReagentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReagentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReagentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReagentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReagentMaxAggregateInputType
  }

  export type GetReagentAggregateType<T extends ReagentAggregateArgs> = {
        [P in keyof T & keyof AggregateReagent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReagent[P]>
      : GetScalarType<T[P], AggregateReagent[P]>
  }




  export type reagentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reagentWhereInput
    orderBy?: reagentOrderByWithAggregationInput | reagentOrderByWithAggregationInput[]
    by: ReagentScalarFieldEnum[] | ReagentScalarFieldEnum
    having?: reagentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReagentCountAggregateInputType | true
    _avg?: ReagentAvgAggregateInputType
    _sum?: ReagentSumAggregateInputType
    _min?: ReagentMinAggregateInputType
    _max?: ReagentMaxAggregateInputType
  }

  export type ReagentGroupByOutputType = {
    id: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time: Date
    storage_condition: string
    teamid: number
    using: boolean
    warn_days: number
    _count: ReagentCountAggregateOutputType | null
    _avg: ReagentAvgAggregateOutputType | null
    _sum: ReagentSumAggregateOutputType | null
    _min: ReagentMinAggregateOutputType | null
    _max: ReagentMaxAggregateOutputType | null
  }

  type GetReagentGroupByPayload<T extends reagentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReagentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReagentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReagentGroupByOutputType[P]>
            : GetScalarType<T[P], ReagentGroupByOutputType[P]>
        }
      >
    >


  export type reagentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    specifications?: boolean
    warn_number?: boolean
    price?: boolean
    creation_time?: boolean
    storage_condition?: boolean
    teamid?: boolean
    using?: boolean
    warn_days?: boolean
    team?: boolean | teamDefaultArgs<ExtArgs>
    lot?: boolean | reagent$lotArgs<ExtArgs>
    operation?: boolean | reagent$operationArgs<ExtArgs>
    inventory?: boolean | reagent$inventoryArgs<ExtArgs>
    _count?: boolean | ReagentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reagent"]>

  export type reagentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    specifications?: boolean
    warn_number?: boolean
    price?: boolean
    creation_time?: boolean
    storage_condition?: boolean
    teamid?: boolean
    using?: boolean
    warn_days?: boolean
    team?: boolean | teamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reagent"]>

  export type reagentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    specifications?: boolean
    warn_number?: boolean
    price?: boolean
    creation_time?: boolean
    storage_condition?: boolean
    teamid?: boolean
    using?: boolean
    warn_days?: boolean
    team?: boolean | teamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reagent"]>

  export type reagentSelectScalar = {
    id?: boolean
    name?: boolean
    specifications?: boolean
    warn_number?: boolean
    price?: boolean
    creation_time?: boolean
    storage_condition?: boolean
    teamid?: boolean
    using?: boolean
    warn_days?: boolean
  }

  export type reagentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "specifications" | "warn_number" | "price" | "creation_time" | "storage_condition" | "teamid" | "using" | "warn_days", ExtArgs["result"]["reagent"]>
  export type reagentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | teamDefaultArgs<ExtArgs>
    lot?: boolean | reagent$lotArgs<ExtArgs>
    operation?: boolean | reagent$operationArgs<ExtArgs>
    inventory?: boolean | reagent$inventoryArgs<ExtArgs>
    _count?: boolean | ReagentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type reagentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | teamDefaultArgs<ExtArgs>
  }
  export type reagentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | teamDefaultArgs<ExtArgs>
  }

  export type $reagentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "reagent"
    objects: {
      team: Prisma.$teamPayload<ExtArgs>
      lot: Prisma.$lotPayload<ExtArgs>[]
      operation: Prisma.$operationPayload<ExtArgs>[]
      inventory: Prisma.$inventoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      specifications: string
      warn_number: number
      price: number
      creation_time: Date
      storage_condition: string
      teamid: number
      using: boolean
      warn_days: number
    }, ExtArgs["result"]["reagent"]>
    composites: {}
  }

  type reagentGetPayload<S extends boolean | null | undefined | reagentDefaultArgs> = $Result.GetResult<Prisma.$reagentPayload, S>

  type reagentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<reagentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReagentCountAggregateInputType | true
    }

  export interface reagentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['reagent'], meta: { name: 'reagent' } }
    /**
     * Find zero or one Reagent that matches the filter.
     * @param {reagentFindUniqueArgs} args - Arguments to find a Reagent
     * @example
     * // Get one Reagent
     * const reagent = await prisma.reagent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reagentFindUniqueArgs>(args: SelectSubset<T, reagentFindUniqueArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reagent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reagentFindUniqueOrThrowArgs} args - Arguments to find a Reagent
     * @example
     * // Get one Reagent
     * const reagent = await prisma.reagent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reagentFindUniqueOrThrowArgs>(args: SelectSubset<T, reagentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reagent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentFindFirstArgs} args - Arguments to find a Reagent
     * @example
     * // Get one Reagent
     * const reagent = await prisma.reagent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reagentFindFirstArgs>(args?: SelectSubset<T, reagentFindFirstArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reagent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentFindFirstOrThrowArgs} args - Arguments to find a Reagent
     * @example
     * // Get one Reagent
     * const reagent = await prisma.reagent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reagentFindFirstOrThrowArgs>(args?: SelectSubset<T, reagentFindFirstOrThrowArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reagents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reagents
     * const reagents = await prisma.reagent.findMany()
     * 
     * // Get first 10 Reagents
     * const reagents = await prisma.reagent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reagentWithIdOnly = await prisma.reagent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends reagentFindManyArgs>(args?: SelectSubset<T, reagentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reagent.
     * @param {reagentCreateArgs} args - Arguments to create a Reagent.
     * @example
     * // Create one Reagent
     * const Reagent = await prisma.reagent.create({
     *   data: {
     *     // ... data to create a Reagent
     *   }
     * })
     * 
     */
    create<T extends reagentCreateArgs>(args: SelectSubset<T, reagentCreateArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reagents.
     * @param {reagentCreateManyArgs} args - Arguments to create many Reagents.
     * @example
     * // Create many Reagents
     * const reagent = await prisma.reagent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reagentCreateManyArgs>(args?: SelectSubset<T, reagentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reagents and returns the data saved in the database.
     * @param {reagentCreateManyAndReturnArgs} args - Arguments to create many Reagents.
     * @example
     * // Create many Reagents
     * const reagent = await prisma.reagent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reagents and only return the `id`
     * const reagentWithIdOnly = await prisma.reagent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends reagentCreateManyAndReturnArgs>(args?: SelectSubset<T, reagentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reagent.
     * @param {reagentDeleteArgs} args - Arguments to delete one Reagent.
     * @example
     * // Delete one Reagent
     * const Reagent = await prisma.reagent.delete({
     *   where: {
     *     // ... filter to delete one Reagent
     *   }
     * })
     * 
     */
    delete<T extends reagentDeleteArgs>(args: SelectSubset<T, reagentDeleteArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reagent.
     * @param {reagentUpdateArgs} args - Arguments to update one Reagent.
     * @example
     * // Update one Reagent
     * const reagent = await prisma.reagent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reagentUpdateArgs>(args: SelectSubset<T, reagentUpdateArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reagents.
     * @param {reagentDeleteManyArgs} args - Arguments to filter Reagents to delete.
     * @example
     * // Delete a few Reagents
     * const { count } = await prisma.reagent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reagentDeleteManyArgs>(args?: SelectSubset<T, reagentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reagents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reagents
     * const reagent = await prisma.reagent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reagentUpdateManyArgs>(args: SelectSubset<T, reagentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reagents and returns the data updated in the database.
     * @param {reagentUpdateManyAndReturnArgs} args - Arguments to update many Reagents.
     * @example
     * // Update many Reagents
     * const reagent = await prisma.reagent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reagents and only return the `id`
     * const reagentWithIdOnly = await prisma.reagent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends reagentUpdateManyAndReturnArgs>(args: SelectSubset<T, reagentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reagent.
     * @param {reagentUpsertArgs} args - Arguments to update or create a Reagent.
     * @example
     * // Update or create a Reagent
     * const reagent = await prisma.reagent.upsert({
     *   create: {
     *     // ... data to create a Reagent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reagent we want to update
     *   }
     * })
     */
    upsert<T extends reagentUpsertArgs>(args: SelectSubset<T, reagentUpsertArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reagents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentCountArgs} args - Arguments to filter Reagents to count.
     * @example
     * // Count the number of Reagents
     * const count = await prisma.reagent.count({
     *   where: {
     *     // ... the filter for the Reagents we want to count
     *   }
     * })
    **/
    count<T extends reagentCountArgs>(
      args?: Subset<T, reagentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReagentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reagent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReagentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReagentAggregateArgs>(args: Subset<T, ReagentAggregateArgs>): Prisma.PrismaPromise<GetReagentAggregateType<T>>

    /**
     * Group by Reagent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reagentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends reagentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reagentGroupByArgs['orderBy'] }
        : { orderBy?: reagentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, reagentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReagentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the reagent model
   */
  readonly fields: reagentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for reagent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reagentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends teamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, teamDefaultArgs<ExtArgs>>): Prisma__teamClient<$Result.GetResult<Prisma.$teamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lot<T extends reagent$lotArgs<ExtArgs> = {}>(args?: Subset<T, reagent$lotArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    operation<T extends reagent$operationArgs<ExtArgs> = {}>(args?: Subset<T, reagent$operationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventory<T extends reagent$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, reagent$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the reagent model
   */
  interface reagentFieldRefs {
    readonly id: FieldRef<"reagent", 'Int'>
    readonly name: FieldRef<"reagent", 'String'>
    readonly specifications: FieldRef<"reagent", 'String'>
    readonly warn_number: FieldRef<"reagent", 'Int'>
    readonly price: FieldRef<"reagent", 'Int'>
    readonly creation_time: FieldRef<"reagent", 'DateTime'>
    readonly storage_condition: FieldRef<"reagent", 'String'>
    readonly teamid: FieldRef<"reagent", 'Int'>
    readonly using: FieldRef<"reagent", 'Boolean'>
    readonly warn_days: FieldRef<"reagent", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * reagent findUnique
   */
  export type reagentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter, which reagent to fetch.
     */
    where: reagentWhereUniqueInput
  }

  /**
   * reagent findUniqueOrThrow
   */
  export type reagentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter, which reagent to fetch.
     */
    where: reagentWhereUniqueInput
  }

  /**
   * reagent findFirst
   */
  export type reagentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter, which reagent to fetch.
     */
    where?: reagentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reagents to fetch.
     */
    orderBy?: reagentOrderByWithRelationInput | reagentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reagents.
     */
    cursor?: reagentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reagents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reagents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reagents.
     */
    distinct?: ReagentScalarFieldEnum | ReagentScalarFieldEnum[]
  }

  /**
   * reagent findFirstOrThrow
   */
  export type reagentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter, which reagent to fetch.
     */
    where?: reagentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reagents to fetch.
     */
    orderBy?: reagentOrderByWithRelationInput | reagentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reagents.
     */
    cursor?: reagentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reagents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reagents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reagents.
     */
    distinct?: ReagentScalarFieldEnum | ReagentScalarFieldEnum[]
  }

  /**
   * reagent findMany
   */
  export type reagentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter, which reagents to fetch.
     */
    where?: reagentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reagents to fetch.
     */
    orderBy?: reagentOrderByWithRelationInput | reagentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reagents.
     */
    cursor?: reagentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reagents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reagents.
     */
    skip?: number
    distinct?: ReagentScalarFieldEnum | ReagentScalarFieldEnum[]
  }

  /**
   * reagent create
   */
  export type reagentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * The data needed to create a reagent.
     */
    data: XOR<reagentCreateInput, reagentUncheckedCreateInput>
  }

  /**
   * reagent createMany
   */
  export type reagentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reagents.
     */
    data: reagentCreateManyInput | reagentCreateManyInput[]
  }

  /**
   * reagent createManyAndReturn
   */
  export type reagentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * The data used to create many reagents.
     */
    data: reagentCreateManyInput | reagentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * reagent update
   */
  export type reagentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * The data needed to update a reagent.
     */
    data: XOR<reagentUpdateInput, reagentUncheckedUpdateInput>
    /**
     * Choose, which reagent to update.
     */
    where: reagentWhereUniqueInput
  }

  /**
   * reagent updateMany
   */
  export type reagentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reagents.
     */
    data: XOR<reagentUpdateManyMutationInput, reagentUncheckedUpdateManyInput>
    /**
     * Filter which reagents to update
     */
    where?: reagentWhereInput
    /**
     * Limit how many reagents to update.
     */
    limit?: number
  }

  /**
   * reagent updateManyAndReturn
   */
  export type reagentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * The data used to update reagents.
     */
    data: XOR<reagentUpdateManyMutationInput, reagentUncheckedUpdateManyInput>
    /**
     * Filter which reagents to update
     */
    where?: reagentWhereInput
    /**
     * Limit how many reagents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * reagent upsert
   */
  export type reagentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * The filter to search for the reagent to update in case it exists.
     */
    where: reagentWhereUniqueInput
    /**
     * In case the reagent found by the `where` argument doesn't exist, create a new reagent with this data.
     */
    create: XOR<reagentCreateInput, reagentUncheckedCreateInput>
    /**
     * In case the reagent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reagentUpdateInput, reagentUncheckedUpdateInput>
  }

  /**
   * reagent delete
   */
  export type reagentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
    /**
     * Filter which reagent to delete.
     */
    where: reagentWhereUniqueInput
  }

  /**
   * reagent deleteMany
   */
  export type reagentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reagents to delete
     */
    where?: reagentWhereInput
    /**
     * Limit how many reagents to delete.
     */
    limit?: number
  }

  /**
   * reagent.lot
   */
  export type reagent$lotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    where?: lotWhereInput
    orderBy?: lotOrderByWithRelationInput | lotOrderByWithRelationInput[]
    cursor?: lotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * reagent.operation
   */
  export type reagent$operationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    where?: operationWhereInput
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    cursor?: operationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * reagent.inventory
   */
  export type reagent$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    where?: inventoryWhereInput
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    cursor?: inventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * reagent without action
   */
  export type reagentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reagent
     */
    select?: reagentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reagent
     */
    omit?: reagentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reagentInclude<ExtArgs> | null
  }


  /**
   * Model lot
   */

  export type AggregateLot = {
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  export type LotAvgAggregateOutputType = {
    id: number | null
    reagentid: number | null
  }

  export type LotSumAggregateOutputType = {
    id: number | null
    reagentid: number | null
  }

  export type LotMinAggregateOutputType = {
    id: number | null
    name: string | null
    creation_time: Date | null
    expiration_date: Date | null
    reagentid: number | null
    using: boolean | null
  }

  export type LotMaxAggregateOutputType = {
    id: number | null
    name: string | null
    creation_time: Date | null
    expiration_date: Date | null
    reagentid: number | null
    using: boolean | null
  }

  export type LotCountAggregateOutputType = {
    id: number
    name: number
    creation_time: number
    expiration_date: number
    reagentid: number
    using: number
    _all: number
  }


  export type LotAvgAggregateInputType = {
    id?: true
    reagentid?: true
  }

  export type LotSumAggregateInputType = {
    id?: true
    reagentid?: true
  }

  export type LotMinAggregateInputType = {
    id?: true
    name?: true
    creation_time?: true
    expiration_date?: true
    reagentid?: true
    using?: true
  }

  export type LotMaxAggregateInputType = {
    id?: true
    name?: true
    creation_time?: true
    expiration_date?: true
    reagentid?: true
    using?: true
  }

  export type LotCountAggregateInputType = {
    id?: true
    name?: true
    creation_time?: true
    expiration_date?: true
    reagentid?: true
    using?: true
    _all?: true
  }

  export type LotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lot to aggregate.
     */
    where?: lotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lots to fetch.
     */
    orderBy?: lotOrderByWithRelationInput | lotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: lotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned lots
    **/
    _count?: true | LotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LotMaxAggregateInputType
  }

  export type GetLotAggregateType<T extends LotAggregateArgs> = {
        [P in keyof T & keyof AggregateLot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLot[P]>
      : GetScalarType<T[P], AggregateLot[P]>
  }




  export type lotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lotWhereInput
    orderBy?: lotOrderByWithAggregationInput | lotOrderByWithAggregationInput[]
    by: LotScalarFieldEnum[] | LotScalarFieldEnum
    having?: lotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LotCountAggregateInputType | true
    _avg?: LotAvgAggregateInputType
    _sum?: LotSumAggregateInputType
    _min?: LotMinAggregateInputType
    _max?: LotMaxAggregateInputType
  }

  export type LotGroupByOutputType = {
    id: number
    name: string
    creation_time: Date
    expiration_date: Date
    reagentid: number
    using: boolean
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  type GetLotGroupByPayload<T extends lotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LotGroupByOutputType[P]>
            : GetScalarType<T[P], LotGroupByOutputType[P]>
        }
      >
    >


  export type lotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creation_time?: boolean
    expiration_date?: boolean
    reagentid?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    operation?: boolean | lot$operationArgs<ExtArgs>
    inventory?: boolean | lot$inventoryArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type lotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creation_time?: boolean
    expiration_date?: boolean
    reagentid?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type lotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    creation_time?: boolean
    expiration_date?: boolean
    reagentid?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type lotSelectScalar = {
    id?: boolean
    name?: boolean
    creation_time?: boolean
    expiration_date?: boolean
    reagentid?: boolean
    using?: boolean
  }

  export type lotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "creation_time" | "expiration_date" | "reagentid" | "using", ExtArgs["result"]["lot"]>
  export type lotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    operation?: boolean | lot$operationArgs<ExtArgs>
    inventory?: boolean | lot$inventoryArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type lotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
  }
  export type lotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
  }

  export type $lotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "lot"
    objects: {
      reagent: Prisma.$reagentPayload<ExtArgs>
      operation: Prisma.$operationPayload<ExtArgs>[]
      inventory: Prisma.$inventoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      creation_time: Date
      expiration_date: Date
      reagentid: number
      using: boolean
    }, ExtArgs["result"]["lot"]>
    composites: {}
  }

  type lotGetPayload<S extends boolean | null | undefined | lotDefaultArgs> = $Result.GetResult<Prisma.$lotPayload, S>

  type lotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<lotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LotCountAggregateInputType | true
    }

  export interface lotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['lot'], meta: { name: 'lot' } }
    /**
     * Find zero or one Lot that matches the filter.
     * @param {lotFindUniqueArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends lotFindUniqueArgs>(args: SelectSubset<T, lotFindUniqueArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {lotFindUniqueOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends lotFindUniqueOrThrowArgs>(args: SelectSubset<T, lotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotFindFirstArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends lotFindFirstArgs>(args?: SelectSubset<T, lotFindFirstArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotFindFirstOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends lotFindFirstOrThrowArgs>(args?: SelectSubset<T, lotFindFirstOrThrowArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lots
     * const lots = await prisma.lot.findMany()
     * 
     * // Get first 10 Lots
     * const lots = await prisma.lot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lotWithIdOnly = await prisma.lot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends lotFindManyArgs>(args?: SelectSubset<T, lotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lot.
     * @param {lotCreateArgs} args - Arguments to create a Lot.
     * @example
     * // Create one Lot
     * const Lot = await prisma.lot.create({
     *   data: {
     *     // ... data to create a Lot
     *   }
     * })
     * 
     */
    create<T extends lotCreateArgs>(args: SelectSubset<T, lotCreateArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lots.
     * @param {lotCreateManyArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends lotCreateManyArgs>(args?: SelectSubset<T, lotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lots and returns the data saved in the database.
     * @param {lotCreateManyAndReturnArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends lotCreateManyAndReturnArgs>(args?: SelectSubset<T, lotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lot.
     * @param {lotDeleteArgs} args - Arguments to delete one Lot.
     * @example
     * // Delete one Lot
     * const Lot = await prisma.lot.delete({
     *   where: {
     *     // ... filter to delete one Lot
     *   }
     * })
     * 
     */
    delete<T extends lotDeleteArgs>(args: SelectSubset<T, lotDeleteArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lot.
     * @param {lotUpdateArgs} args - Arguments to update one Lot.
     * @example
     * // Update one Lot
     * const lot = await prisma.lot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends lotUpdateArgs>(args: SelectSubset<T, lotUpdateArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lots.
     * @param {lotDeleteManyArgs} args - Arguments to filter Lots to delete.
     * @example
     * // Delete a few Lots
     * const { count } = await prisma.lot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends lotDeleteManyArgs>(args?: SelectSubset<T, lotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends lotUpdateManyArgs>(args: SelectSubset<T, lotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots and returns the data updated in the database.
     * @param {lotUpdateManyAndReturnArgs} args - Arguments to update many Lots.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends lotUpdateManyAndReturnArgs>(args: SelectSubset<T, lotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lot.
     * @param {lotUpsertArgs} args - Arguments to update or create a Lot.
     * @example
     * // Update or create a Lot
     * const lot = await prisma.lot.upsert({
     *   create: {
     *     // ... data to create a Lot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lot we want to update
     *   }
     * })
     */
    upsert<T extends lotUpsertArgs>(args: SelectSubset<T, lotUpsertArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotCountArgs} args - Arguments to filter Lots to count.
     * @example
     * // Count the number of Lots
     * const count = await prisma.lot.count({
     *   where: {
     *     // ... the filter for the Lots we want to count
     *   }
     * })
    **/
    count<T extends lotCountArgs>(
      args?: Subset<T, lotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LotAggregateArgs>(args: Subset<T, LotAggregateArgs>): Prisma.PrismaPromise<GetLotAggregateType<T>>

    /**
     * Group by Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends lotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: lotGroupByArgs['orderBy'] }
        : { orderBy?: lotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, lotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the lot model
   */
  readonly fields: lotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for lot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__lotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reagent<T extends reagentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, reagentDefaultArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    operation<T extends lot$operationArgs<ExtArgs> = {}>(args?: Subset<T, lot$operationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventory<T extends lot$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, lot$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the lot model
   */
  interface lotFieldRefs {
    readonly id: FieldRef<"lot", 'Int'>
    readonly name: FieldRef<"lot", 'String'>
    readonly creation_time: FieldRef<"lot", 'DateTime'>
    readonly expiration_date: FieldRef<"lot", 'DateTime'>
    readonly reagentid: FieldRef<"lot", 'Int'>
    readonly using: FieldRef<"lot", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * lot findUnique
   */
  export type lotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter, which lot to fetch.
     */
    where: lotWhereUniqueInput
  }

  /**
   * lot findUniqueOrThrow
   */
  export type lotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter, which lot to fetch.
     */
    where: lotWhereUniqueInput
  }

  /**
   * lot findFirst
   */
  export type lotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter, which lot to fetch.
     */
    where?: lotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lots to fetch.
     */
    orderBy?: lotOrderByWithRelationInput | lotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lots.
     */
    cursor?: lotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * lot findFirstOrThrow
   */
  export type lotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter, which lot to fetch.
     */
    where?: lotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lots to fetch.
     */
    orderBy?: lotOrderByWithRelationInput | lotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lots.
     */
    cursor?: lotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * lot findMany
   */
  export type lotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter, which lots to fetch.
     */
    where?: lotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lots to fetch.
     */
    orderBy?: lotOrderByWithRelationInput | lotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing lots.
     */
    cursor?: lotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lots.
     */
    skip?: number
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * lot create
   */
  export type lotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * The data needed to create a lot.
     */
    data: XOR<lotCreateInput, lotUncheckedCreateInput>
  }

  /**
   * lot createMany
   */
  export type lotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many lots.
     */
    data: lotCreateManyInput | lotCreateManyInput[]
  }

  /**
   * lot createManyAndReturn
   */
  export type lotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * The data used to create many lots.
     */
    data: lotCreateManyInput | lotCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * lot update
   */
  export type lotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * The data needed to update a lot.
     */
    data: XOR<lotUpdateInput, lotUncheckedUpdateInput>
    /**
     * Choose, which lot to update.
     */
    where: lotWhereUniqueInput
  }

  /**
   * lot updateMany
   */
  export type lotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update lots.
     */
    data: XOR<lotUpdateManyMutationInput, lotUncheckedUpdateManyInput>
    /**
     * Filter which lots to update
     */
    where?: lotWhereInput
    /**
     * Limit how many lots to update.
     */
    limit?: number
  }

  /**
   * lot updateManyAndReturn
   */
  export type lotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * The data used to update lots.
     */
    data: XOR<lotUpdateManyMutationInput, lotUncheckedUpdateManyInput>
    /**
     * Filter which lots to update
     */
    where?: lotWhereInput
    /**
     * Limit how many lots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * lot upsert
   */
  export type lotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * The filter to search for the lot to update in case it exists.
     */
    where: lotWhereUniqueInput
    /**
     * In case the lot found by the `where` argument doesn't exist, create a new lot with this data.
     */
    create: XOR<lotCreateInput, lotUncheckedCreateInput>
    /**
     * In case the lot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<lotUpdateInput, lotUncheckedUpdateInput>
  }

  /**
   * lot delete
   */
  export type lotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
    /**
     * Filter which lot to delete.
     */
    where: lotWhereUniqueInput
  }

  /**
   * lot deleteMany
   */
  export type lotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lots to delete
     */
    where?: lotWhereInput
    /**
     * Limit how many lots to delete.
     */
    limit?: number
  }

  /**
   * lot.operation
   */
  export type lot$operationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    where?: operationWhereInput
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    cursor?: operationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * lot.inventory
   */
  export type lot$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    where?: inventoryWhereInput
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    cursor?: inventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * lot without action
   */
  export type lotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lot
     */
    select?: lotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lot
     */
    omit?: lotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lotInclude<ExtArgs> | null
  }


  /**
   * Model operation
   */

  export type AggregateOperation = {
    _count: OperationCountAggregateOutputType | null
    _avg: OperationAvgAggregateOutputType | null
    _sum: OperationSumAggregateOutputType | null
    _min: OperationMinAggregateOutputType | null
    _max: OperationMaxAggregateOutputType | null
  }

  export type OperationAvgAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    userid: number | null
  }

  export type OperationSumAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    userid: number | null
  }

  export type OperationMinAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    operation_action: string | null
    creation_time: Date | null
    using: boolean | null
    barcodenumber: string | null
    userid: number | null
  }

  export type OperationMaxAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    operation_action: string | null
    creation_time: Date | null
    using: boolean | null
    barcodenumber: string | null
    userid: number | null
  }

  export type OperationCountAggregateOutputType = {
    id: number
    reagentid: number
    lotid: number
    operation_action: number
    creation_time: number
    using: number
    barcodenumber: number
    userid: number
    _all: number
  }


  export type OperationAvgAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    userid?: true
  }

  export type OperationSumAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    userid?: true
  }

  export type OperationMinAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    operation_action?: true
    creation_time?: true
    using?: true
    barcodenumber?: true
    userid?: true
  }

  export type OperationMaxAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    operation_action?: true
    creation_time?: true
    using?: true
    barcodenumber?: true
    userid?: true
  }

  export type OperationCountAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    operation_action?: true
    creation_time?: true
    using?: true
    barcodenumber?: true
    userid?: true
    _all?: true
  }

  export type OperationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which operation to aggregate.
     */
    where?: operationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of operations to fetch.
     */
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: operationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` operations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` operations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned operations
    **/
    _count?: true | OperationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OperationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OperationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OperationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OperationMaxAggregateInputType
  }

  export type GetOperationAggregateType<T extends OperationAggregateArgs> = {
        [P in keyof T & keyof AggregateOperation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOperation[P]>
      : GetScalarType<T[P], AggregateOperation[P]>
  }




  export type operationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: operationWhereInput
    orderBy?: operationOrderByWithAggregationInput | operationOrderByWithAggregationInput[]
    by: OperationScalarFieldEnum[] | OperationScalarFieldEnum
    having?: operationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OperationCountAggregateInputType | true
    _avg?: OperationAvgAggregateInputType
    _sum?: OperationSumAggregateInputType
    _min?: OperationMinAggregateInputType
    _max?: OperationMaxAggregateInputType
  }

  export type OperationGroupByOutputType = {
    id: number
    reagentid: number
    lotid: number
    operation_action: string
    creation_time: Date
    using: boolean
    barcodenumber: string
    userid: number
    _count: OperationCountAggregateOutputType | null
    _avg: OperationAvgAggregateOutputType | null
    _sum: OperationSumAggregateOutputType | null
    _min: OperationMinAggregateOutputType | null
    _max: OperationMaxAggregateOutputType | null
  }

  type GetOperationGroupByPayload<T extends operationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OperationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OperationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OperationGroupByOutputType[P]>
            : GetScalarType<T[P], OperationGroupByOutputType[P]>
        }
      >
    >


  export type operationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    operation_action?: boolean
    creation_time?: boolean
    using?: boolean
    barcodenumber?: boolean
    userid?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operation"]>

  export type operationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    operation_action?: boolean
    creation_time?: boolean
    using?: boolean
    barcodenumber?: boolean
    userid?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operation"]>

  export type operationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    operation_action?: boolean
    creation_time?: boolean
    using?: boolean
    barcodenumber?: boolean
    userid?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operation"]>

  export type operationSelectScalar = {
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    operation_action?: boolean
    creation_time?: boolean
    using?: boolean
    barcodenumber?: boolean
    userid?: boolean
  }

  export type operationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reagentid" | "lotid" | "operation_action" | "creation_time" | "using" | "barcodenumber" | "userid", ExtArgs["result"]["operation"]>
  export type operationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type operationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type operationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $operationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "operation"
    objects: {
      reagent: Prisma.$reagentPayload<ExtArgs>
      lot: Prisma.$lotPayload<ExtArgs>
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reagentid: number
      lotid: number
      operation_action: string
      creation_time: Date
      using: boolean
      barcodenumber: string
      userid: number
    }, ExtArgs["result"]["operation"]>
    composites: {}
  }

  type operationGetPayload<S extends boolean | null | undefined | operationDefaultArgs> = $Result.GetResult<Prisma.$operationPayload, S>

  type operationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<operationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OperationCountAggregateInputType | true
    }

  export interface operationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['operation'], meta: { name: 'operation' } }
    /**
     * Find zero or one Operation that matches the filter.
     * @param {operationFindUniqueArgs} args - Arguments to find a Operation
     * @example
     * // Get one Operation
     * const operation = await prisma.operation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends operationFindUniqueArgs>(args: SelectSubset<T, operationFindUniqueArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Operation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {operationFindUniqueOrThrowArgs} args - Arguments to find a Operation
     * @example
     * // Get one Operation
     * const operation = await prisma.operation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends operationFindUniqueOrThrowArgs>(args: SelectSubset<T, operationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Operation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationFindFirstArgs} args - Arguments to find a Operation
     * @example
     * // Get one Operation
     * const operation = await prisma.operation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends operationFindFirstArgs>(args?: SelectSubset<T, operationFindFirstArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Operation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationFindFirstOrThrowArgs} args - Arguments to find a Operation
     * @example
     * // Get one Operation
     * const operation = await prisma.operation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends operationFindFirstOrThrowArgs>(args?: SelectSubset<T, operationFindFirstOrThrowArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Operations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Operations
     * const operations = await prisma.operation.findMany()
     * 
     * // Get first 10 Operations
     * const operations = await prisma.operation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const operationWithIdOnly = await prisma.operation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends operationFindManyArgs>(args?: SelectSubset<T, operationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Operation.
     * @param {operationCreateArgs} args - Arguments to create a Operation.
     * @example
     * // Create one Operation
     * const Operation = await prisma.operation.create({
     *   data: {
     *     // ... data to create a Operation
     *   }
     * })
     * 
     */
    create<T extends operationCreateArgs>(args: SelectSubset<T, operationCreateArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Operations.
     * @param {operationCreateManyArgs} args - Arguments to create many Operations.
     * @example
     * // Create many Operations
     * const operation = await prisma.operation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends operationCreateManyArgs>(args?: SelectSubset<T, operationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Operations and returns the data saved in the database.
     * @param {operationCreateManyAndReturnArgs} args - Arguments to create many Operations.
     * @example
     * // Create many Operations
     * const operation = await prisma.operation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Operations and only return the `id`
     * const operationWithIdOnly = await prisma.operation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends operationCreateManyAndReturnArgs>(args?: SelectSubset<T, operationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Operation.
     * @param {operationDeleteArgs} args - Arguments to delete one Operation.
     * @example
     * // Delete one Operation
     * const Operation = await prisma.operation.delete({
     *   where: {
     *     // ... filter to delete one Operation
     *   }
     * })
     * 
     */
    delete<T extends operationDeleteArgs>(args: SelectSubset<T, operationDeleteArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Operation.
     * @param {operationUpdateArgs} args - Arguments to update one Operation.
     * @example
     * // Update one Operation
     * const operation = await prisma.operation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends operationUpdateArgs>(args: SelectSubset<T, operationUpdateArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Operations.
     * @param {operationDeleteManyArgs} args - Arguments to filter Operations to delete.
     * @example
     * // Delete a few Operations
     * const { count } = await prisma.operation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends operationDeleteManyArgs>(args?: SelectSubset<T, operationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Operations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Operations
     * const operation = await prisma.operation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends operationUpdateManyArgs>(args: SelectSubset<T, operationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Operations and returns the data updated in the database.
     * @param {operationUpdateManyAndReturnArgs} args - Arguments to update many Operations.
     * @example
     * // Update many Operations
     * const operation = await prisma.operation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Operations and only return the `id`
     * const operationWithIdOnly = await prisma.operation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends operationUpdateManyAndReturnArgs>(args: SelectSubset<T, operationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Operation.
     * @param {operationUpsertArgs} args - Arguments to update or create a Operation.
     * @example
     * // Update or create a Operation
     * const operation = await prisma.operation.upsert({
     *   create: {
     *     // ... data to create a Operation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Operation we want to update
     *   }
     * })
     */
    upsert<T extends operationUpsertArgs>(args: SelectSubset<T, operationUpsertArgs<ExtArgs>>): Prisma__operationClient<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Operations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationCountArgs} args - Arguments to filter Operations to count.
     * @example
     * // Count the number of Operations
     * const count = await prisma.operation.count({
     *   where: {
     *     // ... the filter for the Operations we want to count
     *   }
     * })
    **/
    count<T extends operationCountArgs>(
      args?: Subset<T, operationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OperationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Operation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OperationAggregateArgs>(args: Subset<T, OperationAggregateArgs>): Prisma.PrismaPromise<GetOperationAggregateType<T>>

    /**
     * Group by Operation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {operationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends operationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: operationGroupByArgs['orderBy'] }
        : { orderBy?: operationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, operationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the operation model
   */
  readonly fields: operationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for operation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__operationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reagent<T extends reagentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, reagentDefaultArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lot<T extends lotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, lotDefaultArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the operation model
   */
  interface operationFieldRefs {
    readonly id: FieldRef<"operation", 'Int'>
    readonly reagentid: FieldRef<"operation", 'Int'>
    readonly lotid: FieldRef<"operation", 'Int'>
    readonly operation_action: FieldRef<"operation", 'String'>
    readonly creation_time: FieldRef<"operation", 'DateTime'>
    readonly using: FieldRef<"operation", 'Boolean'>
    readonly barcodenumber: FieldRef<"operation", 'String'>
    readonly userid: FieldRef<"operation", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * operation findUnique
   */
  export type operationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter, which operation to fetch.
     */
    where: operationWhereUniqueInput
  }

  /**
   * operation findUniqueOrThrow
   */
  export type operationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter, which operation to fetch.
     */
    where: operationWhereUniqueInput
  }

  /**
   * operation findFirst
   */
  export type operationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter, which operation to fetch.
     */
    where?: operationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of operations to fetch.
     */
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for operations.
     */
    cursor?: operationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` operations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` operations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of operations.
     */
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * operation findFirstOrThrow
   */
  export type operationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter, which operation to fetch.
     */
    where?: operationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of operations to fetch.
     */
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for operations.
     */
    cursor?: operationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` operations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` operations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of operations.
     */
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * operation findMany
   */
  export type operationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter, which operations to fetch.
     */
    where?: operationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of operations to fetch.
     */
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing operations.
     */
    cursor?: operationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` operations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` operations.
     */
    skip?: number
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * operation create
   */
  export type operationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * The data needed to create a operation.
     */
    data: XOR<operationCreateInput, operationUncheckedCreateInput>
  }

  /**
   * operation createMany
   */
  export type operationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many operations.
     */
    data: operationCreateManyInput | operationCreateManyInput[]
  }

  /**
   * operation createManyAndReturn
   */
  export type operationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * The data used to create many operations.
     */
    data: operationCreateManyInput | operationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * operation update
   */
  export type operationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * The data needed to update a operation.
     */
    data: XOR<operationUpdateInput, operationUncheckedUpdateInput>
    /**
     * Choose, which operation to update.
     */
    where: operationWhereUniqueInput
  }

  /**
   * operation updateMany
   */
  export type operationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update operations.
     */
    data: XOR<operationUpdateManyMutationInput, operationUncheckedUpdateManyInput>
    /**
     * Filter which operations to update
     */
    where?: operationWhereInput
    /**
     * Limit how many operations to update.
     */
    limit?: number
  }

  /**
   * operation updateManyAndReturn
   */
  export type operationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * The data used to update operations.
     */
    data: XOR<operationUpdateManyMutationInput, operationUncheckedUpdateManyInput>
    /**
     * Filter which operations to update
     */
    where?: operationWhereInput
    /**
     * Limit how many operations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * operation upsert
   */
  export type operationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * The filter to search for the operation to update in case it exists.
     */
    where: operationWhereUniqueInput
    /**
     * In case the operation found by the `where` argument doesn't exist, create a new operation with this data.
     */
    create: XOR<operationCreateInput, operationUncheckedCreateInput>
    /**
     * In case the operation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<operationUpdateInput, operationUncheckedUpdateInput>
  }

  /**
   * operation delete
   */
  export type operationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    /**
     * Filter which operation to delete.
     */
    where: operationWhereUniqueInput
  }

  /**
   * operation deleteMany
   */
  export type operationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which operations to delete
     */
    where?: operationWhereInput
    /**
     * Limit how many operations to delete.
     */
    limit?: number
  }

  /**
   * operation without action
   */
  export type operationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
  }


  /**
   * Model inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    inventory_number: number | null
    lastweek_outbound_number: number | null
  }

  export type InventorySumAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    inventory_number: number | null
    lastweek_outbound_number: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    inventory_number: number | null
    last_outbound_time: Date | null
    lastweek_outbound_number: number | null
    using: boolean | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: number | null
    reagentid: number | null
    lotid: number | null
    inventory_number: number | null
    last_outbound_time: Date | null
    lastweek_outbound_number: number | null
    using: boolean | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    reagentid: number
    lotid: number
    inventory_number: number
    last_outbound_time: number
    lastweek_outbound_number: number
    using: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    inventory_number?: true
    lastweek_outbound_number?: true
  }

  export type InventorySumAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    inventory_number?: true
    lastweek_outbound_number?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    inventory_number?: true
    last_outbound_time?: true
    lastweek_outbound_number?: true
    using?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    inventory_number?: true
    last_outbound_time?: true
    lastweek_outbound_number?: true
    using?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    reagentid?: true
    lotid?: true
    inventory_number?: true
    last_outbound_time?: true
    lastweek_outbound_number?: true
    using?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventory to aggregate.
     */
    where?: inventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventories to fetch.
     */
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: inventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type inventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventoryWhereInput
    orderBy?: inventoryOrderByWithAggregationInput | inventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: inventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: number
    reagentid: number
    lotid: number
    inventory_number: number
    last_outbound_time: Date
    lastweek_outbound_number: number
    using: boolean
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends inventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type inventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    inventory_number?: boolean
    last_outbound_time?: boolean
    lastweek_outbound_number?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type inventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    inventory_number?: boolean
    last_outbound_time?: boolean
    lastweek_outbound_number?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type inventorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    inventory_number?: boolean
    last_outbound_time?: boolean
    lastweek_outbound_number?: boolean
    using?: boolean
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type inventorySelectScalar = {
    id?: boolean
    reagentid?: boolean
    lotid?: boolean
    inventory_number?: boolean
    last_outbound_time?: boolean
    lastweek_outbound_number?: boolean
    using?: boolean
  }

  export type inventoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reagentid" | "lotid" | "inventory_number" | "last_outbound_time" | "lastweek_outbound_number" | "using", ExtArgs["result"]["inventory"]>
  export type inventoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }
  export type inventoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }
  export type inventoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reagent?: boolean | reagentDefaultArgs<ExtArgs>
    lot?: boolean | lotDefaultArgs<ExtArgs>
  }

  export type $inventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "inventory"
    objects: {
      reagent: Prisma.$reagentPayload<ExtArgs>
      lot: Prisma.$lotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reagentid: number
      lotid: number
      inventory_number: number
      last_outbound_time: Date
      lastweek_outbound_number: number
      using: boolean
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type inventoryGetPayload<S extends boolean | null | undefined | inventoryDefaultArgs> = $Result.GetResult<Prisma.$inventoryPayload, S>

  type inventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<inventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface inventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['inventory'], meta: { name: 'inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {inventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends inventoryFindUniqueArgs>(args: SelectSubset<T, inventoryFindUniqueArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {inventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends inventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, inventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends inventoryFindFirstArgs>(args?: SelectSubset<T, inventoryFindFirstArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends inventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, inventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends inventoryFindManyArgs>(args?: SelectSubset<T, inventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory.
     * @param {inventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends inventoryCreateArgs>(args: SelectSubset<T, inventoryCreateArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventories.
     * @param {inventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends inventoryCreateManyArgs>(args?: SelectSubset<T, inventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {inventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends inventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, inventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inventory.
     * @param {inventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends inventoryDeleteArgs>(args: SelectSubset<T, inventoryDeleteArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory.
     * @param {inventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends inventoryUpdateArgs>(args: SelectSubset<T, inventoryUpdateArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventories.
     * @param {inventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends inventoryDeleteManyArgs>(args?: SelectSubset<T, inventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends inventoryUpdateManyArgs>(args: SelectSubset<T, inventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories and returns the data updated in the database.
     * @param {inventoryUpdateManyAndReturnArgs} args - Arguments to update many Inventories.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends inventoryUpdateManyAndReturnArgs>(args: SelectSubset<T, inventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inventory.
     * @param {inventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends inventoryUpsertArgs>(args: SelectSubset<T, inventoryUpsertArgs<ExtArgs>>): Prisma__inventoryClient<$Result.GetResult<Prisma.$inventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends inventoryCountArgs>(
      args?: Subset<T, inventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends inventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: inventoryGroupByArgs['orderBy'] }
        : { orderBy?: inventoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, inventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the inventory model
   */
  readonly fields: inventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__inventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reagent<T extends reagentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, reagentDefaultArgs<ExtArgs>>): Prisma__reagentClient<$Result.GetResult<Prisma.$reagentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lot<T extends lotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, lotDefaultArgs<ExtArgs>>): Prisma__lotClient<$Result.GetResult<Prisma.$lotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the inventory model
   */
  interface inventoryFieldRefs {
    readonly id: FieldRef<"inventory", 'Int'>
    readonly reagentid: FieldRef<"inventory", 'Int'>
    readonly lotid: FieldRef<"inventory", 'Int'>
    readonly inventory_number: FieldRef<"inventory", 'Int'>
    readonly last_outbound_time: FieldRef<"inventory", 'DateTime'>
    readonly lastweek_outbound_number: FieldRef<"inventory", 'Int'>
    readonly using: FieldRef<"inventory", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * inventory findUnique
   */
  export type inventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter, which inventory to fetch.
     */
    where: inventoryWhereUniqueInput
  }

  /**
   * inventory findUniqueOrThrow
   */
  export type inventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter, which inventory to fetch.
     */
    where: inventoryWhereUniqueInput
  }

  /**
   * inventory findFirst
   */
  export type inventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter, which inventory to fetch.
     */
    where?: inventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventories to fetch.
     */
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventories.
     */
    cursor?: inventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * inventory findFirstOrThrow
   */
  export type inventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter, which inventory to fetch.
     */
    where?: inventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventories to fetch.
     */
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventories.
     */
    cursor?: inventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * inventory findMany
   */
  export type inventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter, which inventories to fetch.
     */
    where?: inventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventories to fetch.
     */
    orderBy?: inventoryOrderByWithRelationInput | inventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing inventories.
     */
    cursor?: inventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventories.
     */
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * inventory create
   */
  export type inventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * The data needed to create a inventory.
     */
    data: XOR<inventoryCreateInput, inventoryUncheckedCreateInput>
  }

  /**
   * inventory createMany
   */
  export type inventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many inventories.
     */
    data: inventoryCreateManyInput | inventoryCreateManyInput[]
  }

  /**
   * inventory createManyAndReturn
   */
  export type inventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * The data used to create many inventories.
     */
    data: inventoryCreateManyInput | inventoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * inventory update
   */
  export type inventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * The data needed to update a inventory.
     */
    data: XOR<inventoryUpdateInput, inventoryUncheckedUpdateInput>
    /**
     * Choose, which inventory to update.
     */
    where: inventoryWhereUniqueInput
  }

  /**
   * inventory updateMany
   */
  export type inventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update inventories.
     */
    data: XOR<inventoryUpdateManyMutationInput, inventoryUncheckedUpdateManyInput>
    /**
     * Filter which inventories to update
     */
    where?: inventoryWhereInput
    /**
     * Limit how many inventories to update.
     */
    limit?: number
  }

  /**
   * inventory updateManyAndReturn
   */
  export type inventoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * The data used to update inventories.
     */
    data: XOR<inventoryUpdateManyMutationInput, inventoryUncheckedUpdateManyInput>
    /**
     * Filter which inventories to update
     */
    where?: inventoryWhereInput
    /**
     * Limit how many inventories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * inventory upsert
   */
  export type inventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * The filter to search for the inventory to update in case it exists.
     */
    where: inventoryWhereUniqueInput
    /**
     * In case the inventory found by the `where` argument doesn't exist, create a new inventory with this data.
     */
    create: XOR<inventoryCreateInput, inventoryUncheckedCreateInput>
    /**
     * In case the inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<inventoryUpdateInput, inventoryUncheckedUpdateInput>
  }

  /**
   * inventory delete
   */
  export type inventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
    /**
     * Filter which inventory to delete.
     */
    where: inventoryWhereUniqueInput
  }

  /**
   * inventory deleteMany
   */
  export type inventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventories to delete
     */
    where?: inventoryWhereInput
    /**
     * Limit how many inventories to delete.
     */
    limit?: number
  }

  /**
   * inventory without action
   */
  export type inventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory
     */
    select?: inventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory
     */
    omit?: inventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventoryInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    using: boolean | null
    permission: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    using: boolean | null
    permission: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    using: number
    permission: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    using?: true
    permission?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    using?: true
    permission?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    using?: true
    permission?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string
    password: string
    using: boolean
    permission: string
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    using?: boolean
    permission?: boolean
    operation?: boolean | user$operationArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type userSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    using?: boolean
    permission?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    using?: boolean
    permission?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    using?: boolean
    permission?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "using" | "permission", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    operation?: boolean | user$operationArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type userIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type userIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      operation: Prisma.$operationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      password: string
      using: boolean
      permission: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {userCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends userCreateManyAndReturnArgs>(args?: SelectSubset<T, userCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {userUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends userUpdateManyAndReturnArgs>(args: SelectSubset<T, userUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    operation<T extends user$operationArgs<ExtArgs> = {}>(args?: Subset<T, user$operationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$operationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'Int'>
    readonly username: FieldRef<"user", 'String'>
    readonly password: FieldRef<"user", 'String'>
    readonly using: FieldRef<"user", 'Boolean'>
    readonly permission: FieldRef<"user", 'String'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
  }

  /**
   * user createManyAndReturn
   */
  export type userCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user updateManyAndReturn
   */
  export type userUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.operation
   */
  export type user$operationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the operation
     */
    select?: operationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the operation
     */
    omit?: operationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: operationInclude<ExtArgs> | null
    where?: operationWhereInput
    orderBy?: operationOrderByWithRelationInput | operationOrderByWithRelationInput[]
    cursor?: operationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OperationScalarFieldEnum | OperationScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    using: 'using',
    phone: 'phone',
    note: 'note'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const ReagentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    specifications: 'specifications',
    warn_number: 'warn_number',
    price: 'price',
    creation_time: 'creation_time',
    storage_condition: 'storage_condition',
    teamid: 'teamid',
    using: 'using',
    warn_days: 'warn_days'
  };

  export type ReagentScalarFieldEnum = (typeof ReagentScalarFieldEnum)[keyof typeof ReagentScalarFieldEnum]


  export const LotScalarFieldEnum: {
    id: 'id',
    name: 'name',
    creation_time: 'creation_time',
    expiration_date: 'expiration_date',
    reagentid: 'reagentid',
    using: 'using'
  };

  export type LotScalarFieldEnum = (typeof LotScalarFieldEnum)[keyof typeof LotScalarFieldEnum]


  export const OperationScalarFieldEnum: {
    id: 'id',
    reagentid: 'reagentid',
    lotid: 'lotid',
    operation_action: 'operation_action',
    creation_time: 'creation_time',
    using: 'using',
    barcodenumber: 'barcodenumber',
    userid: 'userid'
  };

  export type OperationScalarFieldEnum = (typeof OperationScalarFieldEnum)[keyof typeof OperationScalarFieldEnum]


  export const InventoryScalarFieldEnum: {
    id: 'id',
    reagentid: 'reagentid',
    lotid: 'lotid',
    inventory_number: 'inventory_number',
    last_outbound_time: 'last_outbound_time',
    lastweek_outbound_number: 'lastweek_outbound_number',
    using: 'using'
  };

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    using: 'using',
    permission: 'permission'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type teamWhereInput = {
    AND?: teamWhereInput | teamWhereInput[]
    OR?: teamWhereInput[]
    NOT?: teamWhereInput | teamWhereInput[]
    id?: IntFilter<"team"> | number
    name?: StringFilter<"team"> | string
    using?: BoolFilter<"team"> | boolean
    phone?: StringFilter<"team"> | string
    note?: StringFilter<"team"> | string
    reagent?: ReagentListRelationFilter
  }

  export type teamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    using?: SortOrder
    phone?: SortOrder
    note?: SortOrder
    reagent?: reagentOrderByRelationAggregateInput
  }

  export type teamWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: teamWhereInput | teamWhereInput[]
    OR?: teamWhereInput[]
    NOT?: teamWhereInput | teamWhereInput[]
    name?: StringFilter<"team"> | string
    using?: BoolFilter<"team"> | boolean
    phone?: StringFilter<"team"> | string
    note?: StringFilter<"team"> | string
    reagent?: ReagentListRelationFilter
  }, "id" | "id">

  export type teamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    using?: SortOrder
    phone?: SortOrder
    note?: SortOrder
    _count?: teamCountOrderByAggregateInput
    _avg?: teamAvgOrderByAggregateInput
    _max?: teamMaxOrderByAggregateInput
    _min?: teamMinOrderByAggregateInput
    _sum?: teamSumOrderByAggregateInput
  }

  export type teamScalarWhereWithAggregatesInput = {
    AND?: teamScalarWhereWithAggregatesInput | teamScalarWhereWithAggregatesInput[]
    OR?: teamScalarWhereWithAggregatesInput[]
    NOT?: teamScalarWhereWithAggregatesInput | teamScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"team"> | number
    name?: StringWithAggregatesFilter<"team"> | string
    using?: BoolWithAggregatesFilter<"team"> | boolean
    phone?: StringWithAggregatesFilter<"team"> | string
    note?: StringWithAggregatesFilter<"team"> | string
  }

  export type reagentWhereInput = {
    AND?: reagentWhereInput | reagentWhereInput[]
    OR?: reagentWhereInput[]
    NOT?: reagentWhereInput | reagentWhereInput[]
    id?: IntFilter<"reagent"> | number
    name?: StringFilter<"reagent"> | string
    specifications?: StringFilter<"reagent"> | string
    warn_number?: IntFilter<"reagent"> | number
    price?: IntFilter<"reagent"> | number
    creation_time?: DateTimeFilter<"reagent"> | Date | string
    storage_condition?: StringFilter<"reagent"> | string
    teamid?: IntFilter<"reagent"> | number
    using?: BoolFilter<"reagent"> | boolean
    warn_days?: IntFilter<"reagent"> | number
    team?: XOR<TeamScalarRelationFilter, teamWhereInput>
    lot?: LotListRelationFilter
    operation?: OperationListRelationFilter
    inventory?: InventoryListRelationFilter
  }

  export type reagentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    specifications?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    creation_time?: SortOrder
    storage_condition?: SortOrder
    teamid?: SortOrder
    using?: SortOrder
    warn_days?: SortOrder
    team?: teamOrderByWithRelationInput
    lot?: lotOrderByRelationAggregateInput
    operation?: operationOrderByRelationAggregateInput
    inventory?: inventoryOrderByRelationAggregateInput
  }

  export type reagentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: reagentWhereInput | reagentWhereInput[]
    OR?: reagentWhereInput[]
    NOT?: reagentWhereInput | reagentWhereInput[]
    name?: StringFilter<"reagent"> | string
    specifications?: StringFilter<"reagent"> | string
    warn_number?: IntFilter<"reagent"> | number
    price?: IntFilter<"reagent"> | number
    creation_time?: DateTimeFilter<"reagent"> | Date | string
    storage_condition?: StringFilter<"reagent"> | string
    teamid?: IntFilter<"reagent"> | number
    using?: BoolFilter<"reagent"> | boolean
    warn_days?: IntFilter<"reagent"> | number
    team?: XOR<TeamScalarRelationFilter, teamWhereInput>
    lot?: LotListRelationFilter
    operation?: OperationListRelationFilter
    inventory?: InventoryListRelationFilter
  }, "id" | "id">

  export type reagentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    specifications?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    creation_time?: SortOrder
    storage_condition?: SortOrder
    teamid?: SortOrder
    using?: SortOrder
    warn_days?: SortOrder
    _count?: reagentCountOrderByAggregateInput
    _avg?: reagentAvgOrderByAggregateInput
    _max?: reagentMaxOrderByAggregateInput
    _min?: reagentMinOrderByAggregateInput
    _sum?: reagentSumOrderByAggregateInput
  }

  export type reagentScalarWhereWithAggregatesInput = {
    AND?: reagentScalarWhereWithAggregatesInput | reagentScalarWhereWithAggregatesInput[]
    OR?: reagentScalarWhereWithAggregatesInput[]
    NOT?: reagentScalarWhereWithAggregatesInput | reagentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"reagent"> | number
    name?: StringWithAggregatesFilter<"reagent"> | string
    specifications?: StringWithAggregatesFilter<"reagent"> | string
    warn_number?: IntWithAggregatesFilter<"reagent"> | number
    price?: IntWithAggregatesFilter<"reagent"> | number
    creation_time?: DateTimeWithAggregatesFilter<"reagent"> | Date | string
    storage_condition?: StringWithAggregatesFilter<"reagent"> | string
    teamid?: IntWithAggregatesFilter<"reagent"> | number
    using?: BoolWithAggregatesFilter<"reagent"> | boolean
    warn_days?: IntWithAggregatesFilter<"reagent"> | number
  }

  export type lotWhereInput = {
    AND?: lotWhereInput | lotWhereInput[]
    OR?: lotWhereInput[]
    NOT?: lotWhereInput | lotWhereInput[]
    id?: IntFilter<"lot"> | number
    name?: StringFilter<"lot"> | string
    creation_time?: DateTimeFilter<"lot"> | Date | string
    expiration_date?: DateTimeFilter<"lot"> | Date | string
    reagentid?: IntFilter<"lot"> | number
    using?: BoolFilter<"lot"> | boolean
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    operation?: OperationListRelationFilter
    inventory?: InventoryListRelationFilter
  }

  export type lotOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    creation_time?: SortOrder
    expiration_date?: SortOrder
    reagentid?: SortOrder
    using?: SortOrder
    reagent?: reagentOrderByWithRelationInput
    operation?: operationOrderByRelationAggregateInput
    inventory?: inventoryOrderByRelationAggregateInput
  }

  export type lotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: lotWhereInput | lotWhereInput[]
    OR?: lotWhereInput[]
    NOT?: lotWhereInput | lotWhereInput[]
    name?: StringFilter<"lot"> | string
    creation_time?: DateTimeFilter<"lot"> | Date | string
    expiration_date?: DateTimeFilter<"lot"> | Date | string
    reagentid?: IntFilter<"lot"> | number
    using?: BoolFilter<"lot"> | boolean
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    operation?: OperationListRelationFilter
    inventory?: InventoryListRelationFilter
  }, "id" | "id">

  export type lotOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    creation_time?: SortOrder
    expiration_date?: SortOrder
    reagentid?: SortOrder
    using?: SortOrder
    _count?: lotCountOrderByAggregateInput
    _avg?: lotAvgOrderByAggregateInput
    _max?: lotMaxOrderByAggregateInput
    _min?: lotMinOrderByAggregateInput
    _sum?: lotSumOrderByAggregateInput
  }

  export type lotScalarWhereWithAggregatesInput = {
    AND?: lotScalarWhereWithAggregatesInput | lotScalarWhereWithAggregatesInput[]
    OR?: lotScalarWhereWithAggregatesInput[]
    NOT?: lotScalarWhereWithAggregatesInput | lotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"lot"> | number
    name?: StringWithAggregatesFilter<"lot"> | string
    creation_time?: DateTimeWithAggregatesFilter<"lot"> | Date | string
    expiration_date?: DateTimeWithAggregatesFilter<"lot"> | Date | string
    reagentid?: IntWithAggregatesFilter<"lot"> | number
    using?: BoolWithAggregatesFilter<"lot"> | boolean
  }

  export type operationWhereInput = {
    AND?: operationWhereInput | operationWhereInput[]
    OR?: operationWhereInput[]
    NOT?: operationWhereInput | operationWhereInput[]
    id?: IntFilter<"operation"> | number
    reagentid?: IntFilter<"operation"> | number
    lotid?: IntFilter<"operation"> | number
    operation_action?: StringFilter<"operation"> | string
    creation_time?: DateTimeFilter<"operation"> | Date | string
    using?: BoolFilter<"operation"> | boolean
    barcodenumber?: StringFilter<"operation"> | string
    userid?: IntFilter<"operation"> | number
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    lot?: XOR<LotScalarRelationFilter, lotWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type operationOrderByWithRelationInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    operation_action?: SortOrder
    creation_time?: SortOrder
    using?: SortOrder
    barcodenumber?: SortOrder
    userid?: SortOrder
    reagent?: reagentOrderByWithRelationInput
    lot?: lotOrderByWithRelationInput
    user?: userOrderByWithRelationInput
  }

  export type operationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: operationWhereInput | operationWhereInput[]
    OR?: operationWhereInput[]
    NOT?: operationWhereInput | operationWhereInput[]
    reagentid?: IntFilter<"operation"> | number
    lotid?: IntFilter<"operation"> | number
    operation_action?: StringFilter<"operation"> | string
    creation_time?: DateTimeFilter<"operation"> | Date | string
    using?: BoolFilter<"operation"> | boolean
    barcodenumber?: StringFilter<"operation"> | string
    userid?: IntFilter<"operation"> | number
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    lot?: XOR<LotScalarRelationFilter, lotWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id" | "id">

  export type operationOrderByWithAggregationInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    operation_action?: SortOrder
    creation_time?: SortOrder
    using?: SortOrder
    barcodenumber?: SortOrder
    userid?: SortOrder
    _count?: operationCountOrderByAggregateInput
    _avg?: operationAvgOrderByAggregateInput
    _max?: operationMaxOrderByAggregateInput
    _min?: operationMinOrderByAggregateInput
    _sum?: operationSumOrderByAggregateInput
  }

  export type operationScalarWhereWithAggregatesInput = {
    AND?: operationScalarWhereWithAggregatesInput | operationScalarWhereWithAggregatesInput[]
    OR?: operationScalarWhereWithAggregatesInput[]
    NOT?: operationScalarWhereWithAggregatesInput | operationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"operation"> | number
    reagentid?: IntWithAggregatesFilter<"operation"> | number
    lotid?: IntWithAggregatesFilter<"operation"> | number
    operation_action?: StringWithAggregatesFilter<"operation"> | string
    creation_time?: DateTimeWithAggregatesFilter<"operation"> | Date | string
    using?: BoolWithAggregatesFilter<"operation"> | boolean
    barcodenumber?: StringWithAggregatesFilter<"operation"> | string
    userid?: IntWithAggregatesFilter<"operation"> | number
  }

  export type inventoryWhereInput = {
    AND?: inventoryWhereInput | inventoryWhereInput[]
    OR?: inventoryWhereInput[]
    NOT?: inventoryWhereInput | inventoryWhereInput[]
    id?: IntFilter<"inventory"> | number
    reagentid?: IntFilter<"inventory"> | number
    lotid?: IntFilter<"inventory"> | number
    inventory_number?: IntFilter<"inventory"> | number
    last_outbound_time?: DateTimeFilter<"inventory"> | Date | string
    lastweek_outbound_number?: IntFilter<"inventory"> | number
    using?: BoolFilter<"inventory"> | boolean
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    lot?: XOR<LotScalarRelationFilter, lotWhereInput>
  }

  export type inventoryOrderByWithRelationInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    last_outbound_time?: SortOrder
    lastweek_outbound_number?: SortOrder
    using?: SortOrder
    reagent?: reagentOrderByWithRelationInput
    lot?: lotOrderByWithRelationInput
  }

  export type inventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: inventoryWhereInput | inventoryWhereInput[]
    OR?: inventoryWhereInput[]
    NOT?: inventoryWhereInput | inventoryWhereInput[]
    reagentid?: IntFilter<"inventory"> | number
    lotid?: IntFilter<"inventory"> | number
    inventory_number?: IntFilter<"inventory"> | number
    last_outbound_time?: DateTimeFilter<"inventory"> | Date | string
    lastweek_outbound_number?: IntFilter<"inventory"> | number
    using?: BoolFilter<"inventory"> | boolean
    reagent?: XOR<ReagentScalarRelationFilter, reagentWhereInput>
    lot?: XOR<LotScalarRelationFilter, lotWhereInput>
  }, "id" | "id">

  export type inventoryOrderByWithAggregationInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    last_outbound_time?: SortOrder
    lastweek_outbound_number?: SortOrder
    using?: SortOrder
    _count?: inventoryCountOrderByAggregateInput
    _avg?: inventoryAvgOrderByAggregateInput
    _max?: inventoryMaxOrderByAggregateInput
    _min?: inventoryMinOrderByAggregateInput
    _sum?: inventorySumOrderByAggregateInput
  }

  export type inventoryScalarWhereWithAggregatesInput = {
    AND?: inventoryScalarWhereWithAggregatesInput | inventoryScalarWhereWithAggregatesInput[]
    OR?: inventoryScalarWhereWithAggregatesInput[]
    NOT?: inventoryScalarWhereWithAggregatesInput | inventoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"inventory"> | number
    reagentid?: IntWithAggregatesFilter<"inventory"> | number
    lotid?: IntWithAggregatesFilter<"inventory"> | number
    inventory_number?: IntWithAggregatesFilter<"inventory"> | number
    last_outbound_time?: DateTimeWithAggregatesFilter<"inventory"> | Date | string
    lastweek_outbound_number?: IntWithAggregatesFilter<"inventory"> | number
    using?: BoolWithAggregatesFilter<"inventory"> | boolean
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: IntFilter<"user"> | number
    username?: StringFilter<"user"> | string
    password?: StringFilter<"user"> | string
    using?: BoolFilter<"user"> | boolean
    permission?: StringFilter<"user"> | string
    operation?: OperationListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    using?: SortOrder
    permission?: SortOrder
    operation?: operationOrderByRelationAggregateInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    username?: StringFilter<"user"> | string
    password?: StringFilter<"user"> | string
    using?: BoolFilter<"user"> | boolean
    permission?: StringFilter<"user"> | string
    operation?: OperationListRelationFilter
  }, "id" | "id">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    using?: SortOrder
    permission?: SortOrder
    _count?: userCountOrderByAggregateInput
    _avg?: userAvgOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
    _sum?: userSumOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"user"> | number
    username?: StringWithAggregatesFilter<"user"> | string
    password?: StringWithAggregatesFilter<"user"> | string
    using?: BoolWithAggregatesFilter<"user"> | boolean
    permission?: StringWithAggregatesFilter<"user"> | string
  }

  export type teamCreateInput = {
    name: string
    using?: boolean
    phone: string
    note: string
    reagent?: reagentCreateNestedManyWithoutTeamInput
  }

  export type teamUncheckedCreateInput = {
    id?: number
    name: string
    using?: boolean
    phone: string
    note: string
    reagent?: reagentUncheckedCreateNestedManyWithoutTeamInput
  }

  export type teamUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    reagent?: reagentUpdateManyWithoutTeamNestedInput
  }

  export type teamUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
    reagent?: reagentUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type teamCreateManyInput = {
    id?: number
    name: string
    using?: boolean
    phone: string
    note: string
  }

  export type teamUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
  }

  export type teamUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
  }

  export type reagentCreateInput = {
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    team: teamCreateNestedOneWithoutReagentInput
    lot?: lotCreateNestedManyWithoutReagentInput
    operation?: operationCreateNestedManyWithoutReagentInput
    inventory?: inventoryCreateNestedManyWithoutReagentInput
  }

  export type reagentUncheckedCreateInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    teamid: number
    using?: boolean
    warn_days: number
    lot?: lotUncheckedCreateNestedManyWithoutReagentInput
    operation?: operationUncheckedCreateNestedManyWithoutReagentInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutReagentInput
  }

  export type reagentUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    team?: teamUpdateOneRequiredWithoutReagentNestedInput
    lot?: lotUpdateManyWithoutReagentNestedInput
    operation?: operationUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    teamid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    lot?: lotUncheckedUpdateManyWithoutReagentNestedInput
    operation?: operationUncheckedUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutReagentNestedInput
  }

  export type reagentCreateManyInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    teamid: number
    using?: boolean
    warn_days: number
  }

  export type reagentUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
  }

  export type reagentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    teamid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
  }

  export type lotCreateInput = {
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
    reagent: reagentCreateNestedOneWithoutLotInput
    operation?: operationCreateNestedManyWithoutLotInput
    inventory?: inventoryCreateNestedManyWithoutLotInput
  }

  export type lotUncheckedCreateInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    reagentid: number
    using?: boolean
    operation?: operationUncheckedCreateNestedManyWithoutLotInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutLotInput
  }

  export type lotUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    reagent?: reagentUpdateOneRequiredWithoutLotNestedInput
    operation?: operationUpdateManyWithoutLotNestedInput
    inventory?: inventoryUpdateManyWithoutLotNestedInput
  }

  export type lotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    reagentid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    operation?: operationUncheckedUpdateManyWithoutLotNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutLotNestedInput
  }

  export type lotCreateManyInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    reagentid: number
    using?: boolean
  }

  export type lotUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type lotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    reagentid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type operationCreateInput = {
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    reagent: reagentCreateNestedOneWithoutOperationInput
    lot: lotCreateNestedOneWithoutOperationInput
    user: userCreateNestedOneWithoutOperationInput
  }

  export type operationUncheckedCreateInput = {
    id?: number
    reagentid: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type operationUpdateInput = {
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    reagent?: reagentUpdateOneRequiredWithoutOperationNestedInput
    lot?: lotUpdateOneRequiredWithoutOperationNestedInput
    user?: userUpdateOneRequiredWithoutOperationNestedInput
  }

  export type operationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type operationCreateManyInput = {
    id?: number
    reagentid: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type operationUpdateManyMutationInput = {
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
  }

  export type operationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type inventoryCreateInput = {
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
    reagent: reagentCreateNestedOneWithoutInventoryInput
    lot: lotCreateNestedOneWithoutInventoryInput
  }

  export type inventoryUncheckedCreateInput = {
    id?: number
    reagentid: number
    lotid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type inventoryUpdateInput = {
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    reagent?: reagentUpdateOneRequiredWithoutInventoryNestedInput
    lot?: lotUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type inventoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type inventoryCreateManyInput = {
    id?: number
    reagentid: number
    lotid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type inventoryUpdateManyMutationInput = {
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type inventoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type userCreateInput = {
    username: string
    password: string
    using?: boolean
    permission: string
    operation?: operationCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id?: number
    username: string
    password: string
    using?: boolean
    permission: string
    operation?: operationUncheckedCreateNestedManyWithoutUserInput
  }

  export type userUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
    operation?: operationUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
    operation?: operationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateManyInput = {
    id?: number
    username: string
    password: string
    using?: boolean
    permission: string
  }

  export type userUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type userUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ReagentListRelationFilter = {
    every?: reagentWhereInput
    some?: reagentWhereInput
    none?: reagentWhereInput
  }

  export type reagentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type teamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    using?: SortOrder
    phone?: SortOrder
    note?: SortOrder
  }

  export type teamAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type teamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    using?: SortOrder
    phone?: SortOrder
    note?: SortOrder
  }

  export type teamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    using?: SortOrder
    phone?: SortOrder
    note?: SortOrder
  }

  export type teamSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TeamScalarRelationFilter = {
    is?: teamWhereInput
    isNot?: teamWhereInput
  }

  export type LotListRelationFilter = {
    every?: lotWhereInput
    some?: lotWhereInput
    none?: lotWhereInput
  }

  export type OperationListRelationFilter = {
    every?: operationWhereInput
    some?: operationWhereInput
    none?: operationWhereInput
  }

  export type InventoryListRelationFilter = {
    every?: inventoryWhereInput
    some?: inventoryWhereInput
    none?: inventoryWhereInput
  }

  export type lotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type operationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type inventoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type reagentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    specifications?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    creation_time?: SortOrder
    storage_condition?: SortOrder
    teamid?: SortOrder
    using?: SortOrder
    warn_days?: SortOrder
  }

  export type reagentAvgOrderByAggregateInput = {
    id?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    teamid?: SortOrder
    warn_days?: SortOrder
  }

  export type reagentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    specifications?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    creation_time?: SortOrder
    storage_condition?: SortOrder
    teamid?: SortOrder
    using?: SortOrder
    warn_days?: SortOrder
  }

  export type reagentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    specifications?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    creation_time?: SortOrder
    storage_condition?: SortOrder
    teamid?: SortOrder
    using?: SortOrder
    warn_days?: SortOrder
  }

  export type reagentSumOrderByAggregateInput = {
    id?: SortOrder
    warn_number?: SortOrder
    price?: SortOrder
    teamid?: SortOrder
    warn_days?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ReagentScalarRelationFilter = {
    is?: reagentWhereInput
    isNot?: reagentWhereInput
  }

  export type lotCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creation_time?: SortOrder
    expiration_date?: SortOrder
    reagentid?: SortOrder
    using?: SortOrder
  }

  export type lotAvgOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
  }

  export type lotMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creation_time?: SortOrder
    expiration_date?: SortOrder
    reagentid?: SortOrder
    using?: SortOrder
  }

  export type lotMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    creation_time?: SortOrder
    expiration_date?: SortOrder
    reagentid?: SortOrder
    using?: SortOrder
  }

  export type lotSumOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
  }

  export type LotScalarRelationFilter = {
    is?: lotWhereInput
    isNot?: lotWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type operationCountOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    operation_action?: SortOrder
    creation_time?: SortOrder
    using?: SortOrder
    barcodenumber?: SortOrder
    userid?: SortOrder
  }

  export type operationAvgOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    userid?: SortOrder
  }

  export type operationMaxOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    operation_action?: SortOrder
    creation_time?: SortOrder
    using?: SortOrder
    barcodenumber?: SortOrder
    userid?: SortOrder
  }

  export type operationMinOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    operation_action?: SortOrder
    creation_time?: SortOrder
    using?: SortOrder
    barcodenumber?: SortOrder
    userid?: SortOrder
  }

  export type operationSumOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    userid?: SortOrder
  }

  export type inventoryCountOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    last_outbound_time?: SortOrder
    lastweek_outbound_number?: SortOrder
    using?: SortOrder
  }

  export type inventoryAvgOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    lastweek_outbound_number?: SortOrder
  }

  export type inventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    last_outbound_time?: SortOrder
    lastweek_outbound_number?: SortOrder
    using?: SortOrder
  }

  export type inventoryMinOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    last_outbound_time?: SortOrder
    lastweek_outbound_number?: SortOrder
    using?: SortOrder
  }

  export type inventorySumOrderByAggregateInput = {
    id?: SortOrder
    reagentid?: SortOrder
    lotid?: SortOrder
    inventory_number?: SortOrder
    lastweek_outbound_number?: SortOrder
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    using?: SortOrder
    permission?: SortOrder
  }

  export type userAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    using?: SortOrder
    permission?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    using?: SortOrder
    permission?: SortOrder
  }

  export type userSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type reagentCreateNestedManyWithoutTeamInput = {
    create?: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput> | reagentCreateWithoutTeamInput[] | reagentUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: reagentCreateOrConnectWithoutTeamInput | reagentCreateOrConnectWithoutTeamInput[]
    createMany?: reagentCreateManyTeamInputEnvelope
    connect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
  }

  export type reagentUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput> | reagentCreateWithoutTeamInput[] | reagentUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: reagentCreateOrConnectWithoutTeamInput | reagentCreateOrConnectWithoutTeamInput[]
    createMany?: reagentCreateManyTeamInputEnvelope
    connect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type reagentUpdateManyWithoutTeamNestedInput = {
    create?: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput> | reagentCreateWithoutTeamInput[] | reagentUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: reagentCreateOrConnectWithoutTeamInput | reagentCreateOrConnectWithoutTeamInput[]
    upsert?: reagentUpsertWithWhereUniqueWithoutTeamInput | reagentUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: reagentCreateManyTeamInputEnvelope
    set?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    disconnect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    delete?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    connect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    update?: reagentUpdateWithWhereUniqueWithoutTeamInput | reagentUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: reagentUpdateManyWithWhereWithoutTeamInput | reagentUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: reagentScalarWhereInput | reagentScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type reagentUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput> | reagentCreateWithoutTeamInput[] | reagentUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: reagentCreateOrConnectWithoutTeamInput | reagentCreateOrConnectWithoutTeamInput[]
    upsert?: reagentUpsertWithWhereUniqueWithoutTeamInput | reagentUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: reagentCreateManyTeamInputEnvelope
    set?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    disconnect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    delete?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    connect?: reagentWhereUniqueInput | reagentWhereUniqueInput[]
    update?: reagentUpdateWithWhereUniqueWithoutTeamInput | reagentUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: reagentUpdateManyWithWhereWithoutTeamInput | reagentUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: reagentScalarWhereInput | reagentScalarWhereInput[]
  }

  export type teamCreateNestedOneWithoutReagentInput = {
    create?: XOR<teamCreateWithoutReagentInput, teamUncheckedCreateWithoutReagentInput>
    connectOrCreate?: teamCreateOrConnectWithoutReagentInput
    connect?: teamWhereUniqueInput
  }

  export type lotCreateNestedManyWithoutReagentInput = {
    create?: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput> | lotCreateWithoutReagentInput[] | lotUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: lotCreateOrConnectWithoutReagentInput | lotCreateOrConnectWithoutReagentInput[]
    createMany?: lotCreateManyReagentInputEnvelope
    connect?: lotWhereUniqueInput | lotWhereUniqueInput[]
  }

  export type operationCreateNestedManyWithoutReagentInput = {
    create?: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput> | operationCreateWithoutReagentInput[] | operationUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: operationCreateOrConnectWithoutReagentInput | operationCreateOrConnectWithoutReagentInput[]
    createMany?: operationCreateManyReagentInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type inventoryCreateNestedManyWithoutReagentInput = {
    create?: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput> | inventoryCreateWithoutReagentInput[] | inventoryUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutReagentInput | inventoryCreateOrConnectWithoutReagentInput[]
    createMany?: inventoryCreateManyReagentInputEnvelope
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
  }

  export type lotUncheckedCreateNestedManyWithoutReagentInput = {
    create?: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput> | lotCreateWithoutReagentInput[] | lotUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: lotCreateOrConnectWithoutReagentInput | lotCreateOrConnectWithoutReagentInput[]
    createMany?: lotCreateManyReagentInputEnvelope
    connect?: lotWhereUniqueInput | lotWhereUniqueInput[]
  }

  export type operationUncheckedCreateNestedManyWithoutReagentInput = {
    create?: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput> | operationCreateWithoutReagentInput[] | operationUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: operationCreateOrConnectWithoutReagentInput | operationCreateOrConnectWithoutReagentInput[]
    createMany?: operationCreateManyReagentInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type inventoryUncheckedCreateNestedManyWithoutReagentInput = {
    create?: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput> | inventoryCreateWithoutReagentInput[] | inventoryUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutReagentInput | inventoryCreateOrConnectWithoutReagentInput[]
    createMany?: inventoryCreateManyReagentInputEnvelope
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type teamUpdateOneRequiredWithoutReagentNestedInput = {
    create?: XOR<teamCreateWithoutReagentInput, teamUncheckedCreateWithoutReagentInput>
    connectOrCreate?: teamCreateOrConnectWithoutReagentInput
    upsert?: teamUpsertWithoutReagentInput
    connect?: teamWhereUniqueInput
    update?: XOR<XOR<teamUpdateToOneWithWhereWithoutReagentInput, teamUpdateWithoutReagentInput>, teamUncheckedUpdateWithoutReagentInput>
  }

  export type lotUpdateManyWithoutReagentNestedInput = {
    create?: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput> | lotCreateWithoutReagentInput[] | lotUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: lotCreateOrConnectWithoutReagentInput | lotCreateOrConnectWithoutReagentInput[]
    upsert?: lotUpsertWithWhereUniqueWithoutReagentInput | lotUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: lotCreateManyReagentInputEnvelope
    set?: lotWhereUniqueInput | lotWhereUniqueInput[]
    disconnect?: lotWhereUniqueInput | lotWhereUniqueInput[]
    delete?: lotWhereUniqueInput | lotWhereUniqueInput[]
    connect?: lotWhereUniqueInput | lotWhereUniqueInput[]
    update?: lotUpdateWithWhereUniqueWithoutReagentInput | lotUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: lotUpdateManyWithWhereWithoutReagentInput | lotUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: lotScalarWhereInput | lotScalarWhereInput[]
  }

  export type operationUpdateManyWithoutReagentNestedInput = {
    create?: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput> | operationCreateWithoutReagentInput[] | operationUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: operationCreateOrConnectWithoutReagentInput | operationCreateOrConnectWithoutReagentInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutReagentInput | operationUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: operationCreateManyReagentInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutReagentInput | operationUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: operationUpdateManyWithWhereWithoutReagentInput | operationUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type inventoryUpdateManyWithoutReagentNestedInput = {
    create?: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput> | inventoryCreateWithoutReagentInput[] | inventoryUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutReagentInput | inventoryCreateOrConnectWithoutReagentInput[]
    upsert?: inventoryUpsertWithWhereUniqueWithoutReagentInput | inventoryUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: inventoryCreateManyReagentInputEnvelope
    set?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    disconnect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    delete?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    update?: inventoryUpdateWithWhereUniqueWithoutReagentInput | inventoryUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: inventoryUpdateManyWithWhereWithoutReagentInput | inventoryUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
  }

  export type lotUncheckedUpdateManyWithoutReagentNestedInput = {
    create?: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput> | lotCreateWithoutReagentInput[] | lotUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: lotCreateOrConnectWithoutReagentInput | lotCreateOrConnectWithoutReagentInput[]
    upsert?: lotUpsertWithWhereUniqueWithoutReagentInput | lotUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: lotCreateManyReagentInputEnvelope
    set?: lotWhereUniqueInput | lotWhereUniqueInput[]
    disconnect?: lotWhereUniqueInput | lotWhereUniqueInput[]
    delete?: lotWhereUniqueInput | lotWhereUniqueInput[]
    connect?: lotWhereUniqueInput | lotWhereUniqueInput[]
    update?: lotUpdateWithWhereUniqueWithoutReagentInput | lotUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: lotUpdateManyWithWhereWithoutReagentInput | lotUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: lotScalarWhereInput | lotScalarWhereInput[]
  }

  export type operationUncheckedUpdateManyWithoutReagentNestedInput = {
    create?: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput> | operationCreateWithoutReagentInput[] | operationUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: operationCreateOrConnectWithoutReagentInput | operationCreateOrConnectWithoutReagentInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutReagentInput | operationUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: operationCreateManyReagentInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutReagentInput | operationUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: operationUpdateManyWithWhereWithoutReagentInput | operationUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type inventoryUncheckedUpdateManyWithoutReagentNestedInput = {
    create?: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput> | inventoryCreateWithoutReagentInput[] | inventoryUncheckedCreateWithoutReagentInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutReagentInput | inventoryCreateOrConnectWithoutReagentInput[]
    upsert?: inventoryUpsertWithWhereUniqueWithoutReagentInput | inventoryUpsertWithWhereUniqueWithoutReagentInput[]
    createMany?: inventoryCreateManyReagentInputEnvelope
    set?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    disconnect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    delete?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    update?: inventoryUpdateWithWhereUniqueWithoutReagentInput | inventoryUpdateWithWhereUniqueWithoutReagentInput[]
    updateMany?: inventoryUpdateManyWithWhereWithoutReagentInput | inventoryUpdateManyWithWhereWithoutReagentInput[]
    deleteMany?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
  }

  export type reagentCreateNestedOneWithoutLotInput = {
    create?: XOR<reagentCreateWithoutLotInput, reagentUncheckedCreateWithoutLotInput>
    connectOrCreate?: reagentCreateOrConnectWithoutLotInput
    connect?: reagentWhereUniqueInput
  }

  export type operationCreateNestedManyWithoutLotInput = {
    create?: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput> | operationCreateWithoutLotInput[] | operationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: operationCreateOrConnectWithoutLotInput | operationCreateOrConnectWithoutLotInput[]
    createMany?: operationCreateManyLotInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type inventoryCreateNestedManyWithoutLotInput = {
    create?: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput> | inventoryCreateWithoutLotInput[] | inventoryUncheckedCreateWithoutLotInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutLotInput | inventoryCreateOrConnectWithoutLotInput[]
    createMany?: inventoryCreateManyLotInputEnvelope
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
  }

  export type operationUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput> | operationCreateWithoutLotInput[] | operationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: operationCreateOrConnectWithoutLotInput | operationCreateOrConnectWithoutLotInput[]
    createMany?: operationCreateManyLotInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type inventoryUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput> | inventoryCreateWithoutLotInput[] | inventoryUncheckedCreateWithoutLotInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutLotInput | inventoryCreateOrConnectWithoutLotInput[]
    createMany?: inventoryCreateManyLotInputEnvelope
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
  }

  export type reagentUpdateOneRequiredWithoutLotNestedInput = {
    create?: XOR<reagentCreateWithoutLotInput, reagentUncheckedCreateWithoutLotInput>
    connectOrCreate?: reagentCreateOrConnectWithoutLotInput
    upsert?: reagentUpsertWithoutLotInput
    connect?: reagentWhereUniqueInput
    update?: XOR<XOR<reagentUpdateToOneWithWhereWithoutLotInput, reagentUpdateWithoutLotInput>, reagentUncheckedUpdateWithoutLotInput>
  }

  export type operationUpdateManyWithoutLotNestedInput = {
    create?: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput> | operationCreateWithoutLotInput[] | operationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: operationCreateOrConnectWithoutLotInput | operationCreateOrConnectWithoutLotInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutLotInput | operationUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: operationCreateManyLotInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutLotInput | operationUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: operationUpdateManyWithWhereWithoutLotInput | operationUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type inventoryUpdateManyWithoutLotNestedInput = {
    create?: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput> | inventoryCreateWithoutLotInput[] | inventoryUncheckedCreateWithoutLotInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutLotInput | inventoryCreateOrConnectWithoutLotInput[]
    upsert?: inventoryUpsertWithWhereUniqueWithoutLotInput | inventoryUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: inventoryCreateManyLotInputEnvelope
    set?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    disconnect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    delete?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    update?: inventoryUpdateWithWhereUniqueWithoutLotInput | inventoryUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: inventoryUpdateManyWithWhereWithoutLotInput | inventoryUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
  }

  export type operationUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput> | operationCreateWithoutLotInput[] | operationUncheckedCreateWithoutLotInput[]
    connectOrCreate?: operationCreateOrConnectWithoutLotInput | operationCreateOrConnectWithoutLotInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutLotInput | operationUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: operationCreateManyLotInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutLotInput | operationUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: operationUpdateManyWithWhereWithoutLotInput | operationUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type inventoryUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput> | inventoryCreateWithoutLotInput[] | inventoryUncheckedCreateWithoutLotInput[]
    connectOrCreate?: inventoryCreateOrConnectWithoutLotInput | inventoryCreateOrConnectWithoutLotInput[]
    upsert?: inventoryUpsertWithWhereUniqueWithoutLotInput | inventoryUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: inventoryCreateManyLotInputEnvelope
    set?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    disconnect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    delete?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    connect?: inventoryWhereUniqueInput | inventoryWhereUniqueInput[]
    update?: inventoryUpdateWithWhereUniqueWithoutLotInput | inventoryUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: inventoryUpdateManyWithWhereWithoutLotInput | inventoryUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
  }

  export type reagentCreateNestedOneWithoutOperationInput = {
    create?: XOR<reagentCreateWithoutOperationInput, reagentUncheckedCreateWithoutOperationInput>
    connectOrCreate?: reagentCreateOrConnectWithoutOperationInput
    connect?: reagentWhereUniqueInput
  }

  export type lotCreateNestedOneWithoutOperationInput = {
    create?: XOR<lotCreateWithoutOperationInput, lotUncheckedCreateWithoutOperationInput>
    connectOrCreate?: lotCreateOrConnectWithoutOperationInput
    connect?: lotWhereUniqueInput
  }

  export type userCreateNestedOneWithoutOperationInput = {
    create?: XOR<userCreateWithoutOperationInput, userUncheckedCreateWithoutOperationInput>
    connectOrCreate?: userCreateOrConnectWithoutOperationInput
    connect?: userWhereUniqueInput
  }

  export type reagentUpdateOneRequiredWithoutOperationNestedInput = {
    create?: XOR<reagentCreateWithoutOperationInput, reagentUncheckedCreateWithoutOperationInput>
    connectOrCreate?: reagentCreateOrConnectWithoutOperationInput
    upsert?: reagentUpsertWithoutOperationInput
    connect?: reagentWhereUniqueInput
    update?: XOR<XOR<reagentUpdateToOneWithWhereWithoutOperationInput, reagentUpdateWithoutOperationInput>, reagentUncheckedUpdateWithoutOperationInput>
  }

  export type lotUpdateOneRequiredWithoutOperationNestedInput = {
    create?: XOR<lotCreateWithoutOperationInput, lotUncheckedCreateWithoutOperationInput>
    connectOrCreate?: lotCreateOrConnectWithoutOperationInput
    upsert?: lotUpsertWithoutOperationInput
    connect?: lotWhereUniqueInput
    update?: XOR<XOR<lotUpdateToOneWithWhereWithoutOperationInput, lotUpdateWithoutOperationInput>, lotUncheckedUpdateWithoutOperationInput>
  }

  export type userUpdateOneRequiredWithoutOperationNestedInput = {
    create?: XOR<userCreateWithoutOperationInput, userUncheckedCreateWithoutOperationInput>
    connectOrCreate?: userCreateOrConnectWithoutOperationInput
    upsert?: userUpsertWithoutOperationInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutOperationInput, userUpdateWithoutOperationInput>, userUncheckedUpdateWithoutOperationInput>
  }

  export type reagentCreateNestedOneWithoutInventoryInput = {
    create?: XOR<reagentCreateWithoutInventoryInput, reagentUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: reagentCreateOrConnectWithoutInventoryInput
    connect?: reagentWhereUniqueInput
  }

  export type lotCreateNestedOneWithoutInventoryInput = {
    create?: XOR<lotCreateWithoutInventoryInput, lotUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: lotCreateOrConnectWithoutInventoryInput
    connect?: lotWhereUniqueInput
  }

  export type reagentUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<reagentCreateWithoutInventoryInput, reagentUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: reagentCreateOrConnectWithoutInventoryInput
    upsert?: reagentUpsertWithoutInventoryInput
    connect?: reagentWhereUniqueInput
    update?: XOR<XOR<reagentUpdateToOneWithWhereWithoutInventoryInput, reagentUpdateWithoutInventoryInput>, reagentUncheckedUpdateWithoutInventoryInput>
  }

  export type lotUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<lotCreateWithoutInventoryInput, lotUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: lotCreateOrConnectWithoutInventoryInput
    upsert?: lotUpsertWithoutInventoryInput
    connect?: lotWhereUniqueInput
    update?: XOR<XOR<lotUpdateToOneWithWhereWithoutInventoryInput, lotUpdateWithoutInventoryInput>, lotUncheckedUpdateWithoutInventoryInput>
  }

  export type operationCreateNestedManyWithoutUserInput = {
    create?: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput> | operationCreateWithoutUserInput[] | operationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: operationCreateOrConnectWithoutUserInput | operationCreateOrConnectWithoutUserInput[]
    createMany?: operationCreateManyUserInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type operationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput> | operationCreateWithoutUserInput[] | operationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: operationCreateOrConnectWithoutUserInput | operationCreateOrConnectWithoutUserInput[]
    createMany?: operationCreateManyUserInputEnvelope
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
  }

  export type operationUpdateManyWithoutUserNestedInput = {
    create?: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput> | operationCreateWithoutUserInput[] | operationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: operationCreateOrConnectWithoutUserInput | operationCreateOrConnectWithoutUserInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutUserInput | operationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: operationCreateManyUserInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutUserInput | operationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: operationUpdateManyWithWhereWithoutUserInput | operationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type operationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput> | operationCreateWithoutUserInput[] | operationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: operationCreateOrConnectWithoutUserInput | operationCreateOrConnectWithoutUserInput[]
    upsert?: operationUpsertWithWhereUniqueWithoutUserInput | operationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: operationCreateManyUserInputEnvelope
    set?: operationWhereUniqueInput | operationWhereUniqueInput[]
    disconnect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    delete?: operationWhereUniqueInput | operationWhereUniqueInput[]
    connect?: operationWhereUniqueInput | operationWhereUniqueInput[]
    update?: operationUpdateWithWhereUniqueWithoutUserInput | operationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: operationUpdateManyWithWhereWithoutUserInput | operationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: operationScalarWhereInput | operationScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type reagentCreateWithoutTeamInput = {
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    lot?: lotCreateNestedManyWithoutReagentInput
    operation?: operationCreateNestedManyWithoutReagentInput
    inventory?: inventoryCreateNestedManyWithoutReagentInput
  }

  export type reagentUncheckedCreateWithoutTeamInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    lot?: lotUncheckedCreateNestedManyWithoutReagentInput
    operation?: operationUncheckedCreateNestedManyWithoutReagentInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutReagentInput
  }

  export type reagentCreateOrConnectWithoutTeamInput = {
    where: reagentWhereUniqueInput
    create: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput>
  }

  export type reagentCreateManyTeamInputEnvelope = {
    data: reagentCreateManyTeamInput | reagentCreateManyTeamInput[]
  }

  export type reagentUpsertWithWhereUniqueWithoutTeamInput = {
    where: reagentWhereUniqueInput
    update: XOR<reagentUpdateWithoutTeamInput, reagentUncheckedUpdateWithoutTeamInput>
    create: XOR<reagentCreateWithoutTeamInput, reagentUncheckedCreateWithoutTeamInput>
  }

  export type reagentUpdateWithWhereUniqueWithoutTeamInput = {
    where: reagentWhereUniqueInput
    data: XOR<reagentUpdateWithoutTeamInput, reagentUncheckedUpdateWithoutTeamInput>
  }

  export type reagentUpdateManyWithWhereWithoutTeamInput = {
    where: reagentScalarWhereInput
    data: XOR<reagentUpdateManyMutationInput, reagentUncheckedUpdateManyWithoutTeamInput>
  }

  export type reagentScalarWhereInput = {
    AND?: reagentScalarWhereInput | reagentScalarWhereInput[]
    OR?: reagentScalarWhereInput[]
    NOT?: reagentScalarWhereInput | reagentScalarWhereInput[]
    id?: IntFilter<"reagent"> | number
    name?: StringFilter<"reagent"> | string
    specifications?: StringFilter<"reagent"> | string
    warn_number?: IntFilter<"reagent"> | number
    price?: IntFilter<"reagent"> | number
    creation_time?: DateTimeFilter<"reagent"> | Date | string
    storage_condition?: StringFilter<"reagent"> | string
    teamid?: IntFilter<"reagent"> | number
    using?: BoolFilter<"reagent"> | boolean
    warn_days?: IntFilter<"reagent"> | number
  }

  export type teamCreateWithoutReagentInput = {
    name: string
    using?: boolean
    phone: string
    note: string
  }

  export type teamUncheckedCreateWithoutReagentInput = {
    id?: number
    name: string
    using?: boolean
    phone: string
    note: string
  }

  export type teamCreateOrConnectWithoutReagentInput = {
    where: teamWhereUniqueInput
    create: XOR<teamCreateWithoutReagentInput, teamUncheckedCreateWithoutReagentInput>
  }

  export type lotCreateWithoutReagentInput = {
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
    operation?: operationCreateNestedManyWithoutLotInput
    inventory?: inventoryCreateNestedManyWithoutLotInput
  }

  export type lotUncheckedCreateWithoutReagentInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
    operation?: operationUncheckedCreateNestedManyWithoutLotInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutLotInput
  }

  export type lotCreateOrConnectWithoutReagentInput = {
    where: lotWhereUniqueInput
    create: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput>
  }

  export type lotCreateManyReagentInputEnvelope = {
    data: lotCreateManyReagentInput | lotCreateManyReagentInput[]
  }

  export type operationCreateWithoutReagentInput = {
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    lot: lotCreateNestedOneWithoutOperationInput
    user: userCreateNestedOneWithoutOperationInput
  }

  export type operationUncheckedCreateWithoutReagentInput = {
    id?: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type operationCreateOrConnectWithoutReagentInput = {
    where: operationWhereUniqueInput
    create: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput>
  }

  export type operationCreateManyReagentInputEnvelope = {
    data: operationCreateManyReagentInput | operationCreateManyReagentInput[]
  }

  export type inventoryCreateWithoutReagentInput = {
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
    lot: lotCreateNestedOneWithoutInventoryInput
  }

  export type inventoryUncheckedCreateWithoutReagentInput = {
    id?: number
    lotid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type inventoryCreateOrConnectWithoutReagentInput = {
    where: inventoryWhereUniqueInput
    create: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput>
  }

  export type inventoryCreateManyReagentInputEnvelope = {
    data: inventoryCreateManyReagentInput | inventoryCreateManyReagentInput[]
  }

  export type teamUpsertWithoutReagentInput = {
    update: XOR<teamUpdateWithoutReagentInput, teamUncheckedUpdateWithoutReagentInput>
    create: XOR<teamCreateWithoutReagentInput, teamUncheckedCreateWithoutReagentInput>
    where?: teamWhereInput
  }

  export type teamUpdateToOneWithWhereWithoutReagentInput = {
    where?: teamWhereInput
    data: XOR<teamUpdateWithoutReagentInput, teamUncheckedUpdateWithoutReagentInput>
  }

  export type teamUpdateWithoutReagentInput = {
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
  }

  export type teamUncheckedUpdateWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    phone?: StringFieldUpdateOperationsInput | string
    note?: StringFieldUpdateOperationsInput | string
  }

  export type lotUpsertWithWhereUniqueWithoutReagentInput = {
    where: lotWhereUniqueInput
    update: XOR<lotUpdateWithoutReagentInput, lotUncheckedUpdateWithoutReagentInput>
    create: XOR<lotCreateWithoutReagentInput, lotUncheckedCreateWithoutReagentInput>
  }

  export type lotUpdateWithWhereUniqueWithoutReagentInput = {
    where: lotWhereUniqueInput
    data: XOR<lotUpdateWithoutReagentInput, lotUncheckedUpdateWithoutReagentInput>
  }

  export type lotUpdateManyWithWhereWithoutReagentInput = {
    where: lotScalarWhereInput
    data: XOR<lotUpdateManyMutationInput, lotUncheckedUpdateManyWithoutReagentInput>
  }

  export type lotScalarWhereInput = {
    AND?: lotScalarWhereInput | lotScalarWhereInput[]
    OR?: lotScalarWhereInput[]
    NOT?: lotScalarWhereInput | lotScalarWhereInput[]
    id?: IntFilter<"lot"> | number
    name?: StringFilter<"lot"> | string
    creation_time?: DateTimeFilter<"lot"> | Date | string
    expiration_date?: DateTimeFilter<"lot"> | Date | string
    reagentid?: IntFilter<"lot"> | number
    using?: BoolFilter<"lot"> | boolean
  }

  export type operationUpsertWithWhereUniqueWithoutReagentInput = {
    where: operationWhereUniqueInput
    update: XOR<operationUpdateWithoutReagentInput, operationUncheckedUpdateWithoutReagentInput>
    create: XOR<operationCreateWithoutReagentInput, operationUncheckedCreateWithoutReagentInput>
  }

  export type operationUpdateWithWhereUniqueWithoutReagentInput = {
    where: operationWhereUniqueInput
    data: XOR<operationUpdateWithoutReagentInput, operationUncheckedUpdateWithoutReagentInput>
  }

  export type operationUpdateManyWithWhereWithoutReagentInput = {
    where: operationScalarWhereInput
    data: XOR<operationUpdateManyMutationInput, operationUncheckedUpdateManyWithoutReagentInput>
  }

  export type operationScalarWhereInput = {
    AND?: operationScalarWhereInput | operationScalarWhereInput[]
    OR?: operationScalarWhereInput[]
    NOT?: operationScalarWhereInput | operationScalarWhereInput[]
    id?: IntFilter<"operation"> | number
    reagentid?: IntFilter<"operation"> | number
    lotid?: IntFilter<"operation"> | number
    operation_action?: StringFilter<"operation"> | string
    creation_time?: DateTimeFilter<"operation"> | Date | string
    using?: BoolFilter<"operation"> | boolean
    barcodenumber?: StringFilter<"operation"> | string
    userid?: IntFilter<"operation"> | number
  }

  export type inventoryUpsertWithWhereUniqueWithoutReagentInput = {
    where: inventoryWhereUniqueInput
    update: XOR<inventoryUpdateWithoutReagentInput, inventoryUncheckedUpdateWithoutReagentInput>
    create: XOR<inventoryCreateWithoutReagentInput, inventoryUncheckedCreateWithoutReagentInput>
  }

  export type inventoryUpdateWithWhereUniqueWithoutReagentInput = {
    where: inventoryWhereUniqueInput
    data: XOR<inventoryUpdateWithoutReagentInput, inventoryUncheckedUpdateWithoutReagentInput>
  }

  export type inventoryUpdateManyWithWhereWithoutReagentInput = {
    where: inventoryScalarWhereInput
    data: XOR<inventoryUpdateManyMutationInput, inventoryUncheckedUpdateManyWithoutReagentInput>
  }

  export type inventoryScalarWhereInput = {
    AND?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
    OR?: inventoryScalarWhereInput[]
    NOT?: inventoryScalarWhereInput | inventoryScalarWhereInput[]
    id?: IntFilter<"inventory"> | number
    reagentid?: IntFilter<"inventory"> | number
    lotid?: IntFilter<"inventory"> | number
    inventory_number?: IntFilter<"inventory"> | number
    last_outbound_time?: DateTimeFilter<"inventory"> | Date | string
    lastweek_outbound_number?: IntFilter<"inventory"> | number
    using?: BoolFilter<"inventory"> | boolean
  }

  export type reagentCreateWithoutLotInput = {
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    team: teamCreateNestedOneWithoutReagentInput
    operation?: operationCreateNestedManyWithoutReagentInput
    inventory?: inventoryCreateNestedManyWithoutReagentInput
  }

  export type reagentUncheckedCreateWithoutLotInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    teamid: number
    using?: boolean
    warn_days: number
    operation?: operationUncheckedCreateNestedManyWithoutReagentInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutReagentInput
  }

  export type reagentCreateOrConnectWithoutLotInput = {
    where: reagentWhereUniqueInput
    create: XOR<reagentCreateWithoutLotInput, reagentUncheckedCreateWithoutLotInput>
  }

  export type operationCreateWithoutLotInput = {
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    reagent: reagentCreateNestedOneWithoutOperationInput
    user: userCreateNestedOneWithoutOperationInput
  }

  export type operationUncheckedCreateWithoutLotInput = {
    id?: number
    reagentid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type operationCreateOrConnectWithoutLotInput = {
    where: operationWhereUniqueInput
    create: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput>
  }

  export type operationCreateManyLotInputEnvelope = {
    data: operationCreateManyLotInput | operationCreateManyLotInput[]
  }

  export type inventoryCreateWithoutLotInput = {
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
    reagent: reagentCreateNestedOneWithoutInventoryInput
  }

  export type inventoryUncheckedCreateWithoutLotInput = {
    id?: number
    reagentid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type inventoryCreateOrConnectWithoutLotInput = {
    where: inventoryWhereUniqueInput
    create: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput>
  }

  export type inventoryCreateManyLotInputEnvelope = {
    data: inventoryCreateManyLotInput | inventoryCreateManyLotInput[]
  }

  export type reagentUpsertWithoutLotInput = {
    update: XOR<reagentUpdateWithoutLotInput, reagentUncheckedUpdateWithoutLotInput>
    create: XOR<reagentCreateWithoutLotInput, reagentUncheckedCreateWithoutLotInput>
    where?: reagentWhereInput
  }

  export type reagentUpdateToOneWithWhereWithoutLotInput = {
    where?: reagentWhereInput
    data: XOR<reagentUpdateWithoutLotInput, reagentUncheckedUpdateWithoutLotInput>
  }

  export type reagentUpdateWithoutLotInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    team?: teamUpdateOneRequiredWithoutReagentNestedInput
    operation?: operationUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateWithoutLotInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    teamid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    operation?: operationUncheckedUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutReagentNestedInput
  }

  export type operationUpsertWithWhereUniqueWithoutLotInput = {
    where: operationWhereUniqueInput
    update: XOR<operationUpdateWithoutLotInput, operationUncheckedUpdateWithoutLotInput>
    create: XOR<operationCreateWithoutLotInput, operationUncheckedCreateWithoutLotInput>
  }

  export type operationUpdateWithWhereUniqueWithoutLotInput = {
    where: operationWhereUniqueInput
    data: XOR<operationUpdateWithoutLotInput, operationUncheckedUpdateWithoutLotInput>
  }

  export type operationUpdateManyWithWhereWithoutLotInput = {
    where: operationScalarWhereInput
    data: XOR<operationUpdateManyMutationInput, operationUncheckedUpdateManyWithoutLotInput>
  }

  export type inventoryUpsertWithWhereUniqueWithoutLotInput = {
    where: inventoryWhereUniqueInput
    update: XOR<inventoryUpdateWithoutLotInput, inventoryUncheckedUpdateWithoutLotInput>
    create: XOR<inventoryCreateWithoutLotInput, inventoryUncheckedCreateWithoutLotInput>
  }

  export type inventoryUpdateWithWhereUniqueWithoutLotInput = {
    where: inventoryWhereUniqueInput
    data: XOR<inventoryUpdateWithoutLotInput, inventoryUncheckedUpdateWithoutLotInput>
  }

  export type inventoryUpdateManyWithWhereWithoutLotInput = {
    where: inventoryScalarWhereInput
    data: XOR<inventoryUpdateManyMutationInput, inventoryUncheckedUpdateManyWithoutLotInput>
  }

  export type reagentCreateWithoutOperationInput = {
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    team: teamCreateNestedOneWithoutReagentInput
    lot?: lotCreateNestedManyWithoutReagentInput
    inventory?: inventoryCreateNestedManyWithoutReagentInput
  }

  export type reagentUncheckedCreateWithoutOperationInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    teamid: number
    using?: boolean
    warn_days: number
    lot?: lotUncheckedCreateNestedManyWithoutReagentInput
    inventory?: inventoryUncheckedCreateNestedManyWithoutReagentInput
  }

  export type reagentCreateOrConnectWithoutOperationInput = {
    where: reagentWhereUniqueInput
    create: XOR<reagentCreateWithoutOperationInput, reagentUncheckedCreateWithoutOperationInput>
  }

  export type lotCreateWithoutOperationInput = {
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
    reagent: reagentCreateNestedOneWithoutLotInput
    inventory?: inventoryCreateNestedManyWithoutLotInput
  }

  export type lotUncheckedCreateWithoutOperationInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    reagentid: number
    using?: boolean
    inventory?: inventoryUncheckedCreateNestedManyWithoutLotInput
  }

  export type lotCreateOrConnectWithoutOperationInput = {
    where: lotWhereUniqueInput
    create: XOR<lotCreateWithoutOperationInput, lotUncheckedCreateWithoutOperationInput>
  }

  export type userCreateWithoutOperationInput = {
    username: string
    password: string
    using?: boolean
    permission: string
  }

  export type userUncheckedCreateWithoutOperationInput = {
    id?: number
    username: string
    password: string
    using?: boolean
    permission: string
  }

  export type userCreateOrConnectWithoutOperationInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutOperationInput, userUncheckedCreateWithoutOperationInput>
  }

  export type reagentUpsertWithoutOperationInput = {
    update: XOR<reagentUpdateWithoutOperationInput, reagentUncheckedUpdateWithoutOperationInput>
    create: XOR<reagentCreateWithoutOperationInput, reagentUncheckedCreateWithoutOperationInput>
    where?: reagentWhereInput
  }

  export type reagentUpdateToOneWithWhereWithoutOperationInput = {
    where?: reagentWhereInput
    data: XOR<reagentUpdateWithoutOperationInput, reagentUncheckedUpdateWithoutOperationInput>
  }

  export type reagentUpdateWithoutOperationInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    team?: teamUpdateOneRequiredWithoutReagentNestedInput
    lot?: lotUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateWithoutOperationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    teamid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    lot?: lotUncheckedUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutReagentNestedInput
  }

  export type lotUpsertWithoutOperationInput = {
    update: XOR<lotUpdateWithoutOperationInput, lotUncheckedUpdateWithoutOperationInput>
    create: XOR<lotCreateWithoutOperationInput, lotUncheckedCreateWithoutOperationInput>
    where?: lotWhereInput
  }

  export type lotUpdateToOneWithWhereWithoutOperationInput = {
    where?: lotWhereInput
    data: XOR<lotUpdateWithoutOperationInput, lotUncheckedUpdateWithoutOperationInput>
  }

  export type lotUpdateWithoutOperationInput = {
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    reagent?: reagentUpdateOneRequiredWithoutLotNestedInput
    inventory?: inventoryUpdateManyWithoutLotNestedInput
  }

  export type lotUncheckedUpdateWithoutOperationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    reagentid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    inventory?: inventoryUncheckedUpdateManyWithoutLotNestedInput
  }

  export type userUpsertWithoutOperationInput = {
    update: XOR<userUpdateWithoutOperationInput, userUncheckedUpdateWithoutOperationInput>
    create: XOR<userCreateWithoutOperationInput, userUncheckedCreateWithoutOperationInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutOperationInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutOperationInput, userUncheckedUpdateWithoutOperationInput>
  }

  export type userUpdateWithoutOperationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type userUncheckedUpdateWithoutOperationInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    permission?: StringFieldUpdateOperationsInput | string
  }

  export type reagentCreateWithoutInventoryInput = {
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
    team: teamCreateNestedOneWithoutReagentInput
    lot?: lotCreateNestedManyWithoutReagentInput
    operation?: operationCreateNestedManyWithoutReagentInput
  }

  export type reagentUncheckedCreateWithoutInventoryInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    teamid: number
    using?: boolean
    warn_days: number
    lot?: lotUncheckedCreateNestedManyWithoutReagentInput
    operation?: operationUncheckedCreateNestedManyWithoutReagentInput
  }

  export type reagentCreateOrConnectWithoutInventoryInput = {
    where: reagentWhereUniqueInput
    create: XOR<reagentCreateWithoutInventoryInput, reagentUncheckedCreateWithoutInventoryInput>
  }

  export type lotCreateWithoutInventoryInput = {
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
    reagent: reagentCreateNestedOneWithoutLotInput
    operation?: operationCreateNestedManyWithoutLotInput
  }

  export type lotUncheckedCreateWithoutInventoryInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    reagentid: number
    using?: boolean
    operation?: operationUncheckedCreateNestedManyWithoutLotInput
  }

  export type lotCreateOrConnectWithoutInventoryInput = {
    where: lotWhereUniqueInput
    create: XOR<lotCreateWithoutInventoryInput, lotUncheckedCreateWithoutInventoryInput>
  }

  export type reagentUpsertWithoutInventoryInput = {
    update: XOR<reagentUpdateWithoutInventoryInput, reagentUncheckedUpdateWithoutInventoryInput>
    create: XOR<reagentCreateWithoutInventoryInput, reagentUncheckedCreateWithoutInventoryInput>
    where?: reagentWhereInput
  }

  export type reagentUpdateToOneWithWhereWithoutInventoryInput = {
    where?: reagentWhereInput
    data: XOR<reagentUpdateWithoutInventoryInput, reagentUncheckedUpdateWithoutInventoryInput>
  }

  export type reagentUpdateWithoutInventoryInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    team?: teamUpdateOneRequiredWithoutReagentNestedInput
    lot?: lotUpdateManyWithoutReagentNestedInput
    operation?: operationUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateWithoutInventoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    teamid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    lot?: lotUncheckedUpdateManyWithoutReagentNestedInput
    operation?: operationUncheckedUpdateManyWithoutReagentNestedInput
  }

  export type lotUpsertWithoutInventoryInput = {
    update: XOR<lotUpdateWithoutInventoryInput, lotUncheckedUpdateWithoutInventoryInput>
    create: XOR<lotCreateWithoutInventoryInput, lotUncheckedCreateWithoutInventoryInput>
    where?: lotWhereInput
  }

  export type lotUpdateToOneWithWhereWithoutInventoryInput = {
    where?: lotWhereInput
    data: XOR<lotUpdateWithoutInventoryInput, lotUncheckedUpdateWithoutInventoryInput>
  }

  export type lotUpdateWithoutInventoryInput = {
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    reagent?: reagentUpdateOneRequiredWithoutLotNestedInput
    operation?: operationUpdateManyWithoutLotNestedInput
  }

  export type lotUncheckedUpdateWithoutInventoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    reagentid?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    operation?: operationUncheckedUpdateManyWithoutLotNestedInput
  }

  export type operationCreateWithoutUserInput = {
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    reagent: reagentCreateNestedOneWithoutOperationInput
    lot: lotCreateNestedOneWithoutOperationInput
  }

  export type operationUncheckedCreateWithoutUserInput = {
    id?: number
    reagentid: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
  }

  export type operationCreateOrConnectWithoutUserInput = {
    where: operationWhereUniqueInput
    create: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput>
  }

  export type operationCreateManyUserInputEnvelope = {
    data: operationCreateManyUserInput | operationCreateManyUserInput[]
  }

  export type operationUpsertWithWhereUniqueWithoutUserInput = {
    where: operationWhereUniqueInput
    update: XOR<operationUpdateWithoutUserInput, operationUncheckedUpdateWithoutUserInput>
    create: XOR<operationCreateWithoutUserInput, operationUncheckedCreateWithoutUserInput>
  }

  export type operationUpdateWithWhereUniqueWithoutUserInput = {
    where: operationWhereUniqueInput
    data: XOR<operationUpdateWithoutUserInput, operationUncheckedUpdateWithoutUserInput>
  }

  export type operationUpdateManyWithWhereWithoutUserInput = {
    where: operationScalarWhereInput
    data: XOR<operationUpdateManyMutationInput, operationUncheckedUpdateManyWithoutUserInput>
  }

  export type reagentCreateManyTeamInput = {
    id?: number
    name: string
    specifications: string
    warn_number: number
    price: number
    creation_time?: Date | string
    storage_condition: string
    using?: boolean
    warn_days: number
  }

  export type reagentUpdateWithoutTeamInput = {
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    lot?: lotUpdateManyWithoutReagentNestedInput
    operation?: operationUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateWithoutTeamInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
    lot?: lotUncheckedUpdateManyWithoutReagentNestedInput
    operation?: operationUncheckedUpdateManyWithoutReagentNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutReagentNestedInput
  }

  export type reagentUncheckedUpdateManyWithoutTeamInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    specifications?: StringFieldUpdateOperationsInput | string
    warn_number?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    storage_condition?: StringFieldUpdateOperationsInput | string
    using?: BoolFieldUpdateOperationsInput | boolean
    warn_days?: IntFieldUpdateOperationsInput | number
  }

  export type lotCreateManyReagentInput = {
    id?: number
    name: string
    creation_time?: Date | string
    expiration_date: Date | string
    using?: boolean
  }

  export type operationCreateManyReagentInput = {
    id?: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type inventoryCreateManyReagentInput = {
    id?: number
    lotid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type lotUpdateWithoutReagentInput = {
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    operation?: operationUpdateManyWithoutLotNestedInput
    inventory?: inventoryUpdateManyWithoutLotNestedInput
  }

  export type lotUncheckedUpdateWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    operation?: operationUncheckedUpdateManyWithoutLotNestedInput
    inventory?: inventoryUncheckedUpdateManyWithoutLotNestedInput
  }

  export type lotUncheckedUpdateManyWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    expiration_date?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type operationUpdateWithoutReagentInput = {
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    lot?: lotUpdateOneRequiredWithoutOperationNestedInput
    user?: userUpdateOneRequiredWithoutOperationNestedInput
  }

  export type operationUncheckedUpdateWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type operationUncheckedUpdateManyWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type inventoryUpdateWithoutReagentInput = {
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    lot?: lotUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type inventoryUncheckedUpdateWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type inventoryUncheckedUpdateManyWithoutReagentInput = {
    id?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type operationCreateManyLotInput = {
    id?: number
    reagentid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
    userid: number
  }

  export type inventoryCreateManyLotInput = {
    id?: number
    reagentid: number
    inventory_number: number
    last_outbound_time: Date | string
    lastweek_outbound_number: number
    using?: boolean
  }

  export type operationUpdateWithoutLotInput = {
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    reagent?: reagentUpdateOneRequiredWithoutOperationNestedInput
    user?: userUpdateOneRequiredWithoutOperationNestedInput
  }

  export type operationUncheckedUpdateWithoutLotInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type operationUncheckedUpdateManyWithoutLotInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    userid?: IntFieldUpdateOperationsInput | number
  }

  export type inventoryUpdateWithoutLotInput = {
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
    reagent?: reagentUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type inventoryUncheckedUpdateWithoutLotInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type inventoryUncheckedUpdateManyWithoutLotInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    inventory_number?: IntFieldUpdateOperationsInput | number
    last_outbound_time?: DateTimeFieldUpdateOperationsInput | Date | string
    lastweek_outbound_number?: IntFieldUpdateOperationsInput | number
    using?: BoolFieldUpdateOperationsInput | boolean
  }

  export type operationCreateManyUserInput = {
    id?: number
    reagentid: number
    lotid: number
    operation_action: string
    creation_time?: Date | string
    using?: boolean
    barcodenumber: string
  }

  export type operationUpdateWithoutUserInput = {
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
    reagent?: reagentUpdateOneRequiredWithoutOperationNestedInput
    lot?: lotUpdateOneRequiredWithoutOperationNestedInput
  }

  export type operationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
  }

  export type operationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    reagentid?: IntFieldUpdateOperationsInput | number
    lotid?: IntFieldUpdateOperationsInput | number
    operation_action?: StringFieldUpdateOperationsInput | string
    creation_time?: DateTimeFieldUpdateOperationsInput | Date | string
    using?: BoolFieldUpdateOperationsInput | boolean
    barcodenumber?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}