/**
 * @license
 * Copyright 2022 Peter Z. Tan
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('world-composer')
export class WorldComposer extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  @property({type: String, reflect: true, attribute: 'src-set'}) srcSet = '';

  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {
    super();

    // Instantiate a loader
    this.loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    this.dracoLoader = new DRACOLoader();


    this.scene = new Scene();
    this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.renderer = new WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  private onGLTFloaded(gltf: GLTF) {
    this.scene.add(gltf.scene);
  }

  private onProgress(xhr: ProgressEvent) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  }

  private onError(error: ErrorEvent) {
    console.error(error);
  }

  override render() {
    this.dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    this.loader.setDRACOLoader( this.dracoLoader );

    // Load a glTF resource
    this.loader.load(
      // resource URL
      'models/gltf/duck/duck.gltf',
      // called when the resource is loaded
      this.onGLTFloaded,
      // called while loading is progressing
      this.onProgress,
      // called when loading has errors
      this.onError
    );
    return html`${this.renderer.domElement}`;
  }

  override connectedCallback(): void {
      super.connectedCallback();
      this.renderer.render(this.scene, this.camera);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'world-composer': WorldComposer;
  }
}
