import { atom, selector } from "recoil";

const darkModeState = atom({
  key: "darkModeState",
  default: false,
});
export { darkModeState };

//const hours = new Date().getHours()
//const isDayTime = hours > 6 && hours < 20
