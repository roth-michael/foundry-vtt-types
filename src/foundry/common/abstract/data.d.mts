import type { AnyMutableObject, AnyObject, EmptyObject, Identity } from "fvtt-types/utils";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/_module.d.mts";
import type { DataModelValidationFailure } from "../data/validation-failure.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

declare const DynamicClass: new <_Computed extends object>(...args: never) => _Computed;

// @ts-expect-error - This is a workaround to allow for dynamic top level properties in a class.
declare class _InternalDataModel<
  out Schema extends DataSchema,
  // Do not inline. Being a type parameter is an important part of the circumvention of TypeScript's detection of dynamic classes.
  out _Computed extends object = SchemaField.InitializedData<Schema>,
> extends DynamicClass<_Computed> {}

export default DataModel;

/**
 * The abstract base class which defines the data schema contained within a Document.
 */
declare abstract class DataModel<
  Schema extends DataSchema,
  Parent extends DataModel.Any | null = null,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ExtraConstructorOptions extends AnyObject = {},
> extends _InternalDataModel<Schema> {
  /**
   * @param data    - Initial data used to construct the data object. The provided object
   *                  will be owned by the constructed model instance and may be mutated.
   * @param options - Options which affect DataModel construction
   */
  constructor(...args: DataModel.ConstructorArgs<Schema, Parent>);

  /** @internal */
  " __fvtt_types_internal_source_data": SchemaField.SourceData<Schema>;

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  " __fvtt_types_internal_assignment_data": SchemaField.AssignmentData<Schema>;

  /** @internal */
  " __fvtt_types_internal_initialized_data": SchemaField.InitializedData<Schema>;

  /**
   * Configure the data model instance before validation and initialization workflows are performed.
   */
  protected _configure(options?: ExtraConstructorOptions): void;

  /**
   * The source data object for this DataModel instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   */
  readonly _source: Readonly<fields.SchemaField.SourceData<Schema>>;

  /**
   * The defined and cached Data Schema for all instances of this DataModel.
   * @internal
   */
  protected static _schema: SchemaField.Any;

  /**
   * An immutable reverse-reference to a parent DataModel to which this model belongs.
   */
  readonly parent: Parent;

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   * @remarks The returned value MUST be kept up to sync with the `Schema` type parameter.
   */
  static defineSchema(): DataSchema;

  /**
   * Define the data schema for documents of this type.
   */
  static get schema(): SchemaField.Any;

  /**
   * Define the data schema for this document instance.
   */
  get schema(): SchemaField<Schema, EmptyObject>;

  /**
   * Is the current state of this DataModel invalid?
   * The model is invalid if there is any unresolved failure.
   */
  get invalid(): boolean;

  /**
   * An array of validation failure instances which may have occurred when this instance was last validated.
   */
  // FIXME: Check if this is actually correct.
  get validationFailures(): { fields: DataModelValidationFailure | null; joint: DataModelValidationFailure | null };

  #validationFailures: { fields: DataModelValidationFailure | null; joint: DataModelValidationFailure | null };

  /**
   * A set of localization prefix paths which are used by this DataModel.
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Initialize the source data for a new DataModel instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param data    - The candidate source data from which the model will be constructed
   * @param options - Options provided to the model constructor
   *                  (unused)
   * @returns Migrated and cleaned source data which will be stored to the model instance
   */
  protected _initializeSource(
    data: fields.SchemaField.CreateData<Schema> | this,
    options?: Omit<DataModel.DataValidationOptions, "parent">,
  ): fields.SchemaField.SourceData<Schema>;

  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param source  - The source data object
   * @param options - Additional options which are passed to field cleaning methods
   * @returns The cleaned source data
   */
  static cleanData(source?: AnyMutableObject, options?: Parameters<SchemaField.Any["clean"]>[1]): AnyMutableObject;

  /**
   * A generator that orders the DataFields in the DataSchema into an expected initialization order.
   */
  protected static _initializationOrder(): Generator<[string, DataField.Any]>;

  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   * This mirrors the workflow of SchemaField#initialize but with some added functionality.
   * @param options - Options provided to the model constructor
   *                  (unused)
   */
  protected _initialize(options?: any): void;

  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;

  /**
   * Clone a model, creating a new data model by combining current data with provided overrides.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Context options passed to the data model constructor
   * @returns The cloned Document instance
   */
  clone(data?: fields.SchemaField.CreateData<Schema>, context?: DataModel.DataValidationOptions<Parent>): this;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param options - Optional parameters which customize how validation occurs.
   * @returns An indicator for whether the document contains valid data
   */
  validate({ changes, clean, fallback, strict, fields, joint }?: DataModel.ValidateOptions<Schema>): boolean;

  /**
   * Evaluate joint validation rules which apply validation conditions across multiple fields of the model.
   * Field-specific validation rules should be defined as part of the DataSchema for the model.
   * This method allows for testing aggregate rules which impose requirements on the overall model.
   * @param data - Candidate data for the model
   * @throws An error if a validation failure is detected
   */
  static validateJoint(data: never): void;

  /**
   * @deprecated since v11; Use the validateJoint static method instead.
   */
  // TODO(LukeAbby): Should be SourceType
  protected _validateModel(data: fields.SchemaField.SourceData<Schema>): void;

  /**
   * Update the DataModel locally by applying an object of changes to its source data.
   * The provided changes are cleaned, validated, and stored to the source data object for this model.
   * The source data is then re-initialized to apply those changes to the prepared data.
   * The method returns an object of differential changes which modified the original data.
   *
   * @param changes - New values which should be applied to the data model
   * @param options - Options which determine how the new data is merged
   * @returns An object containing the changed keys and values
   */
  updateSource(
    changes?: fields.SchemaField.UpdateData<Schema>,
    options?: DataModel.UpdateSourceOptions,
  ): fields.SchemaField.UpdateData<Schema>;

  /**
   * Update the source data for a specific DataSchema.
   * This method assumes that both source and changes are valid objects.
   * @param schema  - The data schema to update
   * @param source  - Source data to be updated
   * @param changes - Changes to apply to the source data
   * @param options - Options which modify the update workflow
   * @returns The updated source data
   * @throws An error if the update operation was unsuccessful
   */
  static #updateData(
    schema: SchemaField.Any,
    source: object,
    changes: object,
    options: DataModel.UpdateOptions,
  ): object;

  /**
   * Update the source data for a specific DataField.
   * @param name    - The field name being updated
   * @param field   - The field definition being updated
   * @param source  - The source object being updated
   * @param value   - The new value for the field
   * @param options - Options which modify the update workflow
   * @throws An error if the new candidate value is invalid
   */
  static #updateField(
    name: string,
    field: DataField.Any,
    source: object,
    value: any,
    options: DataModel.UpdateOptions,
  ): object;

  /**
   * Copy and transform the DataModel into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values
   *                 (default: `true`)
   * @returns The extracted primitive object
   */
  toObject<Source extends boolean | undefined>(
    source?: Source,
  ): Source extends false ? SchemaField.SourceData<Schema> : Readonly<SchemaField.SourceData<Schema>>;

  /**
   * Extract the source data for the DataModel into a simple object format that can be serialized.
   * @returns The document source data expressed as a plain object
   */
  toJSON(): fields.SchemaField.SourceData<Schema>;

  /**
   * Create a new instance of this DataModel from a source record.
   * The source is presumed to be trustworthy and is not strictly validated.
   * @param source  - Initial document data which comes from a trusted source.
   * @param context - Model construction context
   * @remarks Returns `new this()` so needs an override per subclass.
   */
  static fromSource(source: never, { strict, ...context }?: DataModel.FromSourceOptions): DataModel.Any;

  /**
   * Create a DataModel instance using a provided serialized JSON string.
   * @param json - Serialized document data in string format
   * @returns A constructed data model instance
   * @remarks Returns `new this()` so needs an override per subclass.
   */
  static fromJSON(json: string): DataModel.Any;

  /**
   * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * Wrap data migration in a try/catch which attempts it safely
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateDataSafe(source: AnyMutableObject): AnyMutableObject;

  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to
   * support older code which uses this data.
   * @param data    - Data which matches the current schema
   * @param options - Additional shimming options
   * @returns Data with added backwards-compatible properties
   */
  // options: not null (destructured)
  static shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;
}

