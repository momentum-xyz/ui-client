/* eslint-disable @typescript-eslint/no-unused-vars */

import {ArcRotateCamera, KeyboardEventTypes, Scene, Vector3} from "@babylonjs/core";

import {Whisp} from "./Whisp";

export class WhispControllable extends Whisp {
    private static readonly BIT_LEFT = 0x01;
    private static readonly BIT_RIGHT = 0x02;
    private static readonly BIT_FORWARD = 0x04;
    private static readonly BIT_BACK = 0x08;
    private static readonly BIT_DOWN = 0x10;
    private static readonly BIT_UP = 0x20;
    private static readonly KEY_LEFT = 'a';
    private static readonly KEY_RIGHT = 'd';
    private static readonly KEY_FORWARD = 'w';
    private static readonly KEY_BACK = 's';
    private static readonly KEY_DOWN = 'q';
    private static readonly KEY_UP = 'e';
    private static readonly UP = new Vector3(0, 1, 0);
    private static readonly RIGHT = new Vector3(1, 0, 0);
    private static readonly FORWARD = new Vector3(0, 0, 1);
    private static readonly RAISE = 1.2;
    private static readonly ACCELERATION = 50;
    private static readonly FRICTION = .14;

    private readonly velocity = new Vector3();
    private readonly cameraPosition = new Vector3();

    private camera;
    private moveState = 0;

    constructor(scene: Scene) {
        super(scene);

        this.addListeners(scene);

        this.camera = new ArcRotateCamera("camera", 0, 0, 10, this.cameraPosition, scene);
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
            case WhispControllable.KEY_DOWN:
                this.moveState |= WhispControllable.BIT_DOWN;

                break;
            case WhispControllable.KEY_UP:
                this.moveState |= WhispControllable.BIT_UP;

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
            case WhispControllable.KEY_DOWN:
                this.moveState &= ~WhispControllable.BIT_DOWN;

                break;
            case WhispControllable.KEY_UP:
                this.moveState &= ~WhispControllable.BIT_UP;

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

        const acceleration = WhispControllable.ACCELERATION * delta;

        const dx = (
            +((this.moveState & WhispControllable.BIT_RIGHT) === WhispControllable.BIT_RIGHT) -
            +((this.moveState & WhispControllable.BIT_LEFT) === WhispControllable.BIT_LEFT)) * acceleration;
        const dy = (
            +((this.moveState & WhispControllable.BIT_UP) === WhispControllable.BIT_UP) -
            +((this.moveState & WhispControllable.BIT_DOWN) === WhispControllable.BIT_DOWN)) * acceleration;
        const dz = (
            +((this.moveState & WhispControllable.BIT_FORWARD) === WhispControllable.BIT_FORWARD) -
            +((this.moveState & WhispControllable.BIT_BACK) === WhispControllable.BIT_BACK)) * acceleration;

        const right = this.camera.getDirection(WhispControllable.RIGHT);
        const up = this.camera.getDirection(WhispControllable.UP);
        const forward = this.camera.getDirection(WhispControllable.FORWARD);

        this.velocity.x += forward.x * dz + up.x * dy + right.x * dx;
        this.velocity.y += forward.y * dz + up.y * dy + right.y * dx;
        this.velocity.z += forward.z * dz + up.z * dy + right.z * dx;

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;

        this.cameraPosition.x = this.position.x + up.x * WhispControllable.RAISE;
        this.cameraPosition.y = this.position.y + up.y * WhispControllable.RAISE;
        this.cameraPosition.z = this.position.z + up.z * WhispControllable.RAISE;

        this.camera.setTarget(this.cameraPosition);

        const friction = Math.pow(WhispControllable.FRICTION, delta * 2);

        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.velocity.z *= friction;
    }
}