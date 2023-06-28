import {KeyboardEventTypes, Scene} from "@babylonjs/core";

import {Whisp} from "./Whisp";

export class WhispControllable extends Whisp {
    private static readonly BIT_LEFT = 0x01;
    private static readonly BIT_RIGHT = 0x02;
    private static readonly BIT_FORWARD = 0x04;
    private static readonly BIT_BACK = 0x08;
    private static readonly KEY_LEFT = 'a';
    private static readonly KEY_RIGHT = 'd';
    private static readonly KEY_FORWARD = 'w';
    private static readonly KEY_BACK = 's';

    private moveState = 0;

    constructor(scene: Scene) {
        super(scene);

        this.addListeners(scene);
    }

    private keyDown(key: string) {
        switch (key) {
            case WhispControllable.KEY_LEFT:
                this.moveState |= WhispControllable.BIT_LEFT;

                break;
            case WhispControllable.KEY_RIGHT:
                this.moveState |= WhispControllable.BIT_RIGHT;

                break;
            case WhispControllable.KEY_FORWARD:
                this.moveState |= WhispControllable.BIT_FORWARD;

                break;
            case WhispControllable.KEY_BACK:
                this.moveState |= WhispControllable.BIT_BACK;

                break;
        }
    }

    private keyUp(key: string) {
        switch (key) {
            case WhispControllable.KEY_LEFT:
                this.moveState &= ~WhispControllable.BIT_LEFT;

                break;
            case WhispControllable.KEY_RIGHT:
                this.moveState &= ~WhispControllable.BIT_RIGHT;

                break;
            case WhispControllable.KEY_FORWARD:
                this.moveState &= ~WhispControllable.BIT_FORWARD;

                break;
            case WhispControllable.KEY_BACK:
                this.moveState &= ~WhispControllable.BIT_BACK;

                break;
        }
    }

    private addListeners(scene: Scene) {
        scene.onKeyboardObservable.add((keyInfo) => {
            switch(keyInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.keyDown(keyInfo.event.key);

                    break;
                case KeyboardEventTypes.KEYUP:
                    this.keyUp(keyInfo.event.key);

                    break;
            }
        });
    }

    update(delta: number) {
        super.update(delta);
    }
}