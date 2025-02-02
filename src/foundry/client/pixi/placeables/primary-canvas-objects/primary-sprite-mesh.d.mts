import type { InexactPartial } from "../../../../../utils/index.d.mts";

// TODO: Remove when #2570 is completed
declare const PrimaryBaseSamplerShader: BaseSamplerShader;

declare namespace PrimaryBaseSamplerShader {
  type AnyConstructor = unknown;
}

declare global {
  /**
   * A basic PCO sprite mesh which is handling occlusion and depth.
   */
  class PrimarySpriteMesh extends PrimaryOccludableObjectMixin(SpriteMesh) {
    constructor(
      options?:
        | InexactPartial<{
            /** Texture passed to the SpriteMesh. */
            texture: PIXI.Texture;

            /** The shader class used to render this sprite. */
            shaderClass: PrimaryBaseSamplerShader.AnyConstructor;

            /** The name of this sprite. */
            name: string;
          }>
        | PIXI.Texture,
      shaderClass?: PrimaryBaseSamplerShader.AnyConstructor,
    );

    /**
     * The texture alpha data.
     */
    _textureAlphaData: TextureLoader.TextureAlphaData | null;

    /**
     * The texture alpha threshold used for point containment tests.
     * If set to a value larger than 0, the texture alpha data is
     * extracted from the texture at 25% resolution.
     */
    textureAlphaThreshold: number;

    override _onTextureUpdate(): void;

    override setShaderClass(shaderClass: PrimaryBaseSamplerShader.AnyConstructor): void;

    /**
     * An all-in-one helper method: Resizing the PCO according to desired dimensions and options.
     * This helper computes the width and height based on the following factors:
     *
     * - The ratio of texture width and base width.
     * - The ratio of texture height and base height.
     *
     * Additionally, It takes into account the desired fit options:
     *
     * - (default) "fill" computes the exact width and height ratio.
     * - "cover" takes the maximum ratio of width and height and applies it to both.
     * - "contain" takes the minimum ratio of width and height and applies it to both.
     * - "width" applies the width ratio to both width and height.
     * - "height" applies the height ratio to both width and height.
     *
     * You can also apply optional scaleX and scaleY options to both width and height. The scale is applied after fitting.
     *
     * **Important**: By using this helper, you don't need to set the height, width, and scale properties of the DisplayObject.
     *
     * **Note**: This is a helper method. Alternatively, you could assign properties as you would with a PIXI DisplayObject.
     * @param baseWidth  - The base width used for computations.
     * @param baseHeight - The base height used for computations.
     * @param options    - The options.
     */
    resize(
      baseWidth: number,
      baseHeight: number,
      options?: InexactPartial<{
        /** The fit type. */
        fit: "fill" | "cover" | "contain" | "width" | "height";

        /** The scale on X axis. */
        scaleX: number;

        /** The scale on Y axis. */
        scaleY: number;
      }>,
    ): void;

    protected override _updateBatchData(): void;

    protected override _calculateCanvasBounds(): void;

    /**
     * Is the given point in canvas space contained in this object?
     * @param point                 - The point in canvas space
     * @param textureAlphaThreshold - The minimum texture alpha required for containment
     */
    containsCanvasPoint(point: PIXI.IPointData, textureAlphaThreshold?: number): boolean;

    override renderDepthData(renderer: PIXI.Renderer): void;

    /**
     * Render the sprite with ERASE blending.
     * Note: The sprite must not have visible/renderable children.
     * @param renderer - The renderer
     */
    protected _renderVoid(renderer: PIXI.Renderer): void;

    /**
     * @deprecated since v12, will be removed in v14
     */
    getPixelAlpha(x: number, y: number): number;
  }
}
