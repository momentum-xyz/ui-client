import {
  Color3,
  ParticleSystem,
  Scene,
  StandardMaterial,
  Texture,
  TrailMesh,
  Vector3,
  MeshBuilder,
  Color4,
  Engine,
  FresnelParameters,
  TransformNode,
  AssetContainer,
  InstantiatedEntries,
  Sprite,
  SpriteManager,
  Mesh
} from '@babylonjs/core';

import pentagon from '../static/Particles/pentagon.png';
import beam from '../static/Particles/beam.png';

export class Whisp {
  //   public static readonly SCALE = 1.5; // Size multiplier
  public static readonly SCALE = 0.5; // Size multiplier
  public static readonly RADIUS = 0.24 * Whisp.SCALE;

  private static readonly SPHERE_OPACITY = 0.7;
  //   private static readonly AVATAR_SIZE = 0.8;
  private static readonly AVATAR_SIZE = 0.3;
  private static readonly AVATAR_OPACITY = 0.8;
  private static readonly ANIMATION_SPEED = 0.09;
  private static readonly FLOAT_PHASES = [3, 2, 4];
  private static readonly FLOAT_MAGNITUDE = 0.18 * Whisp.SCALE;

  private readonly float;
  private trail?: TrailMesh;
  private particlesBeams?: ParticleSystem;
  private particlesSparks?: ParticleSystem;
  private assets?: InstantiatedEntries;

  protected readonly node = new TransformNode('WhispRoot');
  protected readonly velocity = new Vector3();
  protected readonly direction = new Vector3(0, 0, 1);
  protected readonly directionAngles = new Vector3();
  protected readonly sphere;
  protected readonly position = new Vector3(2, 2, 2);
  protected sprite?: Sprite;
  protected avatarDisc?: Mesh;
  protected animationPhase = Math.random();

  /**
   * Construct a whisp
   * @param {Scene} scene The scene
   * @param {boolean} [trail] True if the whisp should have a trail
   * @param {boolean} [float] True if the whisp should have float motion
   */
  constructor(scene: Scene, trail = false, float = false) {
    this.float = float;
    this.sphere = MeshBuilder.CreateIcoSphere(
      'Sphere',
      {
        flat: true,
        subdivisions: 2,
        radius: Whisp.RADIUS
      },
      scene
    );
    this.sphere.parent = this.node;

    const sphereMaterial = new StandardMaterial('SphereMaterial', scene);

    sphereMaterial.diffuseColor = new Color3(0.8, 0.8, 1);
    sphereMaterial.alpha = Whisp.SPHERE_OPACITY;
    sphereMaterial.alphaMode = Engine.ALPHA_ADD;
    sphereMaterial.reflectionFresnelParameters = new FresnelParameters();
    sphereMaterial.reflectionFresnelParameters.power = 4;
    sphereMaterial.reflectionFresnelParameters.leftColor =
      sphereMaterial.reflectionFresnelParameters.rightColor = Color3.White();

    this.sphere.material = sphereMaterial;

    if (trail) {
      this.trail = new TrailMesh('WhispTrail', this.node, scene, 0.07 * Whisp.SCALE, 60);

      const trailMaterial = new StandardMaterial('TrailMaterial', scene);

      trailMaterial.diffuseColor = new Color3(0.8, 0.8, 1);
      trailMaterial.alpha = 0.25;
      trailMaterial.alphaMode = Engine.ALPHA_ADD;
      trailMaterial.disableLighting = true;
      trailMaterial.emissiveColor = new Color3(1, 1, 1);

      this.trail.material = trailMaterial;
    }
  }

  /**
   * Create outward facing light beam particles
   * @param {Scene} scene The scene
   * @protected
   */
  protected createParticlesBeams(scene: Scene) {
    this.particlesBeams = new ParticleSystem('ParticlesWhispBeams', 8, scene);
    this.particlesBeams.emitter = this.sphere;
    this.particlesBeams.blendMode = ParticleSystem.BLENDMODE_ADD;
    this.particlesBeams.particleTexture = new Texture(beam, scene);
    this.particlesBeams.minInitialRotation = 0;
    this.particlesBeams.minInitialRotation = Math.PI * 2;
    this.particlesBeams.minLifeTime = 0.5;
    this.particlesBeams.maxLifeTime = 1.2;
    this.particlesBeams.minSize = 0.65 * Whisp.SCALE;
    this.particlesBeams.maxSize = 1.6 * Whisp.SCALE;
    this.particlesBeams.maxAngularSpeed = 1.2;
    this.particlesBeams.minAngularSpeed = -this.particlesBeams.maxAngularSpeed;
    this.particlesBeams.isLocal = true;
    this.particlesBeams.emitRate = 6;

    this.particlesBeams.addColorGradient(0, new Color4(1, 1, 1, 0));
    this.particlesBeams.addColorGradient(0.5, new Color4(1, 1, 1, 0.6));
    this.particlesBeams.addColorGradient(1, new Color4(1, 1, 1, 0));

    this.particlesBeams.direction1 = this.particlesBeams.direction2 = new Vector3();
    this.particlesBeams.minEmitBox = this.particlesBeams.maxEmitBox = new Vector3();

    this.particlesBeams.start();
  }

