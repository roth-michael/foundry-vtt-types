import type { InterfaceToObject, AnyObject, DeepPartial } from "fvtt-types/utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The AmbientSound configuration application.
 */
declare class AmbientSoundConfig<
  RenderContext extends AnyObject = InterfaceToObject<AmbientSoundConfig.RenderContext>,
  Configuration extends
    DocumentSheetV2.Configuration<AmbientSoundDocument.Implementation> = DocumentSheetV2.Configuration<AmbientSoundDocument.Implementation>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientSoundDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace AmbientSoundConfig {
  interface RenderContext {
    sound: AmbientSoundDocument.Implementation;
    source: foundry.documents.BaseAmbientSound.Source;
    fields: foundry.documents.BaseAmbientSound.Schema;
    gridUnits: string;
    soundEffects: unknown; // TODO: Update after CONFIG updated
    buttons: ApplicationV2.FormFooterButton[];
  }
}

export default AmbientSoundConfig;
