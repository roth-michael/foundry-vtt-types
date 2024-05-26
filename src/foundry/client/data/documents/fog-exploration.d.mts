import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, StoredDocument } from "../../../../types/utils.d.mts";
import type { RequestContext, RequestOptions } from "../../../common/abstract/backend.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { SchemaField } from "../../../common/data/fields.d.mts";
import type BaseFogExploration from "../../../common/documents/fog-exploration.d.mts";

declare global {
  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  //@ts-expect-error Foundry turned a synchronous static function into async, fixed in v12
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    // TODO: Foundry converting a sync function to async has TS unhappy
    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param options - (default: `{}`)
     */
    static get(
      query?: {
        scene?: Scene;
        user?: User;
        options?: RequestContext<FogExploration>;
      },
      options?: RequestOptions, //@ts-expect-error Foundry turned a synchronous static function into async
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<typeof FogExploration>>> | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    // TODO: Unsure if still need the any
    protected _onCreate(
      data: SchemaField.InnerPersistedType<BaseFogExploration.Schema>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;
    protected _onCreate(
      data: Readonly<SchemaField.InnerPersistedType<any>>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected _onUpdate(
      changed: DeepPartial<SchemaField.InnerPersistedType<BaseFogExploration.Schema>>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;
    protected _onUpdate(
      data: DeepPartial<Readonly<SchemaField.InnerPersistedType<any>>>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected _onDelete(options: DocumentModificationOptions, userId: string): void;
  }
}
