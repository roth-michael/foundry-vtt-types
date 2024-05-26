import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

export {};

declare global {
  /**
   * The client-side Note document which extends the common BaseNote model.
   * Each Note document contains NoteData which defines its data schema.
   *
   * @see {@link Scene}               The Scene document type which contains Note embedded documents
   * @see {@link NoteConfig}          The Note configuration application
   */
  class NoteDocument extends CanvasDocumentMixin(foundry.documents.BaseNote) {
    /**
     * The associated JournalEntry which is referenced by this Note
     */
    get entry(): ReturnType<Journal["get"]>;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): InstanceType<ConfiguredDocumentClassForName<"JournalEntryPage">> | undefined;

    /**
     * The text label used to annotate this Note
     */
    get label(): string;
  }
}
