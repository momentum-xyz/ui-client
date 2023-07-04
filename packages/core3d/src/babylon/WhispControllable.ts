/* eslint-disable @typescript-eslint/no-unused-vars */
import {ArcRotateCamera, KeyboardEventTypes, PointerEventTypes, Scene, Vector2, Vector3} from "@babylonjs/core";

import {Whisp} from "./Whisp";

interface Bindings {
    [key: string]: number
}

export class WhispControllable extends Whisp {
    private static readonly BIT_LEFT = 0x01;
    private static readonly BIT_RIGHT = 0x02;
    private static readonly BIT_FORWARD = 0x04;
    private static readonly BIT_BACK = 0x08;
    private static readonly BIT_DOWN = 0x10;
    private static readonly BIT_UP = 0x20;
    private static readonly BIT_SPRINT = 0x40;
    private static readonly BIT_LOOK = 0x80;
    private static readonly BITS_LOOK =
        WhispControllable.BIT_LOOK |
        WhispControllable.BIT_LEFT |
        WhispControllable.BIT_RIGHT |
        WhispControllable.BIT_FORWARD |
        WhispControllable.BIT_BACK |
        WhispControllable.BIT_UP |
        WhispControllable.BIT_DOWN;
    private static readonly BINDINGS: Bindings = {
        'a': WhispControllable.BIT_LEFT,
        'd': WhispControllable.BIT_RIGHT,
        'w': WhispControllable.BIT_FORWARD,
        's': WhispControllable.BIT_BACK,
        'q': WhispControllable.BIT_DOWN,
        'e': WhispControllable.BIT_UP,
        'shift': WhispControllable.BIT_SPRINT,
        ' ': WhispControllable.BIT_LOOK
    };
    private static readonly UP = new Vector3(0, 1, 0);
    private static readonly RIGHT = new Vector3(1, 0, 0);
    private static readonly FORWARD = new Vector3(0, 0, 1);
    private static readonly RAISE = 1.2;
    private static readonly ACCELERATION = 50;
    private static readonly ACCELERATION_SPRINT = 180;
    private static readonly FRICTION = .14;
    private static readonly LOOK_SENSITIVITY = .002;

    private readonly velocity = new Vector3();
    private readonly cameraPosition = new Vector3();
    private readonly cursor = new Vector2();
    private readonly angles = new Vector2();
    private readonly lookAnchor = new Vector2();

    private looking = false;
    private camera;
    private moveState = 0;
    private moveStatePrevious = this.moveState;

    constructor(scene: Scene) {
        super(scene);

        this.addListeners(scene);

        this.camera = new ArcRotateCamera(
            "camera",
            0,
            0,
            10,
            this.cameraPosition,
            scene);
    }

    private keyDown(key: string) {
        if (Object.keys(WhispControllable.BINDINGS).indexOf(key) !== -1) {
            this.moveState |= WhispControllable.BINDINGS[key];
        }
    }

    private keyUp(key: string) {
        if (Object.keys(WhispControllable.BINDINGS).indexOf(key) !== -1) {
            this.moveState &= ~WhispControllable.BINDINGS[key];
        }
    }

    private addListeners(scene: Scene) {
        scene.onKeyboardObservable.add((keyInfo) => {
            switch(keyInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.keyDown(keyInfo.event.key.toLowerCase());

                    if (keyInfo.event.key !== "Shift" && keyInfo.event.shiftKey) {
                        this.keyDown("Shift");
                    }

                    break;
                case KeyboardEventTypes.KEYUP:
                    this.keyUp(keyInfo.event.key.toLowerCase());

                    if (keyInfo.event.key !== "Shift" && keyInfo.event.shiftKey) {
                        this.keyUp("Shift");
                    }

                    break;
            }
        });

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERMOVE:
                    this.cursor.set(pointerInfo.event.clientX, pointerInfo.event.clientY);

                    break;
                case PointerEventTypes.POINTERDOWN:

                    break;
                case PointerEventTypes.POINTERUP:

                    break;
            }
        });
    }

    private startLook() {
        this.angles.set(this.camera.alpha, this.camera.beta);
        this.lookAnchor.copyFrom(this.cursor);

        this.looking = true;
    }

    private stopLook() {
        this.looking = false;
    }

    update(delta: number) {
        super.update(delta);

        if (this.moveState & WhispControllable.BITS_LOOK) {
            if (!(this.moveStatePrevious & WhispControllable.BITS_LOOK)) {
                this.startLook();
            }
        }
        else {
            this.stopLook();
        }

        this.moveStatePrevious = this.moveState;

        const acceleration = (this.moveState & WhispControllable.BIT_SPRINT) ?
            WhispControllable.ACCELERATION_SPRINT * delta :
            WhispControllable.ACCELERATION * delta;

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
        const up = WhispControllable.UP;
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

        if (this.looking) {
            this.camera.alpha = this.angles.x + (this.lookAnchor.x - this.cursor.x) *
                WhispControllable.LOOK_SENSITIVITY;
            this.camera.beta = this.angles.y + (this.lookAnchor.y - this.cursor.y) *
                WhispControllable.LOOK_SENSITIVITY;
        }

        const friction = Math.pow(WhispControllable.FRICTION, delta * 2);

        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.velocity.z *= friction;
    }
}