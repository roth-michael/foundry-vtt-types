import type { InexactPartial, FixedInstanceType, Identity } from "fvtt-types/utils";
import type { PoolRollParseNode } from "../_types.d.mts";

import type RollTerm from "./term.d.mts";
import type DiceTerm from "./dice.d.mts";
import type Die from "./die.d.mts";

/**
 * A type of RollTerm which encloses a pool of multiple inner Rolls which are evaluated jointly.
 *
 * A dice pool represents a set of Roll expressions which are collectively modified to compute an effective total
 * across all Rolls in the pool. The final total for the pool is defined as the sum over kept rolls, relative to any
 * success count or margin.
 *
 * @example Keep the highest of the 3 roll expressions
 * ```typescript
 * let pool = new PoolTerm({
 *   terms: ["4d6", "3d8 - 1", "2d10 + 3"],
 *   modifiers: ["kh"]
 * });
 * pool.evaluate();
 * ```
 */
declare class PoolTerm extends RollTerm {
  constructor(terms?: PoolTerm.PoolTermConstructorData);

  /**
   * The original provided terms to the Dice Pool
   */
  terms: string[];

  /**
   * The string modifiers applied to resolve the pool
   */
  modifiers: (keyof PoolTerm.Modifiers)[];

  /**
   * Each component term of a dice pool is evaluated as a Roll instance
   */
  rolls: Roll[];

  /**
   * The array of dice pool results which have been rolled
   */
  results: DiceTerm.Result[];

  /**
   * Define the modifiers that can be used for this particular DiceTerm type.
   */
  static MODIFIERS: PoolTerm.Modifiers;

  /**
   * The regular expression pattern used to identify the opening of a dice pool expression.
   * @defaultValue `/{/g`
   */
  static OPEN_REGEXP: RegExp;

  /**
   * A regular expression pattern used to identify the closing of a dice pool expression
   * @defaultValue
   * ```typescript
   * new RegExp(`}${DiceTerm.MODIFIERS_REGEXP_STRING}?(?:\\$\\$F[0-9]+\\$\\$)?`, "g");
   * ```
   */
  static CLOSE_REGEXP: RegExp;

  /**
   * A regular expression pattern used to match the entirety of a DicePool expression.
   * @defaultValue
   * ```typescript
   * new RegExp(`{([^}]+)}${DiceTerm.MODIFIERS_REGEXP_STRING}?(?:\\$\\$F[0-9]+\\$\\$)?`);
   * ```
   */
  static REGEXP: RegExp;

  /**
   * @defaultValue `["terms", "modifiers", "rolls", "results"]`
   */
  static SERIALIZE_ATTRIBUTES: string[];

  /* -------------------------------------------- */
  /*  Dice Pool Attributes                        */
  /* -------------------------------------------- */

  /**
   * Return an Array of each individual DiceTerm instances contained within the PoolTerm.
   */
  get dice(): DiceTerm[];

  override get expression(): string;

  override get total(): undefined | number;

  /**
   * Return an array of rolled values which are still active within the PoolTerm
   */
  get values(): number[];

  override get isDeterministic(): boolean;

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param args - Arguments passed to each contained Roll#alter method.
   * @returns The altered pool
   */
  alter(...args: Parameters<Roll["alter"]>): this;

