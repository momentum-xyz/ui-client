export interface UnityApiInterface {
  toggleMinimap(): any;
  teleportToUser(userGuid: string): any;
  teleportToSpace(spaceGuid: string): any;
  teleportToVector3(position: string): any;
  lookAtWisp(userGuid: string): any;
  controlKeyboard(unityIsInControl: boolean): any;
  controlVolume(gain: string): any;
  controlSound(isOn: boolean): any;
  pauseUnity(isPaused: boolean): any;
  setToken(token?: string): any;
  getCurrentWorld(): string;
  getUserPosition(): string;
  triggerInteractionMsg(kind: number, guid: string, flag: number, message: string): any;
}
