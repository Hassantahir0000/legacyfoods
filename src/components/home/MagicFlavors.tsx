"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { media } from "@/lib/media";

type PackDef = { urls: string[]; rot: number; strength: number; label: string; href: string };

const PACKS: PackDef[] = [
  { urls: [media("2026/07/badshahi.glb"), media("ext/badshahi-mirror.glb")], rot: 0.45, strength: 1, label: "Nimko", href: "/nimko" },
  { urls: [media("2026/08/Cocotea-jumbopops-final-.glb"), media("ext/jumbopops-mirror.glb")], rot: 0.15, strength: 1.05, label: "Snacks", href: "/snacks" },
  { urls: [media("ext/caramel-bag.glb"), media("2026/07/caramel_bag_1.glb")], rot: -0.15, strength: 1.15, label: "Popcorns", href: "/popcorn" },
  { urls: [media("2026/08/Cocotea-Coated-peanut-spicy-maslala-.glb")], rot: -0.45, strength: 1.1, label: "Peanuts", href: "/coated-peanut" },
];

type Pack = {
  group: THREE.Group;
  model: THREE.Object3D;
  index: number;
  rot: number;
  strength: number;
  size: THREE.Vector3;
  center: THREE.Vector3;
  home: [number, number];
  halfHeight: number;
  label: HTMLAnchorElement;
};

/**
 * "Discover our magical flavors" — four 3D Cocotea packs (three.js) that float,
 * follow the pointer, and carry a link button underneath. Desktop shows 4,
 * tablet 3 and mobile 2, with arrows to scroll the rest into view.
 */
export default function MagicFlavors() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const scroller = scrollerRef.current!;
    const stage = stageRef.current!;
    const mount = mountRef.current!;
    const labelsLayer = labelsRef.current!;
    const prevBtn = prevRef.current!;
    const nextBtn = nextRef.current!;

    let disposed = false;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const d1 = new THREE.DirectionalLight(0xffffff, 2.2);
    d1.position.set(4, 6, 5);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xffffff, 0.8);
    d2.position.set(-5, 2, -3);
    scene.add(d2);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));

    const loader = new GLTFLoader();
    const packs: Pack[] = [];

    const dims = () => {
      const r = stage.getBoundingClientRect();
      return { width: Math.max(1, r.width), height: Math.max(1, r.height) };
    };
    const visibleCount = () => {
      const w = section.getBoundingClientRect().width;
      return w <= 640 ? 2 : w <= 1024 ? 3 : 4;
    };
    const world = () => {
      const s = dims();
      const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      return { width: (h * s.width) / s.height, height: h };
    };

    const sizePack = (p: Pack, snap: boolean) => {
      const w = world();
      const count = visibleCount();
      const slot = w.width / 4;
      const gap = ((count === 2 ? 16 : 10) * w.width) / dims().width;
      const hf = count === 3 ? 0.6 : 0.62;
      const byH = (w.height * hf) / Math.max(p.size.y, 0.001);
      const byW = Math.max(0.1, slot - gap) / Math.max(p.size.x, 0.001);
      const scale = Math.min(byH, byW);
      p.model.scale.setScalar(scale);
      p.model.position.copy(p.center).multiplyScalar(-scale);
      p.halfHeight = (p.size.y * scale) / 2;
      p.home = [-w.width / 2 + slot * (p.index + 0.5), 0.12];
      if (snap) p.group.position.set(p.home[0], p.home[1], 0);
    };

    const updateArrows = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      section.classList.toggle("is-scrollable", max > 2);
      prevBtn.disabled = scroller.scrollLeft <= 2;
      nextBtn.disabled = scroller.scrollLeft >= max - 2;
    };
    const slideBy = (dir: number) => scroller.scrollBy({ left: (dir * scroller.scrollWidth) / 4, behavior: "smooth" });
    const onPrev = () => slideBy(-1);
    const onNext = () => slideBy(1);
    prevBtn.addEventListener("click", onPrev);
    nextBtn.addEventListener("click", onNext);
    scroller.addEventListener("scroll", updateArrows, { passive: true });

    const layout = () => {
      if (disposed) return;
      stage.style.width = `${(4 / visibleCount()) * 100}%`;
      const s = dims();
      renderer.setSize(s.width, s.height, false);
      camera.aspect = s.width / s.height;
      camera.updateProjectionMatrix();
      packs.forEach((p) => sizePack(p, false));
      updateArrows();
    };

    PACKS.forEach((def, index) => {
      const label = document.createElement("a");
      label.href = def.href;
      label.className = "mf-pack-btn";
      label.textContent = def.label;
      labelsLayer.appendChild(label);
      const sources = def.urls.slice();
      const tryNext = () => {
        const url = sources.shift();
        if (!url || disposed) return;
        loader.load(
          url,
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            const group = new THREE.Group();
            group.add(model);
            scene.add(group);
            const p: Pack = { group, model, index, rot: def.rot, strength: def.strength, size, center, home: [0, 0], halfHeight: 0, label };
            packs.push(p);
            sizePack(p, true);
            label.classList.add("is-ready");
            layout();
          },
          undefined,
          () => tryNext()
        );
      };
      tryNext();
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 50);
    };
    window.addEventListener("resize", schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(section);
    layout();

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1);
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave, { passive: true });

    // Only render while the section is on screen.
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(section);

    const projected = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const k = 1 - Math.pow(0.001, delta);
      const s = dims();
      packs.forEach((p) => {
        const ty = p.rot + pointer.x * 0.6 * p.strength;
        const tx = -pointer.y * 0.25 * p.strength;
        const float = Math.sin(t * 0.9 + p.index) * 0.08;
        p.group.rotation.y += (ty - p.group.rotation.y) * k;
        p.group.rotation.x += (tx - p.group.rotation.x) * k;
        p.group.position.y += (p.home[1] + float - p.group.position.y) * k;
        p.group.position.x += (p.home[0] + pointer.x * 0.05 - p.group.position.x) * k;
        projected.set(p.group.position.x, p.group.position.y - p.halfHeight, p.group.position.z).project(camera);
        const x = (projected.x * 0.5 + 0.5) * s.width;
        const y = (-projected.y * 0.5 + 0.5) * s.height + 15;
        p.label.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px)`;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", schedule);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      prevBtn.removeEventListener("click", onPrev);
      nextBtn.removeEventListener("click", onNext);
      scroller.removeEventListener("scroll", updateArrows);
      renderer.dispose();
      mount.replaceChildren();
      labelsLayer.replaceChildren();
    };
  }, []);

  return (
    <section className="magic-flavors" ref={sectionRef} aria-label="Discover our magical flavors">
      <p className="magic-flavors__eyebrow">Discover our magical flavors</p>
      <div className="magic-flavors__scroller" ref={scrollerRef}>
        <div className="magic-flavors__stage" ref={stageRef}>
          <div className="magic-flavors__canvas" ref={mountRef} />
          <div className="magic-flavors__labels" ref={labelsRef} />
        </div>
      </div>
      <button type="button" ref={prevRef} className="mf-arrow mf-arrow--prev" aria-label="Previous">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button type="button" ref={nextRef} className="mf-arrow mf-arrow--next" aria-label="Next">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </section>
  );
}
