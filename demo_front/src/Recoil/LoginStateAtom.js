import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: 'LoginState', 
  storage: sessionStorage
});

export const LoginState = atom({
    key: 'LoginState',
    default: false,
    effects_UNSTABLE: [persistAtom]
  });