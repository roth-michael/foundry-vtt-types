import type { InexactPartial } from "../../../../../types/utils.d.mts";

declare global {
  /**
   * A CanvasLayer for displaying visual effects like weather, transitions, flashes, or more
   */
  class WeatherEffects<
    DrawOptions extends WeatherEffects.DrawOptions = WeatherEffects.DrawOptions,
    TearDownOptions extends WeatherEffects.TearDownOptions = WeatherEffects.TearDownOptions,
  > extends FullCanvasObjectMixin(CanvasLayer) {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["effects"];

    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * @defaultValue `"none"`
     */
    override eventMode: PIXI.EventMode;

    /**
     * The container in which effects are added.
     * @defaultValue `undefined`
     */
    weatherEffects: PIXI.Container | undefined;

    /**
     * The container in which suppression meshed are added.
     * @defaultValue `undefined`
     */
    suppression: PIXI.Container | undefined;

    /**
     * @defaultValue `foundry.utils.mergeObject(super.layerOptions, { name: "effects" })`
     */
    static override get layerOptions(): WeatherEffects.LayerOptions;

    override options: WeatherEffects.LayerOptions;

    /**
     * Array of weather effects linked to this weather container.
     */
    effects: Map<string, Array<ParticleEffect | WeatherShaderEffect>>;

    /**
     * A default configuration of the terrain mask that is automatically applied to any shader-based weather effects.
     * This configuration is automatically passed to WeatherShaderEffect#configureTerrainMask upon construction.
     */
    terrainMaskConfig: WeatherEffects.WeatherTerrainMaskConfiguration;

    /**
     * A default configuration of the terrain mask that is automatically applied to any shader-based weather effects.
     * This configuration is automatically passed to WeatherShaderEffect#configureTerrainMask upon construction.
     */
    occlusionMaskConfig: WeatherEffects.WeatherOcclusionMaskConfiguration;

    /**
     * The inverse occlusion mask filter bound to this container.
     */
    occlusionFilter: WeatherOcclusionMaskFilter;

    /**
     * The elevation of this object.
     */
    get elevation(): number;

    set elevation(value: number);

    /**
     * A key which resolves ties amongst objects at the same elevation of different layers.
     * @defaultValue `PrimaryCanvasGroup.SORT_LAYERS.WEATHER`
     */
    get sortLayer(): number;

    set sortLayer(value);

    /**
     * A key which resolves ties amongst objects at the same elevation within the same layer.
     * @defaultValue `0`
     */
    get sort(): number;

    set sort(value: number);

    /**
     * A key which resolves ties amongst objects at the same elevation within the same layer and same sort.
     */
    get zIndex(): number;

    set zIndex(value: number);

    protected override _draw(options?: DrawOptions): Promise<void>;

    protected override _tearDown(options?: TearDownOptions): Promise<void>;

    /**
     * Initialize the weather container from a weather config object.
     * @param weatherEffectsConfig - Weather config object (or null/undefined to clear the container).
     */
    initializeEffects(weatherEffectsConfig?: WeatherEffects.WeatherEffectsConfig | null): void;

    /**
     * Clear the weather container.
     */
    clearEffects(): void;

    /**
     * Set the occlusion uniforms for this weather shader.
     * @param context - The shader context
     * @param config  - Occlusion masking options
     */
    protected static configureOcclusionMask(
      context: PIXI.Shader,
      config?: InexactPartial<WeatherEffects.WeatherOcclusionMaskConfiguration>,
    ): void;

    /**
     * Set the terrain uniforms for this weather shader.
     * @param context - The shader context
     * @param config  - Terrain masking options
     */
    protected static configureTerrainMask(
      context: PIXI.Shader,
      config?: InexactPartial<WeatherEffects.WeatherTerrainMaskConfiguration>,
    ): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"The WeatherContainer at canvas.weather.weather is deprecated and combined with the layer itself."`
     */
    get weather(): this;
  }

  namespace WeatherEffects {
    type AnyConstructor = typeof AnyWeatherEffects;

    interface LayerOptions extends CanvasLayer.LayerOptions {
      name: "effects";
    }

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}

    interface WeatherTerrainMaskConfiguration {
      /**
       * Enable or disable this mask.
       * @defaultValue `false`
       */
      enabled: boolean;

      /**
       * An RGBA array of channel weights applied to the mask texture.
       * @defaultValue `[1, 0, 0, 0]`
       */
      channelWeights: [r: number, b: number, g: number, a: number];

      /**
       * If the mask should be reversed.
       * @defaultValue `false`
       */
      reverse?: boolean | undefined;

      /**
       * A texture which defines the mask region.
       */
      texture: PIXI.Texture | PIXI.RenderTexture;
    }

    interface WeatherOcclusionMaskConfiguration {
      /**
       * Enable or disable this mask.
       * @defaultValue `false`
       */
      enabled: boolean;

      /**
       * An RGBA array of channel weights applied to the mask texture.
       * @defaultValue `[0, 0, 1, 0]`
       */
      channelWeights: [r: number, b: number, g: number, a: number];

      /**
       * If the mask should be reversed.
       * @defaultValue `false`
       */
      reverse: boolean;

      /**
       * A texture which defines the mask region.
       */
      texture: PIXI.Texture | PIXI.RenderTexture;
    }

    /**
     * @privateRemarks types inferred from usage
     */
    interface WeatherEffectsConfig {
      effects: WeatherEffects[];

      filter: PIXI.Filter;
    }
  }
}

declare abstract class AnyWeatherEffects extends WeatherEffects {
  constructor(arg0: never, ...args: never[]);
}
