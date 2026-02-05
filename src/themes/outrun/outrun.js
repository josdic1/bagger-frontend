import manifest from "./manifest.js";
import "./theme.css";
import { mount as mountEffects } from "./effects.js";

export default {
  manifest,
  mount() {
    if (manifest.effects) return mountEffects();
    return null;
  },
};
