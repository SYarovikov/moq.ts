import { IPreset } from "../presets/preset";
import { Interaction } from "../interactions";
import { ReturnsPreset } from "../presets/returns.preset";
import { CallbackPresetPlayer } from "./callback-preset.player";
import { CallbacksPreset } from "../presets/callbacks.preset";
import { ThrowsPreset } from "../presets/throws.preset";
import { MimicsPresetPlayer } from "./mimics-preset.player";
import { MimicsPreset } from "../presets/mimics.preset";

/**
 * @hidden
 */
export class PresetPlayer {
    constructor(
        private callbackPresetPlayer = new CallbackPresetPlayer(),
        private mimicsPresetPlayer = new MimicsPresetPlayer()) {

    }

    public play<T>(preset: IPreset<T>, interaction: Interaction): any {
        if (preset instanceof ReturnsPreset) {
            return preset.value;
        }
        if (preset instanceof CallbacksPreset) {
            return this.callbackPresetPlayer.play(preset.callback, interaction);
        }
        if (preset instanceof MimicsPreset) {
            return this.mimicsPresetPlayer.play(preset.origin, interaction);
        }
        if (preset instanceof ThrowsPreset) {
            throw preset.exception;
        }
    }
}