  protected override _evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): this | Promise<this>;

  protected _evaluateAsync(options?: InexactPartial<RollTerm.EvaluationOptions>): Promise<this>;

  protected _evaluateSync(options?: InexactPartial<RollTerm.EvaluationOptions>): this;

  /**
   * Use the same logic as for the DiceTerm to avoid duplication
   * @see {@link DiceTerm._evaluateModifiers | `DiceTerm#_evaluateModifiers`}
   */
  protected _evaluateModifiers(): void;

  /**
   * Use the same logic as for the DiceTerm to avoid duplication
   * @see {@link DiceTerm._evaluateModifier | `DiceTerm#_evaluateModifier`}
   */
  protected _evaluateModifier(command: string, modifier: string): void;

  /* -------------------------------------------- */
  /*  Saving and Loading                          */
  /* -------------------------------------------- */

  protected static override _fromData<T extends RollTerm.AnyConstructor>(
    this: T,
    data: Record<string, unknown>,
  ): FixedInstanceType<T>;

  toJSON(): Record<string, unknown>;

  /**
   * Given a string formula, create and return an evaluated PoolTerm object
   * @param formula - The string formula to parse
   * @param options - Additional options applied to the PoolTerm
   * @returns The evaluated PoolTerm object or null if the formula is invalid
   */
  static fromExpression<T extends RollTerm.AnyConstructor>(
    this: T,
    formula: string,
    options?: RollTerm.Options,
  ): FixedInstanceType<T> | null;

  /**
   * Create a PoolTerm by providing an array of existing Roll objects
   * @param rolls - An array of Roll objects from which to create the pool
   * @returns The constructed PoolTerm comprised of the provided rolls
   */
  static fromRolls<T extends PoolTerm.AnyConstructor>(this: T, rolls?: Roll[]): FixedInstanceType<T>;

  /** Construct a PoolTerm from parser information. */
  static fromParseNode(node: PoolRollParseNode): PoolTerm;

  /* -------------------------------------------- */
  /*  Modifiers                                   */
  /* -------------------------------------------- */

  /**
   * Keep a certain number of highest or lowest dice rolls from the result set.
   * @example
   * `{1d6,1d8,1d10,1d12}kh2` Keep the 2 best rolls from the pool
   * @example
   * `{1d12,6}kl` Keep the lowest result in the pool
   *
   * @param modifier - The matched modifier query
   */
  keep(modifier: string): ReturnType<Die["keep"]>;

  /**
   * Keep a certain number of highest or lowest dice rolls from the result set.
   * @example
   * `{1d6,1d8,1d10,1d12}dl3` Drop the 3 worst results in the pool
   * @example
   * `{1d12,6}dh` Drop the highest result in the pool
   *
   * @param modifier - The matched modifier query
   */
  drop(modifier: string): ReturnType<Die["drop"]>;

  /**
   * Count the number of successful results which occurred in the pool.
   * Successes are counted relative to some target, or relative to the maximum possible value if no target is given.
   * Applying a count-success modifier to the results re-casts all results to 1 (success) or 0 (failure)
   * @example
   * `20d20cs` Count the number of dice which rolled a 20
   * @example
   * `20d20cs>10` Count the number of dice which rolled higher than 10
   * @example
   * `20d20cs<10` Count the number of dice which rolled less than 10
   *
   * @param modifier - The matched modifier query
   */
  countSuccess(modifier: string): ReturnType<Die["countSuccess"]>;

  /**
   * Count the number of failed results which occurred in a given result set.
   * Failures are counted relative to some target, or relative to the lowest possible value if no target is given.
   * Applying a count-failures modifier to the results re-casts all results to 1 (failure) or 0 (non-failure)
   * @example
   * `6d6cf` Count the number of dice which rolled a 1 as failures
   * @example
   * `6d6cf<=3` Count the number of dice which rolled less than 3 as failures
   * @example
   * `6d6cf>4` Count the number of dice which rolled greater than 4 as failures
   *
   * @param modifier - The matched modifier query
   */
  countFailures(modifier: string): ReturnType<Die["countFailures"]>;
}

declare namespace PoolTerm {
  interface Any extends AnyPoolTerm {}
  interface AnyConstructor extends Identity<typeof AnyPoolTerm> {}

  /**
   * @remarks This interface is not defined by foundry itself. It only exists
   * to allow module and system authors to use it for declaration merging,
   * enabling them to add additional modifiers for {@link PoolTerm | `PoolTerm`}s.
   */
  interface Modifiers {
    k: "keep";
    kh: "keep";
    kl: "keep";
    d: "drop";
    dh: "drop";
    dl: "drop";
    cs: "countSuccess";
    cf: "countFailures";
  }

  interface TermData extends Required<PoolTermConstructorData> {}

  interface PoolTermConstructorData {
    /**
     * @defaultValue `[]`
     */
    terms?: string[] | undefined;

    get isDeterministic(): boolean;

    /**
     * @defaultValue `[]`
     */
    modifiers?: Array<keyof Modifiers> | undefined;

    /**
     * @defaultValue `[]`
     */
    rolls?: Roll[] | undefined;

    /**
     * @defaultValue `[]`
     */
    results?: DiceTerm.Result[] | undefined;

    /**
     * @defaultValue `{}`
     */
    options?: RollTerm.Options | undefined;
  }
}

declare abstract class AnyPoolTerm extends PoolTerm {
  constructor(...args: never);
}

export default PoolTerm;
