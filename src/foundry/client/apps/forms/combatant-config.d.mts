export {};

declare global {
  /**
   * The Application responsible for configuring a single Combatant document within a parent Combat.
   *
   * @typeParam Options - the type of the options object
   */
  class CombatantConfig<Options extends CombatantConfig.Options = CombatantConfig.Options> extends DocumentSheet<
    Combatant.Implementation,
    Options
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "combatant-config",
     *   title: game.i18n.localize("COMBAT.CombatantConfig"),
     *   classes: ["sheet", "combat-sheet"],
     *   template: "templates/sheets/combatant-config.html",
     *   width: 420
     * });
     * ```
     */
    static override get defaultOptions(): CombatantConfig.Options;

    override get title(): string;

    protected override _updateObject(event: Event, formData: CombatantConfig.FormData): Promise<unknown>;
  }

  namespace CombatantConfig {
    interface Any extends CombatantConfig<any> {}

    interface Options extends DocumentSheet.Options<Combatant.Implementation> {
      id: "combatant-config";
      title: string;
      classes: string[];
      template: string;
      width: number;
    }

    type FormData = Pick<foundry.documents.BaseCombatant, "defeated" | "hidden" | "img" | "initiative" | "name">;
  }
}
