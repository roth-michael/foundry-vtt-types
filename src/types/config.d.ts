import type DataModel from '../foundry/common/abstract/data.mjs';
import type { SystemDocumentType } from './helperTypes.js';

export type SubTypeShape = Expand<
  { derived: Record<string, unknown> } & (
    | { source?: undefined; data?: undefined; model: DataModel.Any }
    | { source: Record<string, unknown>; data: Record<string, unknown>; model?: undefined }
  )
>;

declare global {
  /**
   * Some global variables (such as {@link game}) are only initialized after certain events have happened during the
   * initialization of Foundry VTT. For that reason, the correct types for these variables include the types for the
   * uninitialized state.
   *
   * While this is correct from a type checking perspective, it can be inconvenient to have to type guard these global
   * variables everywhere. Some users might prefer the convenience over the 100% correctness in type checking.
   *
   * For this reason, this interface provides a way for users to configure certain global variables to be typed more
   * leniently, i.e., as the types of their initialized state. This is done via declaration merging. To configure a
   * specific global variable to be typed leniently, the user simply needs to merge a property with the name of the
   * variable into this interface (the type doesn't matter).
   *
   * The currently supported variables are:
   * - {@link game}
   * - {@link socket}
   * - {@link ui}
   * - {@link canvas}
   *
   * @example
   * ```typescript
   * declare global {
   *   interface LenientGlobalVariableTypes {
   *     game: never; // the type doesn't matter
   *   }
   * }
   *
   * const referenceToGame: Game = game; // ok! :)
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface LenientGlobalVariableTypes {}

  /**
   * This interface is used to configure the used document classes at a type
   * level. Module and system authors should use declaration merging to provide
   * the types of their configured document classes. It is extremely important
   * that this is kept in sync with the configuration that actually happens at
   * runtime.
   *
   * @example
   * ```typescript
   * // myActor.ts
   * class MyActor extends Actor {}
   *
   * // entryPoint.ts
   * import { MyActor } from './myActor'
   *
   * hooks.once('init', () => {
   *   CONFIG.Actor.documentClass = typeof MyActor;
   * });
   *
   * declare global {
   *   interface DocumentClassConfig {
   *     Actor: typeof MyActor
   *   }
   * }
   * ```
   */
  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DocumentClassConfig {}

  /**
   * This interface is used to configure the used object classes at a type
   * level. Module and system authors should use declaration merging to provide
   * the types of their configured object classes. It is extremely important
   * that this is kept in sync with the configuration that actually happens at
   * runtime.
   *
   * @example
   * ```typescript
   * // myToken.ts
   * class MyToken extends Token {}
   *
   * // entryPoint.ts
   * import { MyToken } from './myToken'
   *
   * Hooks.once('init', () => {
   *   CONFIG.Token.objectClass = MyToken;
   * });
   *
   * declare global {
   *   interface PlaceableObjectClassConfig {
   *     Token: typeof MyToken;
   *   }
   * }
   * ```
   */
  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PlaceableObjectClassConfig {}

  /**
   * This interface together with {@link SourceConfig} is used to configure the
   * types of the `data`  and `data._source` properties of the
   * {@link foundry.documents.BaseActor} and {@link foundry.documents.BaseItem}
   * classes. System authors should use declaration merging to provide the types
   * that match their `template.json` file. It is also very important for these
   * types to stay in sync with the `template.json` file, otherwise unexpected
   * runtime errors might appear.
   *
   * @example
   * ```typescript
   * interface ArmorDataSourceData {
   *   armorValue: number;
   * }
   *
   * interface ArmorDataSource {
   *   type: 'armor';
   *   data: ArmorDataSourceData;
   * }
   *
   * interface WeaponDataSourceData {
   *   damagePerHit: number;
   *   attackSpeed: number;
   * }
   *
   * interface WeaponDataSource {
   *   type: 'weapon';
   *   data: WeaponDataSourceData;
   * }
   *
   * interface ArmorDataPropertiesData extends ArmorDataSourceData {
   *   weight: number;
   * }
   *
   * interface ArmorDataProperties {
   *   type: 'armor';
   *   data: ArmorDataPropertiesData;
   * }
   *
   * interface WeaponDataPropertiesData extends WeaponDataSourceData {
   *   damage: number;
   * }
   *
   * interface WeaponDataProperties {
   *   type: 'weapon';
   *   data: WeaponDataPropertiesData;
   * }
   *
   * type MyItemDataSource = ArmorDataSource | WeaponDataSource;
   * type MyItemDataProperties = ArmorDataProperties | WeaponDataProperties;
   *
   * declare global {
   *   interface DataConfig {
   *     Item: MyItemDataProperties;
   *   }
   *
   *   interface SourceConfig {
   *     Item: MyItemDataSource;
   *   }
   * }
   * const item = await Item.create({
   *   name: 'Axe',
   *   type: 'weapon',
   *   attackSpeed: 1,
   *   damage: 5
   * });
   *
   * if(item.data.type === 'weapon') {
   *   const damage: number = item.data.data.damage;
   * }
   *
   * if(item.data._source.type === 'armor') {
   *   const armorValue = item.data._source.data.armorValue;
   * }
   * ```
   */
  /**
   * @deprecated Deprecated in favour of {@link SystemConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DataConfig {}

  /**
   * @deprecated Deprecated in favour of {@link SystemConfig}
   */
  /** @see {@link DataConfig} */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface SourceConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface SystemConfig extends SourceConfigShape {}

  type SourceConfigShape = {
    [Type in SystemDocumentType]?: {
      [SubType: string]: SubTypeShape;
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FlagConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface WebRTCConfig {}
}

export {};
