import { expectTypeOf } from "vitest";
import type { DeepPartial, StoredDocument } from "../../../../../src/types/utils.d.mts";

const metadata = {
  type: "JournalEntry" as const,
  label: "Important Plotholes",
  id: "world.plotholes",
  name: "plotholes",
  package: "some-package",
  path: "path/to/file",
  private: false,
};

const compendiumCollection = new CompendiumCollection(metadata);
expectTypeOf(compendiumCollection.get("", { strict: true })).toEqualTypeOf<StoredDocument<JournalEntry>>();
// expectTypeOf(compendiumCollection.toJSON()).toEqualTypeOf<
//   Array<StoredDocument<foundry.documents.BaseJournalEntry>["_source"]>
// >();

expectTypeOf((await compendiumCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string } & DeepPartial<foundry.documents.BaseJournalEntry["_source"]>
>();

expectTypeOf(compendiumCollection.documentClass).toEqualTypeOf<JournalEntry>();

const itemCollection = new CompendiumCollection({
  type: "Item",
  label: "Important items",
  id: "world.items",
  name: "items",
  package: "other-package",
  path: "path/to/items",
  private: false,
});
expectTypeOf((await itemCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string } & DeepPartial<foundry.documents.BaseItem["_source"]>
>();
expectTypeOf(
  (await itemCollection.getIndex({ fields: ["name", "effects", "data"] })).get("some id", { strict: true }),
).toEqualTypeOf<{ _id: string } & DeepPartial<foundry.documents.BaseItem["_source"]>>();

expectTypeOf(await itemCollection.getDocuments()).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({})).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({ name: "foo" })).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items called "foo"
expectTypeOf(
  await itemCollection.getDocuments({ $or: [{ name: "baz" }, { name: "bar" }], effects: { $size: 2 } }), // only get items called "baz" or "bar" that have exactly 2 effects
).toEqualTypeOf<StoredDocument<Item>[]>();