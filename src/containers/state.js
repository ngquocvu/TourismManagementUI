import { atom, selector } from "recoil";

const darkModeState = atom({
  key: "darkModeState",
  default: false,
});
export { darkModeState };