  /**
   * Create raising sparks particles
   * @param {Scene} scene The scene
   * @protected
   */
  protected createParticlesSparks(scene: Scene) {
    this.particlesSparks = new ParticleSystem('ParticlesWhispSparks', 8, scene);
    this.particlesSparks.emitter = this.sphere;
    this.particlesSparks.blendMode = ParticleSystem.BLENDMODE_ADD;
    this.particlesSparks.particleTexture = new Texture(pentagon, scene);
    this.particlesSparks.minInitialRotation = 0;
    this.particlesSparks.minInitialRotation = (Math.PI * 2) / 5;
    this.particlesSparks.minLifeTime = 0.5;
    this.particlesSparks.maxLifeTime = 0.8;
    this.particlesSparks.isLocal = true;
    this.particlesSparks.emitRate = 6;

    this.particlesSparks.direction1 = this.particlesSparks.direction2 = new Vector3();

    this.particlesSparks.addSizeGradient(0, 0, 0);
    this.particlesSparks.addSizeGradient(0.5, 0.1 * Whisp.SCALE, 0.28 * Whisp.SCALE);
    this.particlesSparks.addSizeGradient(1, 0, 0);

    this.particlesSparks.minEmitBox = new Vector3(
      -0.07 * Whisp.SCALE,
      -0.07 * Whisp.SCALE,
      -0.07 * Whisp.SCALE
    );
    this.particlesSparks.maxEmitBox = this.particlesSparks.minEmitBox.clone().negate();

    this.particlesSparks.start();
  }

  /**
   *  Dispose of the whisp
   */
  dispose() {
    this.sphere.dispose();
    this.trail?.dispose();
    this.particlesBeams?.dispose();
    this.particlesSparks?.dispose();
    this.assets?.dispose();
    this.avatarDisc?.dispose();
  }

  /**
   * Set the sphere to inverted or not inverted
   * @param {boolean} inverted True if the sphere should be inverted
   */
  private setSphereInverted(inverted: boolean) {
    if (this.sphere.material) {
      this.sphere.material.cullBackFaces = false;
    }
  }

  /**
   * Set the 3D asset for this whisp
   * @param {AssetContainer} container The asset container containing the asset
   */
  setAsset(container: AssetContainer) {
    this.assets = container.instantiateModelsToScene();

    for (const root of this.assets.rootNodes) {
      root.parent = this.node;
    }

    this.sphere.setEnabled(false);
  }

  /**
   * Set the avatar image for this whisp
   * @param {SpriteManager} spriteManager The avatar sprite manager
   * @param {Scene} scene The scene
   */
  setAvatar(spriteManager: SpriteManager) {
    console.log('setAvatar');
    this.particlesSparks?.stop();

    this.sprite = new Sprite('Avatar', spriteManager);
    this.sprite.width = this.sprite.height = Whisp.RADIUS * 2 * Whisp.AVATAR_SIZE;
    this.sprite.color.a = Whisp.AVATAR_OPACITY;

    // need this?
    this.setSphereInverted(true);
  }

  /**
   * Set the avatar image for this whisp
   * @param {SpriteManager} spriteManager The avatar sprite manager
   * @param {Scene} scene The scene
   */
  setAvatarTexture(url: string) {
    console.log('setAvatar');
    this.particlesSparks?.stop();

    this.avatarDisc?.dispose();

    this.avatarDisc = MeshBuilder.CreateDisc(
      'AvatarDisc',
      {
        radius: Whisp.RADIUS * 2 * Whisp.AVATAR_SIZE
      },
      this.node.getScene()
    );
    this.avatarDisc.rotation.z = Math.PI;

    const avatarTexture = new Texture(
      url,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      (message) => {
        console.log('Error when loading texture', url, 'Error:', message);
      }
    );
    const mat = new StandardMaterial('AvatarMaterial', this.node.getScene());
    mat.ambientTexture = avatarTexture;
    mat.diffuseTexture = avatarTexture;
    mat.emissiveTexture = avatarTexture;
    mat.specularTexture = avatarTexture;
    mat.alpha = Whisp.AVATAR_OPACITY;

    this.avatarDisc.material = mat;
    this.avatarDisc.parent = this.node;
    this.avatarDisc.billboardMode = Mesh.BILLBOARDMODE_ALL;
  }

  /**
   * Update the state
   * @param {number} delta The time delta in seconds
   */
  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    this.node.position.x = this.position.x;
    this.node.position.y = this.position.y;
    this.node.position.z = this.position.z;

    if (this.velocity.length() !== 0) {
      this.direction.copyFrom(this.velocity).normalize();
      this.directionAngles.set(
        0,
        Math.atan2(this.direction.x, this.direction.z) + Math.PI * 0.5,
        Math.asin(-this.direction.y)
      );

      this.node.rotation.set(this.directionAngles.z, this.directionAngles.y - Math.PI * 0.5, 0);
    }

    if (this.float) {
      const angle = Math.PI * 2 * this.animationPhase * Whisp.FLOAT_PHASES[0];
      const radius =
        Math.sin(Math.PI * 2 * this.animationPhase * Whisp.FLOAT_PHASES[1]) * Whisp.FLOAT_MAGNITUDE;

      this.node.position.x += Math.cos(angle) * radius;
      this.node.position.y +=
        Math.sin(Math.PI * 2 * this.animationPhase * Whisp.FLOAT_PHASES[2]) * Whisp.FLOAT_MAGNITUDE;
      this.node.position.z += Math.sin(angle) * radius;
    }

    if ((this.animationPhase += Whisp.ANIMATION_SPEED * delta) > 1) {
      --this.animationPhase;
    }

    if (this.sprite) {
      // this.sprite.position.copyFrom(this.node.position);
      this.sprite.position.copyFrom(this.node.getAbsolutePosition().add(new Vector3(0, 0, 0.1)));
    }
  }

  getInnerNode() {
    return this.node;
  }
  setInitialPosition(position: Vector3) {
    this.position.copyFrom(position);
    this.node.position.copyFrom(position);
  }
}
