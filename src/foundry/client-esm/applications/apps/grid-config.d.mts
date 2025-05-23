import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

/**
 * A tool for fine-tuning the grid in a Scene
 * @remarks TODO: Stub
 */
declare class GridConfig<
  RenderContext extends GridConfig.RenderContext = GridConfig.RenderContext,
  Configuration extends
    DocumentSheetV2.Configuration<Scene.Implementation> = DocumentSheetV2.Configuration<Scene.Implementation>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace GridConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Scene.Implementation> {}
}

export default GridConfig;
