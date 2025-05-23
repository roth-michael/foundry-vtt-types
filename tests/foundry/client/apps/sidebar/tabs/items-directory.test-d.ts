import { expectTypeOf } from "vitest";

const itemDirectory = new ItemDirectory({
  collection: game.items!,
});

expectTypeOf(ItemDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(itemDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(itemDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(itemDirectory.render(true)).toEqualTypeOf<ItemDirectory>();
