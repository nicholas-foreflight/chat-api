import React, { useEffect } from 'react';
import { Container, Header } from 'semantic-ui-react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Project.module.scss'

const Project = () => {
    useEffect(() => {

        gsap.registerPlugin(ScrollTrigger);

        function loadModel() {
            const initSvgAnimation = (id) => {
                const length = document.querySelector(id).getTotalLength();
                document.querySelector(id).style.strokeDasharray = length;
                document.querySelector(id).style.strokeDashoffset = length;
            };

            initSvgAnimation('#line-length');
            initSvgAnimation('#line-wingspan');
            initSvgAnimation('#circle-phalange');

            let object;

            function onModelLoaded() {
                object.traverse(function (child) {
                    let mat = new THREE.MeshPhongMaterial({
                        color: 0x171511,
                        specular: 0xd0cbc7,
                        shininess: 5,
                        flatShading: true,
                    });
                    child.material = mat;
                });

                setupAnimation(object);
            }

            var manager = new THREE.LoadingManager(onModelLoaded);
            manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

            var loader = new OBJLoader(manager);
            loader.load('https://assets.codepen.io/557388/1405+Plane_1.obj', function (obj) {
                object = obj;
            });
        }

        function setupAnimation(model) {
            class Scene {
                constructor(model) {
                    this.views = [
                        { bottom: 0, height: 1 },
                        { bottom: 0, height: 0 },
                    ];

                    this.renderer = new THREE.WebGLRenderer({
                        antialias: true,
                        alpha: true,
                    });

                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    this.renderer.setPixelRatio(window.devicePixelRatio);

                    document.body.appendChild(this.renderer.domElement);

                    this.scene = new THREE.Scene();

                    for (var ii = 0; ii < this.views.length; ++ii) {
                        var view = this.views[ii];
                        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
                        camera.position.fromArray([0, 0, 180]);
                        camera.layers.disableAll();
                        camera.layers.enable(ii);
                        view.camera = camera;
                        camera.lookAt(new THREE.Vector3(0, 5, 0));
                    }

                    this.light = new THREE.PointLight(0xffffff, 0.75);
                    this.light.position.z = 150;
                    this.light.position.x = 70;
                    this.light.position.y = -20;
                    this.scene.add(this.light);

                    this.softLight = new THREE.AmbientLight(0xffffff, 1.5);
                    this.scene.add(this.softLight);

                    this.onResize();
                    window.addEventListener('resize', this.onResize, false);

                    var edges = new THREE.EdgesGeometry(model.children[0].geometry);
                    let line = new THREE.LineSegments(edges);
                    line.material.depthTest = false;
                    line.material.opacity = 0.5;
                    line.material.transparent = true;
                    line.position.x = 0.5;
                    line.position.z = -1;
                    line.position.y = 0.2;

                    this.modelGroup = new THREE.Group();

                    model.layers.set(0);
                    line.layers.set(1);

                    this.modelGroup.add(model);
                    this.modelGroup.add(line);
                    this.scene.add(this.modelGroup);
                }

                render = () => {
                    for (var ii = 0; ii < this.views.length; ++ii) {
                        var view = this.views[ii];
                        var camera = view.camera;

                        var bottom = Math.floor(this.h * view.bottom);
                        var height = Math.floor(this.h * view.height);

                        this.renderer.setViewport(0, 0, this.w, this.h);
                        this.renderer.setScissor(0, bottom, this.w, height);
                        this.renderer.setScissorTest(true);

                        camera.aspect = this.w / this.h;
                        this.renderer.render(this.scene, camera);
                    }
                };

                onResize = () => {
                    this.w = window.innerWidth;
                    this.h = window.innerHeight;

                    for (var ii = 0; ii < this.views.length; ++ii) {
                        var view = this.views[ii];
                        var camera = view.camera;
                        camera.aspect = this.w / this.h;
                        let camZ = (window.screen.width - this.w * 1) / 3;
                        camera.position.z = camZ < 180 ? 180 : camZ;
                        camera.updateProjectionMatrix();
                    }

                    this.renderer.setSize(this.w, this.h);
                    this.render();
                };
            }

            let scene = new Scene(model);
            let plane = scene.modelGroup;

            gsap.fromTo(
                'canvas',
                { x: '50%', autoAlpha: 0 },
                { duration: 1, x: '0%', autoAlpha: 1 }
            );
            gsap.to('.loading', { autoAlpha: 0 });
            gsap.to('.scroll-cta', { opacity: 1 });
            gsap.set('svg', { autoAlpha: 1 });

            let tau = Math.PI * 2;

            gsap.set(plane.rotation, { y: tau * -0.25 });
            gsap.set(plane.position, { x: 80, y: -32, z: -60 });

            scene.render();

            var sectionDuration = 1;
            gsap.fromTo(
                scene.views[1],
                { height: 1, bottom: 0 },
                {
                    height: 0,
                    bottom: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.blueprint',
                        scrub: 2, // Increased scrub duration for smoother scrolling
                        start: 'bottom bottom',
                        end: 'bottom top',
                    },
                }
            );

            gsap.fromTo(
                scene.views[1],
                { height: 0, bottom: 0 },
                {
                    height: 1,
                    bottom: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.blueprint',
                        scrub: 2, // Increased scrub duration for smoother scrolling
                        start: 'top bottom',
                        end: 'top top',
                    },
                }
            );

            gsap.to('.ground', {
                y: '30%',
                scrollTrigger: {
                    trigger: '.ground-container',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top bottom',
                    end: 'bottom top',
                },
            });

            gsap.from('.clouds', {
                y: '25%',
                scrollTrigger: {
                    trigger: '.ground-container',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top bottom',
                    end: 'bottom top',
                },
            });

            gsap.to('#line-length', {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: '.length',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top bottom',
                    end: 'top top',
                },
            });

            gsap.to('#line-wingspan', {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: '.wingspan',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top 25%',
                    end: 'bottom 50%',
                },
            });

            gsap.to('#circle-phalange', {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: '.phalange',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top 50%',
                    end: 'bottom 100%',
                },
            });

            gsap.to('#line-length', {
                opacity: 0,
                strokeDashoffset: document.querySelector('#line-length').getTotalLength(),
                scrollTrigger: {
                    trigger: '.length',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top top',
                    end: 'bottom top',
                },
            });

            gsap.to('#line-wingspan', {
                opacity: 0,
                strokeDashoffset: document.querySelector('#line-wingspan').getTotalLength(),
                scrollTrigger: {
                    trigger: '.wingspan',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top top',
                    end: 'bottom top',
                },
            });

            gsap.to('#circle-phalange', {
                opacity: 0,
                strokeDashoffset: document.querySelector('#circle-phalange').getTotalLength(),
                scrollTrigger: {
                    trigger: '.phalange',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top top',
                    end: 'bottom top',
                },
            });

            let tl = new gsap.timeline({
                onUpdate: scene.render,
                scrollTrigger: {
                    trigger: '.content',
                    scrub: 2, // Increased scrub duration for smoother scrolling
                    start: 'top top',
                    end: 'bottom bottom',
                },
                defaults: { duration: sectionDuration, ease: 'power2.inOut' },
            });

            let delay = 0;

            tl.to('.scroll-cta', { duration: 0.25, opacity: 0 }, delay);
            tl.to(plane.position, { x: -10, ease: 'power1.in' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: -tau * 0.05, ease: 'power1.inOut' }, delay);
            tl.to(plane.position, { x: -40, y: 0, z: -60, ease: 'power1.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: tau * 0.05, ease: 'power3.inOut' }, delay);
            tl.to(plane.position, { x: 40, y: 0, z: -60, ease: 'power2.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.2, y: 0, z: -tau * 0.1, ease: 'power3.inOut' }, delay);
            tl.to(plane.position, { x: -40, y: 0, z: -30, ease: 'power2.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: 0, z: 0, y: tau * 0.25 }, delay);
            tl.to(plane.position, { x: 0, y: -10, z: 50 }, delay);

            delay += sectionDuration;
            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
            tl.to(plane.position, { z: 30, ease: 'power4.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
            tl.to(plane.position, { z: 60, x: 30, ease: 'power4.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.35, y: tau * 0.75, z: tau * 0.6, ease: 'power4.inOut' }, delay);
            tl.to(plane.position, { z: 100, x: 20, y: 0, ease: 'power4.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { x: tau * 0.15, y: tau * 0.85, z: -tau * 0, ease: 'power1.in' }, delay);
            tl.to(plane.position, { z: -150, x: 0, y: 0, ease: 'power1.inOut' }, delay);

            delay += sectionDuration;

            tl.to(plane.rotation, { duration: sectionDuration, x: -tau * 0.05, y: tau, z: -tau * 0.1, ease: 'none' }, delay);
            tl.to(plane.position, { duration: sectionDuration, x: 0, y: 30, z: 320, ease: 'power1.in' }, delay);

            tl.to(scene.light.position, { duration: sectionDuration, x: 0, y: 0, z: 0 }, delay);
        }

        loadModel();
    }, []);

    return (
        <Container text style={{ marginTop: '7em' }} >
            <div className="content">
                <div className="loading">Loading</div>
                <div className="trigger"></div>
                <div className="section">
                    <h1>Who is Pete?</h1>
                    <h3>Pilot Pete - the ForeFlight First Officer</h3>
                    <p>The FO you always needed but never had</p>
                    <div className="phonetic"> V0.1 - OpenAI-Turbo-4o </div>
                    <div className="scroll-cta">ForeFlights getting complicated, lets delegate the responsibility of those small and tedious tasks with the use of AI</div>
                </div>
                <div className="section right">
                    <h2>Lets ask a question and walk through what happens</h2>
                </div>
                <div className="ground-container">
                    <div className="parallax ground"></div>
                    <div className="section right">
                        <h2>Add a new favorite airport "KSFM" for me</h2>
                        <p>...lets let AI take care of the rest</p>
                    </div>
                    <div className="section">
                        <h2>Pilot Pete breaks down the steps</h2>
                        <p>Once hes knows what to do he sends the instructions and a screenshot of the app to Fred the Flight Instructor</p>
                    </div>
                    <div className="section right">
                        <h2>Freds job is to read the screen and determine what coordinates to tap next</h2>
                        <p>...he uses AI vision to complete this</p>
                    </div>
                    <div className="parallax clouds"></div>
                </div>
                <div className="blueprint">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <line id="line-length" x1="10" y1="80" x2="90" y2="80" strokeWidth="0.5"></line>
                        <path id="line-wingspan" d="M10 50, L40 35, M60 35 L90 50" strokeWidth="0.5"></path>
                        <circle id="circle-phalange" cx="60" cy="60" r="15" fill="transparent" strokeWidth="0.5"></circle>
                    </svg>
                    <div className="section dark ">
                        <h2>Fred tells Pete what coordinates of the screen he needs to tap</h2>
                        <p>So how does Pete actually tap on the device?</p>
                    </div>
                    <div className="section dark length">
                        <h2>XCUITest</h2>
                        <p>Using an Appium Python Client, Pete is able to tap exactly where Fred told him to</p>
                    </div>
                    <div className="section dark wingspan">
                        <h2>Did he get it right?</h2>
                        <p>Like any good CFI, Fred is checking Petes work, and will correct him if necessary</p>
                    </div>
                    <div className="section dark phalange">
                        <h2>Well Pete successfully moves to the next step, what happens now?</h2>
                        <p>Fred commands Pete to work on the next step and complete the given task</p>
                    </div>
                    <div className="section dark">
                        <h2>Next steps?</h2>
                        <p>This cycle continues until the original task is complete</p>
                    </div>
                    <div className="section"></div>
                </div>
                <div className="sunset">
                    <div className="section"></div>
                    <div className="section end">
                        <p>Credits to @NH via Slack</p>
                        <p>Nicholas Hopper & Nick Heyland</p>
                    </div>
                </div>
            </div>
            Resources
        </Container>
    );
};

export default Project;