declare namespace DataModel {
  type CreateData<Schema extends DataSchema> = fields.SchemaField.CreateData<Schema> | DataModel<Schema, any>;

  type ConstructorDataFor<ConcreteDataModel extends DataModel.Any> = CreateData<SchemaOf<ConcreteDataModel>>;

  // TODO(LukeAbby): Make optional only if `{}` is assignable to `AssignmentData`.
  type ConstructorArgs<Schema extends DataSchema, Parent extends DataModel.Any | null = null> = [
    data?: DataModel.CreateData<Schema>,

    // Note(LukeAbby): `{ parent, strict, ...options }`
    options?: DataModel.DataValidationOptions<Parent>,
  ];
  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   *
   * `UnknownDataModel` covers the case where it's configured with a {@link DataModel | `DataModel`}.
   * Using a {@link TypeDataModel | `TypeDataModel`} is recommended by Foundry but a {@link DataModel | `DataModel`} is
   * always possible.
   * See {@link UnknownSystem | `UnknownSystem`} for other possibilities.
   */
  interface UnknownDataModel extends DataModel<any, any, any> {}

  interface DataValidationOptions<Parent extends Any | null = Any | null> {
    /**
     * Throw an error if validation fails.
     * @defaultValue `true`
     */
    strict?: boolean | null | undefined;

