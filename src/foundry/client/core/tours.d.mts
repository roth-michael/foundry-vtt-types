export {};

declare global {
  /**
   * A singleton Tour Collection class responsible for registering and activating Tours, accessible as game.tours
   * @see {@link Game.tours | `Game.tours`}
   */
  class Tours extends foundry.utils.Collection<Tour> {
    /** @throws `"You can only have one TourManager instance"` */
    constructor();

    /**
     * Register a new Tour
     * @param namespace - The namespace of the Tour
     * @param id        - The machine-readable id of the Tour
     * @param tour      - The constructed Tour
     */
    register(namespace: string, id: string, tour: Tour): void;

    override set(key: string, tour: Tour): this;
  }
}
