import { atom } from "jotai";

interface AuthLoginPageState {
  currentView: "START" | "PASSWORD" | "SET_PASSWORD";
  isRegistering: boolean;
  mobile: string;
  tempToken: string;
}
const authLoginPageState = atom<AuthLoginPageState>({
  currentView: "START",
  isRegistering: false,
  mobile: "",
  tempToken: "",
});

export default authLoginPageState;