    /**
     * Attempt to replace invalid values with valid defaults?
     *
     * @defaultValue `false`
     */
    fallback?: boolean | null | undefined;

    /**
     * Allow partial source data, ignoring absent fields?
     *
     * @defaultValue `false`
     */
    partial?: boolean | null | undefined;

    /**
     * If true, invalid embedded documents will emit a warning and be
     * placed in the invalidDocuments collection rather than causing the
     * parent to be considered invalid.
     *
     * @defaultValue `false`
     */
    dropInvalidEmbedded?: boolean | null | undefined;

    /**
     * A parent DataModel instance to which this DataModel belongs
     * @defaultValue `null`
     */
    parent?: Parent | null | undefined;
  }

  interface Any extends AnyDataModel {}
  interface AnyConstructor extends Identity<typeof AnyDataModel> {}

  /**
   * A helper type to extract the schema from a {@link DataModel | `DataModel`}.
   * @typeParam ModelType - the DataModel for the embedded data
   */
  type SchemaOf<ModelType extends DataModel.Any> = ModelType["schema"]["fields"];

  // Note(LukeAbby): This avoids writing `SchemaOf<InstanceType<ConcreteClass>>` to be robust to an issue with this snippet:
  // ```ts
  // EmbeddedDataField<typeof DataModel<{}>> extends SchemaField<infer SubSchema> ? SubSchema : never
  // ```
  type SchemaOfClass<ConcreteClass extends DataModel.AnyConstructor> = ConcreteClass extends abstract new (
    ...args: infer _1
  ) => { schema: { fields: infer Fields extends DataSchema } }
    ? Fields
    : never;

  interface UpdateOptions {
    dryRun?: boolean;
    fallback?: boolean;
    recursive?: boolean;
    restoreDelta?: boolean;
    _collections: Record<string, unknown>;
    _singletons: Record<string, unknown>;
    _diff: Record<string, unknown>;
    _backup: Record<string, unknown>;
  }

  interface FromSourceOptions extends DataModel.DataValidationOptions {
    /**
     * Models created from trusted source data are validated non-strictly
     * @defaultValue `false`
     */
    strict?: boolean;
  }

  interface ShimDataOptions {
    /**
     * Apply shims to embedded models?
     * @defaultValue `true`
     */
    embedded?: boolean;
  }

  interface ValidateOptions<Schema extends DataSchema> {
    /**
     * A specific set of proposed changes to validate, rather than the full source data of the model.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    changes?: fields.SchemaField.AssignmentData<Schema>;

    /**
     * If changes are provided, attempt to clean the changes before validating them?
     * @defaultValue `false`
     */
    clean?: boolean;

    /**
     * Allow replacement of invalid values with valid defaults?
     * @defaultValue `false`
     */
    fallback?: boolean;

    /**
     * If true, invalid embedded documents will emit a warning and
     * be placed in the invalidDocuments collection rather than
     * causing the parent to be considered invalid.
     * @defaultValue `false`
     */
    dropInvalidEmbedded: boolean;

    /**
     * Throw if an invalid value is encountered, otherwise log a warning?
     * @defaultValue `true`
     */
    strict?: boolean;

    /**
     * Perform validation on individual fields?
     * @defaultValue `true`
     */
    fields?: boolean;

    /**
     * Perform joint validation on the full data model?
     * Joint validation will be performed by default if no changes are passed.
     * Joint validation will be disabled by default if changes are passed.
     * Joint validation can be performed on a complete set of changes (for
     * example testing a complete data model) by explicitly passing true.
     */
    joint?: boolean;
  }

  interface UpdateSourceOptions {
    dryRun?: boolean;
    fallback?: boolean;
    recursive?: boolean;
  }
}

// This uses `any` because `Schema` and `Parent` are invariant
declare abstract class AnyDataModel extends DataModel<DataSchema, any, AnyObject> {
  constructor(...args: never);
}

// Matches foundry exporting class as both default and non-default
export { DataModel };
