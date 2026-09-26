"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, type Project } from "./projects";
import styles from "./portfolio.module.css";

function ProjectImage({
  project,
  eager = false,
}: {
  project: Project;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.image]);
  return failed ? (
    <div className={styles.imageFallback}>
      <span>{project.title}</span>
      <small>Pratinjau gambar belum tersedia</small>
    </div>
  ) : (
    <img
      src={project.image}
      alt={`Tampilan ${project.title}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}

export default function ProjectsSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [view, setView] = useState<"showcase" | "grid">("showcase");
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const active = projects[index];
  function select(next: number) {
    setDirection(next >= index ? 1 : -1);
    setIndex((next + projects.length) % projects.length);
    setView("showcase");
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(index - 1);
    }
  }
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      expandButton.current?.focus();
    };
  }, [expanded]);
  useEffect(() => {
    const row = thumbnails.current;
    const button = row?.children[index] as HTMLElement | undefined;
    if (!row || !button) return;
    const left =
      button.offsetLeft -
      row.offsetLeft -
      (row.clientWidth - button.clientWidth) / 2;
    row.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [index, reduced, view]);
  return (
    <section
      id="projects"
      className={styles.projects}
      aria-labelledby="projects-heading"
      style={{ "--accent": active.accent } as CSSProperties}
    >
      <div className={styles.projectHeader}>
        <div>
          <p className={styles.eyebrow}>03 / Selected work</p>
          <h2 id="projects-heading">
            MY
            <br />
            <span>WORK.</span>
          </h2>
        </div>
        <p className={styles.projectIntro}>
          A collection of ideas,
          <br />
          built into working systems.
        </p>
        <div className={styles.viewControls} aria-label="Tampilan proyek">
          <button
            type="button"
            aria-pressed={view === "showcase"}
            onClick={() => setView("showcase")}
          >
            Showcase
          </button>
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            All projects
          </button>
        </div>
      </div>
      {view === "showcase" ? (
        <div
          className={styles.showcase}
          role="region"
          aria-roledescription="carousel"
          aria-label="Presentasi proyek"
          tabIndex={0}
          onKeyDown={keyboard}
        >
          <div className={styles.stageHeader}>
            <span>
              <b>{String(index + 1).padStart(2, "0")}</b> / {active.category}
            </span>
            <button
              type="button"
              ref={expandButton}
              onClick={() => setExpanded(true)}
            >
              Perbesar gambar ⤢
            </button>
          </div>
          <div
            className={styles.stage}
            onTouchCancel={() => {
              touch.current = null;
            }}
            onTouchStart={(event) => {
              const p = event.touches[0];
              touch.current = { x: p.clientX, y: p.clientY };
            }}
            onTouchEnd={(event) => {
              const p = event.changedTouches[0];
              const start = touch.current;
              touch.current = null;
              if (!start) return;
              const dx = p.clientX - start.x;
              const dy = p.clientY - start.y;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
                select(index + (dx < 0 ? 1 : -1));
            }}
          >
            <AnimatePresence initial={false} mode="sync" custom={direction}>
              <motion.div
                className={styles.slide}
                key={active.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    opacity: 0,
                    x: reduced ? 0 : d * 60,
                    scale: reduced ? 1 : 0.985,
                  }),
                  exit: (d: number) => ({
                    opacity: 0,
                    x: reduced ? 0 : -d * 60,
                  }),
                }}
                initial="enter"
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit="exit"
                transition={{
                  duration: reduced ? 0.15 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectImage project={active} eager />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.projectMeta}>
            <div className={styles.projectTitle}>
              <p>
                {active.year} / PROJECT {String(index + 1).padStart(2, "0")}
              </p>
              <h3>{active.title}</h3>
            </div>
            <div className={styles.projectSummary}>
              <p>{active.description}</p>
              <div className={styles.tags}>
                {active.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.navigation}>
            <p aria-live="polite" aria-atomic="true">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>
                {" "}
                / {String(projects.length).padStart(2, "0")} · {active.title}
              </span>
            </p>
            <div>
              <button
                type="button"
                onClick={() => select(index - 1)}
                aria-label="Proyek sebelumnya"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => select(index + 1)}
                aria-label="Proyek berikutnya"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={thumbnails}
            className={styles.thumbnails}
            data-native-scroll
            aria-label="Pilih proyek"
          >
            {projects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                aria-label={`Lihat ${project.title}`}
                aria-pressed={index === i}
                onClick={() => select(i)}
                style={{ "--thumb-accent": project.accent } as CSSProperties}
              >
                <div className={styles.thumbImage}>
                  <ProjectImage project={project} />
                </div>
                <span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {project.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          className={styles.projectGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {projects.map((project, i) => (
            <motion.button
              type="button"
              key={project.id}
              onClick={() => select(i)}
              whileHover={reduced ? {} : { y: -6 }}
              className={styles.gridCard}
            >
              <div className={styles.gridImage}>
                <ProjectImage project={project} />
              </div>
              <div className={styles.gridCopy}>
                <p style={{ color: project.accent }}>{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span>Lihat proyek ↗</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
      {expanded && (
        <dialog
          ref={dialog}
          className={styles.lightbox}
          data-native-scroll
          aria-label={`Gambar proyek ${active.title}`}
          onCancel={() => setExpanded(false)}
          onClose={() => setExpanded(false)}
          onKeyDown={keyboard}
        >
          <div className={styles.lightboxToolbar}>
            <p>
              {index + 1} / {projects.length} · {active.title}
            </p>
            <button type="button" autoFocus onClick={() => setExpanded(false)}>
              Tutup ✕
            </button>
          </div>
          <div className={styles.lightboxImage}>
            <ProjectImage key={active.id} project={active} eager />
          </div>
          <div className={styles.lightboxControls}>
            <button type="button" onClick={() => select(index - 1)}>
              ← Sebelumnya
            </button>
            <button type="button" onClick={() => select(index + 1)}>
              Berikutnya →
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
