/* ══════════════════════════════════════════════════════════════════
   ██  main.js
   ██  Portfolio · Iván Batista Herrero · Analista SOC L1
   ══════════════════════════════════════════════════════════════════
   Controla toda la interactividad del portfolio:
     § 01 · Repositorios de proyecto → badges de GitHub
     § 02 · Tarjetas de proyecto enlazadas a repos
     § 03 · Terminal typing — efecto escritura en el hero
     § 04 · Matrix rain — scramble de caracteres en About
     § 05 · Tarjeta 3D holográfica — tilt + giroscopio
     § 06 · Proyector holográfico — animación FLIP con portal DOM
     § 07 · Grid hexagonal de habilidades — generado dinámicamente
     § 08 · VanillaTilt — perspectiva 3D en tarjetas
     § 09 · Portapapeles + descarga de CV
     § 10 · Tarjetas de comunicación — botones de copia
     § 11 · Reveal on scroll — IntersectionObserver por sección
     § 12 · Progreso lateral — navegación por puntos
     § 13 · Burbujas flotantes — canvas con física e iluminación
     § 14 · Globo de red — Three.js con satélites y arcos de datos
     § 15 · Status cycler — indicador de disponibilidad en footer
   ══════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
   § 01 · REPOSITORIOS DE PROYECTOS
   Mapa clave → URL de GitHub para cada tarjeta de proyecto.
   Rellena o deja vacío ("") para activar o desactivar el badge.
   ══════════════════════════════════════════════════════════════════ */
const PROJECT_REPOS = {
  cronometro: "https://github.com/1van106/CronometoAytoEspartinas",  // 03.01 · CRONÓMETRO DE PLENOS
  websocket:  "https://github.com/1van106",                          // 03.02 · WEBSOCKET POLICÍA LOCAL
  portfolio:  "https://github.com/1van106/Portfolio",                // 03.03 · PORTFOLIO
  soclab:     "https://github.com/1van106"                           // 03.04 · ZERO TRUST ARCHITECTURE
};

/* ══════════════════════════════════════════════════════════════════
   § 02 · TARJETAS DE PROYECTO → GITHUB
   Inyecta el badge git en .proj-meta y hace la tarjeta entera
   clickable si la clave tiene URL en PROJECT_REPOS.
   Tarjetas sin URL permanecen visibles pero no son interactivas.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const cards = document.querySelectorAll('.proj-card[data-repo-key]');
  cards.forEach(card => {
    const key = card.dataset.repoKey;
    const url = (PROJECT_REPOS[key] || '').trim();
    const hasUrl = !!url;

    // build the repo badge inside .proj-meta (top-right area)
    const meta = card.querySelector('.proj-meta');
    if (meta) {
      const a = document.createElement('a');
      a.className = 'proj-repo';
      a.href = hasUrl ? url : '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', hasUrl ? 'Ver repositorio en GitHub' : 'Repositorio privado');
      a.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.88 2.34.67.07-.52.28-.88.51-1.08-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.5v2.22c0 .21.15.46.55.38A8 8 0 0 0 8 0z"/></svg><span>git</span><span class="arr">↗</span>';
      // insert before the status-pill (so it sits between id and status, or wraps cleanly)
      const pill = meta.querySelector('.status-pill');
      if (pill) meta.insertBefore(a, pill);
      else meta.appendChild(a);
    }

    if (hasUrl) {
      card.classList.add('is-clickable');
      card.dataset.repo = url;
      card.setAttribute('aria-label', 'Abrir repositorio: ' + url);

      const open = (newTab) => {
        if (newTab) window.open(url, '_blank', 'noopener,noreferrer');
        else window.location.href = url;
      };

      // whole-card click — ignore clicks that originated on an interactive child
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        open(true);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(true);
        }
      });
    } else {
      // keep card present but non-interactive — strip role/tabindex
      card.removeAttribute('role');
      card.removeAttribute('tabindex');
    }
  });
})();

/* ══════════════════════════════════════════════════════════════════
   § 03 · TERMINAL TYPING — prompt del hero
   Escribe y borra líneas de comando en un loop infinito.
   Velocidad variable en el tipeo (70-130ms) para simular escritura real;
   borrado más rápido (35ms) para que el ciclo se sienta natural.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const target = document.getElementById('termCmd');
  if (!target) return;
  const lines = [
    'whoami',
    'cat /etc/perfil',
    './run portfolio.sh',
    'tail -f /var/log/oportunidades',
  ];
  let li = 0, ci = 0, deleting = false;
  const tick = () => {
    const cur = lines[li];
    if (!deleting) {
      target.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(tick, 1500); return; }
    } else {
      target.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
    }
    setTimeout(tick, deleting ? 35 : 70 + Math.random()*60);
  };
  setTimeout(tick, 400);
})();

/* ══════════════════════════════════════════════════════════════════
   § 04 · MATRIX RAIN — sección About
   Al entrar en viewport, reemplaza cada carácter por símbolos aleatorios
   y los restaura uno a uno con delay escalonado.
   Tokeniza por palabras (spans.word con white-space:nowrap) para que
   los saltos de línea solo ocurran entre palabras, no a mitad de un
   carácter scrambleado.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const blocks = document.querySelectorAll('[data-matrix]');
  const CHARS = '01░▒▓<>{}[]/$#@&*+';
  blocks.forEach(block => {
    const original = block.textContent;
    const frag = document.createDocumentFragment();
    const spans = [];

    // Tokenize into words and whitespace runs. Whitespace stays as plain
    // text nodes (so lines wrap there); each word becomes a single
    // inline-block .word wrapper with nowrap, containing .ch spans —
    // guarantees lines never break in the middle of a word.
    const tokens = original.match(/\s+|\S+/g) || [];
    tokens.forEach(tok => {
      if (/^\s+$/.test(tok)) {
        frag.appendChild(document.createTextNode(tok));
        return;
      }
      const word = document.createElement('span');
      word.className = 'word';
      [...tok].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = ch;
        s.dataset.original = ch;
        word.appendChild(s);
        spans.push(s);
      });
      frag.appendChild(word);
    });

    block.textContent = '';
    block.appendChild(frag);
    block._spans = spans;
  });

  function rain(block) {
    const spans = block._spans;
    spans.forEach((s, i) => {
      const orig = s.dataset.original;
      const delay = i * 8 + Math.random() * 200;
      const dur = 350 + Math.random() * 400;
      let interval;
      setTimeout(() => {
        s.classList.add('scrambling');
        interval = setInterval(() => {
          s.textContent = CHARS[(Math.random() * CHARS.length) | 0];
        }, 35);
      }, delay);
      setTimeout(() => {
        clearInterval(interval);
        s.classList.remove('scrambling');
        s.textContent = orig;
      }, delay + dur);
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        rain(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .35 });
  blocks.forEach(b => io.observe(b));
})();

/* ══════════════════════════════════════════════════════════════════
   § 05 · TARJETA 3D — ID holográfica
   Balanceo idle suave por seno + tilt interactivo al hover.
   --ry y --rx son CSS vars leídas por el transform de la tarjeta,
   --mx/--my posicionan el brillo holográfico siguiendo el cursor.
   En móvil (hover:none) usa DeviceOrientation en lugar del ratón.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const card = document.getElementById('idCard3D');
  if (!card) return;

  // hover tilt magnitudes (small, like project cards)
  const HOVER_RY = 10, HOVER_RX = 8;
  // idle auto-swing magnitudes + speeds
  const IDLE_RY = 22, IDLE_RX = 5;
  const IDLE_SPEED_Y = 0.45;  // rad/s — controls how fast it swings
  const IDLE_SPEED_X = 0.32;

  let hover = false;
  let txR = 0, tyR = 0;        // targets when hovering (deg)
  let cx = 0, cy = 0;          // current (deg)
  let mx = 50, my = 50, tmx = 50, tmy = 50;
  let lastT = performance.now();
  let elapsed = 0;

  function setVars() {
    card.style.setProperty('--ry', cx.toFixed(2) + 'deg');
    card.style.setProperty('--rx', cy.toFixed(2) + 'deg');
    card.style.setProperty('--mx', mx.toFixed(1) + '%');
    card.style.setProperty('--my', my.toFixed(1) + '%');
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    elapsed += dt;

    let tx, ty;
    if (hover) {
      tx = txR;
      ty = tyR;
    } else {
      // continuous slow rotation/swing on Y axis with subtle X bob
      tx = Math.sin(elapsed * IDLE_SPEED_Y) * IDLE_RY;
      ty = Math.sin(elapsed * IDLE_SPEED_X + 0.7) * IDLE_RX;
    }

    // smooth lerp toward targets
    const k = hover ? 0.18 : 0.10;
    cx += (tx - cx) * k;
    cy += (ty - cy) * k;
    mx += (tmx - mx) * 0.18;
    my += (tmy - my) * 0.18;
    setVars();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame((t) => { lastT = t; tick(t); });

  // hover/tilt only when over the card itself (not the whole about section)
  card.addEventListener('mouseenter', () => {
    hover = true;
    card.classList.add('is-active');
  });
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;   // 0..1
    const ny = (e.clientY - r.top) / r.height;
    txR = (nx - 0.5) * 2 * HOVER_RY;             // rotateY follows X
    tyR = -((ny - 0.5) * 2 * HOVER_RX);          // rotateX inverts Y
    tmx = Math.max(0, Math.min(100, nx * 100));
    tmy = Math.max(0, Math.min(100, ny * 100));
  });
  card.addEventListener('mouseleave', () => {
    hover = false;
    // recentre the holographic shine while idle
    tmx = 50; tmy = 50;
    card.classList.remove('is-active');
  });

  // touch tilt via device orientation (mobile flair) — only pauses swing while tilting
  let gyroOn = false;
  function onOrient(e) {
    if (!gyroOn) return;
    const beta = Math.max(-30, Math.min(30, e.beta || 0));
    const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
    hover = true;
    txR = (gamma / 30) * HOVER_RY;
    tyR = -(beta / 30) * HOVER_RX * 0.5;
  }
  if (window.matchMedia('(hover: none)').matches) {
    gyroOn = true;
    window.addEventListener('deviceorientation', onOrient, { passive: true });
  }

  // reveal
  setVars();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        card.classList.add('is-ready');
        io.unobserve(card);
      }
    });
  }, { threshold: .25 });
  io.observe(card);
})();

/* ══════════════════════════════════════════════════════════════════
   § 06 · PROYECTOR HOLOGRÁFICO — animación FLIP
   El "puck" (base del proyector) se porta al <body> al abrirse,
   porque position:fixed queda atrapado en ancestors con transform.
   Al abrir: se miden los rects origen/destino → se pasan como CSS
   vars → las transiciones CSS hacen el vuelo FLIP automáticamente.
   Al cerrar: primero apaga el holograma (PHASE 1), luego devuelve
   el puck a su posición en el flujo del DOM (PHASE 2).
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const root    = document.getElementById('idProjector');
  if (!root) return;
  const puck    = document.getElementById('idpPuck');
  const overlay = document.getElementById('idpOverlay');
  const back    = document.getElementById('idpBack');
  if (!puck || !overlay || !back) return;

  // Portal the overlay to <body> so position:fixed is anchored to the viewport,
  // not to any ancestor that gets a transform.
  if (overlay.parentElement !== document.body) {
    document.body.appendChild(overlay);
  }

  // Remember where the puck originally lives so we can put it back.
  const origParent = puck.parentNode;
  const origNext   = puck.nextSibling;

  // Compute where the puck should land (base position): horizontally centered,
  // near the bottom of the viewport. Math is tuned so the (tilted) disc fits
  // entirely inside the viewport — bottom edge ~40px above viewport bottom.
  const computeBaseRect = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const w  = Math.max(220, Math.min(320, vw * 0.24));
    const h  = w;
    // After translateX(-50%) perspective(900px) rotateX(60deg) with origin 50% 50%,
    // the visible bottom of the DISC lives ~ top + h * 0.75. But the puck now
    // has an extended outer plate (inset: -34%) whose visual footprint reaches
    // further — bottom edge ~ top + h * 0.75 + h * 0.34 * 0.5 ≈ top + h * 0.92.
    // We want THAT to clear the viewport bottom with margin, not the disc.
    return {
      x: vw / 2,
      y: vh - h * 0.92 - 40,
      w, h
    };
  };

  let isOpen = false;

  const open = () => {
    if (isOpen) return;
    isOpen = true;

    // 1. Measure current puck rect (in flow, in viewport coords)
    const r = puck.getBoundingClientRect();
    const target = computeBaseRect();

    puck.style.setProperty('--idp-from-x', r.left + 'px');
    puck.style.setProperty('--idp-from-y', r.top + 'px');
    puck.style.setProperty('--idp-from-w', r.width + 'px');
    puck.style.setProperty('--idp-from-h', r.height + 'px');
    puck.style.setProperty('--idp-to-x', target.x + 'px');
    puck.style.setProperty('--idp-to-y', target.y + 'px');
    puck.style.setProperty('--idp-to-w', target.w + 'px');
    puck.style.setProperty('--idp-to-h', target.h + 'px');

    // 2. Make overlay visible (snap, no fade) so the puck — once portaled —
    //    inherits visibility:visible.
    document.body.classList.add('idp-projecting');
    document.body.classList.add('idp-open');
    overlay.setAttribute('aria-hidden', 'false');
    puck.setAttribute('aria-expanded', 'true');

    // 3. Portal puck into the overlay and immediately fix its position at the
    //    original rect (sync — no paint between these ops, so no flash).
    overlay.appendChild(puck);
    puck.classList.add('is-launching');

    // 4. Force layout, then on next frame: kick off transitions
    void puck.offsetWidth;
    requestAnimationFrame(() => {
      puck.classList.add('is-base');         // puck slides + tilts to base
      document.body.classList.add('idp-revealed');     // backdrop + hologram fade in
    });

    // 5. Focus the back button (inside the hologram) once the materialization is done
    setTimeout(() => { back.focus({ preventScroll: true }); }, 1100);

    if (typeof showToast === 'function') showToast('// PROYECTANDO IDENT...');
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    overlay.setAttribute('aria-hidden', 'true');
    puck.setAttribute('aria-expanded', 'false');

    // ===== PHASE 1: hologram power-off =====
    // Hologram, cone and back button fade/collapse, but the backdrop and puck
    // stay put — so it really reads as "the projection shut down" rather than
    // "everything left at once".
    document.body.classList.add('idp-closing');

    // ===== PHASE 2 (after powerdown): puck flies back home, backdrop fades =====
    const POWERDOWN_MS = 520;
    setTimeout(() => {
      // Re-measure where the puck should land back (in flow). Use a probe
      // element of the same size so layout matches.
      const probe = document.createElement('div');
      probe.style.width  = puck.style.getPropertyValue('--idp-from-w') || '240px';
      probe.style.height = puck.style.getPropertyValue('--idp-from-h') || '240px';
      probe.style.visibility = 'hidden';
      origParent.insertBefore(probe, origNext);
      const homeRect = probe.getBoundingClientRect();
      probe.remove();

      puck.style.setProperty('--idp-from-x', homeRect.left + 'px');
      puck.style.setProperty('--idp-from-y', homeRect.top + 'px');
      puck.style.setProperty('--idp-from-w', homeRect.width + 'px');
      puck.style.setProperty('--idp-from-h', homeRect.height + 'px');

      // Now fade the backdrop and send the puck home.
      document.body.classList.remove('idp-revealed');
      puck.classList.remove('is-base');

      // When the puck's position transition finishes, restore it to the page.
      const onDone = (e) => {
        if (e && e.propertyName !== 'left' && e.propertyName !== 'top' && e.propertyName !== 'transform') return;
        puck.removeEventListener('transitionend', onDone);

        // Restore puck to its original location in #about
        if (origNext && origNext.parentNode === origParent) {
          origParent.insertBefore(puck, origNext);
        } else {
          origParent.appendChild(puck);
        }
        puck.classList.remove('is-launching');
        ['--idp-from-x','--idp-from-y','--idp-from-w','--idp-from-h',
         '--idp-to-x','--idp-to-y','--idp-to-w','--idp-to-h'].forEach(p => puck.style.removeProperty(p));

        // Now hide overlay (visibility) and unlock scroll
        document.body.classList.remove('idp-projecting');
        document.body.classList.remove('idp-open');
        document.body.classList.remove('idp-closing');

        puck.focus({ preventScroll: true });
      };
      puck.addEventListener('transitionend', onDone);
      // Safety timeout in case transitionend doesn't fire
      setTimeout(() => { if (!isOpen && puck.classList.contains('is-launching')) onDone(null); }, 1200);
    }, POWERDOWN_MS);
  };

  puck.addEventListener('click', (e) => { e.preventDefault(); open(); });
  back.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); close(); });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); }
  });

  // click on the backdrop (but not the hologram) also closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay
        || e.target.classList.contains('idp-bg')
        || e.target.classList.contains('idp-grid-bg')
        || e.target.classList.contains('idp-vignette')) {
      close();
    }
  });

  // Recompute base target on resize while open
  window.addEventListener('resize', () => {
    if (!isOpen) return;
    const target = computeBaseRect();
    puck.style.setProperty('--idp-to-x', target.x + 'px');
    puck.style.setProperty('--idp-to-y', target.y + 'px');
    puck.style.setProperty('--idp-to-w', target.w + 'px');
    puck.style.setProperty('--idp-to-h', target.h + 'px');
  });
})();

/* ══════════════════════════════════════════════════════════════════
   § 07 · GRID HEXAGONAL DE HABILIDADES
   Genera dinámicamente los hex tiles de lenguajes, herramientas de
   seguridad, plataformas y entorno dev. El nivel (1-5) se renderiza
   como puntos <i> — on/off según el índice vs item.n.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  // lvl: 1-5 proficiency dots
  const langs = [
    { ic: 'JV', lab: 'Java',     lvl: 'AVANZADO', n: 5 },
    { ic: 'PY', lab: 'Python',   lvl: 'AVANZADO', n: 5 },
    { ic: 'KT', lab: 'Kotlin',   lvl: 'PRÁCTICAS',n: 4 },
    { ic: '$_', lab: 'Bash',     lvl: 'AVANZADO', n: 4 },
    { ic: 'C++', lab: 'C / C++', lvl: 'INTERMEDIO', n: 3 },
    { ic: 'C#', lab: 'C#',       lvl: 'INTERMEDIO', n: 3 },
  ];
  const tools = [
    { ic: 'WZ', lab: 'Wazuh',      lvl: 'SIEM · HIDS',    n: 5 },
    { ic: 'SP', lab: 'Splunk',     lvl: 'FORENSE',         n: 4 },
    { ic: 'EL', lab: 'ELK Stack',  lvl: 'LOGS · SIEM',     n: 4 },
    { ic: 'KL', lab: 'Kali Linux', lvl: 'OFENSIVA',        n: 5 },
    { ic: 'MS', lab: 'Metasploit', lvl: 'OFENSIVA',        n: 4 },
    { ic: 'SN', lab: 'Snort IDS',  lvl: 'DETECCIÓN',       n: 4 },
  ];
  const plat = [
    { ic: 'DK', lab: 'Docker',     lvl: 'CONTENEDORES',   n: 5 },
    { ic: 'KC', lab: 'Keycloak',   lvl: 'OAuth · OIDC',   n: 4 },
    { ic: 'VT', lab: 'Vault',      lvl: 'SECRETS',        n: 4 },
    { ic: 'NX', lab: 'Nginx',      lvl: 'PEP · JWT',      n: 4 },
    { ic: 'PG', lab: 'PostgreSQL', lvl: 'BASE DE DATOS',  n: 4 },
    { ic: 'LX', lab: 'Linux',      lvl: 'BASTIONADO',     n: 5 },
  ];
  const devp = [
    { ic: 'GIT', lab: 'Git',           lvl: 'CONTROL VERSIONES', n: 5 },
    { ic: 'GH',  lab: 'GitHub',        lvl: 'REPOSITORIOS',      n: 5 },
    { ic: 'AS',  lab: 'Android Studio',lvl: 'MÓVIL',             n: 4 },
    { ic: 'IJ',  lab: 'IntelliJ IDEA', lvl: 'JVM · KOTLIN',      n: 5 },
    { ic: 'VS',  lab: 'VS Code',       lvl: 'EDITOR',            n: 5 },
    { ic: 'EC',  lab: 'Eclipse',       lvl: 'JAVA',              n: 4 },
  ];
  const make = (arr, id) => {
    const grid = document.getElementById(id);
    if (!grid) return;
    arr.forEach(item => {
      const h = document.createElement('div');
      h.className = 'hex';
      const dots = Array.from({ length: 5 }, (_, i) =>
        `<i class="${i < item.n ? 'on' : ''}"></i>`).join('');
      h.innerHTML = `
        <span class="hex-border"></span>
        <span class="ic">${item.ic}</span>
        <span class="lab">${item.lab}</span>
        <span class="lvl">${item.lvl}</span>
        <span class="dots">${dots}</span>
      `;
      grid.appendChild(h);
    });
  };
  make(langs, 'hex-langs');
  make(tools, 'hex-tools');
  make(plat,  'hex-plat');
  make(devp,  'hex-dev');
})();

/* ══════════════════════════════════════════════════════════════════
   § 08 · TILT 3D — perspectiva en tarjetas
   VanillaTilt en elementos .tilt: máx 8° de inclinación con glare
   sutil (opacidad 0.15) para simular profundidad sin marear.
   Se inicializa en 'load' para que las imágenes ya tengan tamaño.
   ══════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('.tilt'), {
      max: 8, speed: 600, glare: true, 'max-glare': .15, scale: 1.01,
    });
  }
});

/* ══════════════════════════════════════════════════════════════════
   § 09 · CONTACTO — portapapeles y descarga de CV
   showToast() es un singleton de notificación reutilizado por todos
   los botones de copia y la descarga del CV.
   copyText() usa Clipboard API con fallback a execCommand (Safari<13).
   La descarga del CV hace fetch a uploads/cv.pdf y crea un blob URL
   temporal para forzar el diálogo de descarga del navegador.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const toast = document.getElementById('copyToast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg || '// COPIADO AL PORTAPAPELES';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const copyText = async (txt) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(txt);
        return true;
      }
    } catch (_) { /* fall through */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) { return false; }
  };

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const txt = btn.dataset.copyTarget;
      const ok = await copyText(txt);
      if (ok) {
        btn.classList.add('copied');
        const label = btn.querySelector('.cb-label');
        const orig = label ? label.textContent : null;
        if (label) label.textContent = 'copiado ✓';
        showToast('// ' + txt + ' · COPIADO');
        setTimeout(() => {
          btn.classList.remove('copied');
          if (label && orig) label.textContent = orig;
        }, 1600);
      } else {
        showToast('// NO SE PUDO COPIAR');
      }
    });
  });

  // download CV button — fetches the PDF as a blob so the download works
  // even in sandboxed preview iframes where <a download target="_blank">
  // silently gets blocked.
  const dl = document.getElementById('downloadCv');
  if (dl) {
    // Intenta leer el blob desde un elemento #cvData en el DOM.
    // En la versión modularizada ese elemento ya no existe, así que
    // devuelve null y el click handler cae directamente en el fetch().
    const buildCvBlob = () => {
      const node = document.getElementById('cvData');
      if (!node) return null;
      try {
        const b64 = (node.textContent || '').replace(/\s+/g, '');
        const bin = atob(b64);
        const len = bin.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: 'application/pdf' });
      } catch (e) { return null; }
    };

    dl.addEventListener('click', async (e) => {
      e.preventDefault();
      const fileName = 'CV-Ivan-Batista-Herrero.pdf';

      let blob = buildCvBlob();
      if (!blob) {
        // fallback to fetching the file if the inlined base64 is missing
        try {
          const res = await fetch('uploads/cv.pdf', { cache: 'no-store' });
          if (res.ok) blob = await res.blob();
        } catch (_) {}
      }

      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
        showToast('// CV ENVIADO A DESCARGAS');
      } else {
        showToast('// ERROR: CV NO DISPONIBLE');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     § 10 · TARJETAS DE COMUNICACIÓN — botones de copia
     Feedback visual en dos capas: cambio de icono/label en el botón
     + toast global. showToast() ya está en el scope del closure padre.
     ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.comms-card [data-copy]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const txt = btn.dataset.copy;
      const ok = await copyText(txt);
      const lab = btn.querySelector('.lab');
      const origLab = lab ? lab.textContent : null;
      const ic = btn.querySelector('.ic');
      const origIc = ic ? ic.textContent : null;
      if (ok) {
        btn.classList.add('copied');
        if (lab) lab.textContent = 'Copiado';
        if (ic) ic.textContent = '✓';
        showToast('// ' + txt + ' · COPIADO');
        setTimeout(() => {
          btn.classList.remove('copied');
          if (lab && origLab) lab.textContent = origLab;
          if (ic && origIc) ic.textContent = origIc;
        }, 1600);
      } else {
        showToast('// NO SE PUDO COPIAR');
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════════════════
   § 11 · REVEAL ON SCROLL — secciones
   IntersectionObserver añade .in a cada <section> cuando cruza el
   12% del viewport. El CSS aplica la transición de entrada con
   translate + opacity. Se desconecta (unobserve) tras la primera vez.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const els = document.querySelectorAll('section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: .12 });
  els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
})();

/* ══════════════════════════════════════════════════════════════════
   § 12 · PROGRESO LATERAL — dots de navegación
   Resalta el punto activo en base a qué sección tiene su offsetTop
   más cercano al 35% del viewport. Scroll suave al hacer click.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const steps = document.querySelectorAll('.side-progress .step');
  steps.forEach(s => {
    s.addEventListener('click', () => {
      const t = document.getElementById(s.dataset.target);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const sections = ['hero','about','skills','projects','education','contact'].map(id => document.getElementById(id));
  const updateActive = () => {
    let active = sections[0];
    const y = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(s => { if (s && s.offsetTop <= y) active = s; });
    steps.forEach(st => st.classList.toggle('active', st.dataset.target === active.id));
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ══════════════════════════════════════════════════════════════════
   § 13 · BURBUJAS FLOTANTES — canvas de fondo
   Esferas translúcidas con contenido de ciberseguridad (términos,
   IPs, hashes hex, CVEs, puertos, emojis) que flotan hacia arriba
   y explotan en partículas al colisionar con el cursor o el toque.
   Iluminación por "sol virtual" (arriba-derecha): highlight especular,
   rim iridiscente girado, Fresnel backlit y sombra volumétrica.
   Distribución de contenido: 40% términos · 30% código · 20% emoji · 10% binario.
   ══════════════════════════════════════════════════════════════════ */
/* BUBBLES DISABLED — descomentar para reactivar
(() => {
  const canvas = document.getElementById('bubbles');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  const bubbles = [];
  const bursts = [];

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = Math.min(34, Math.max(16, Math.floor(W / 55)));

  // pools for richer, more meaningful content
  const HEX_PAIRS = () => {
    const h = '0123456789ABCDEF';
    return h[(Math.random()*16)|0] + h[(Math.random()*16)|0];
  };
  const IP = () => `${(Math.random()*255)|0}.${(Math.random()*255)|0}.${(Math.random()*255)|0}.${(Math.random()*255)|0}`;
  const MAC = () => Array.from({length:3}, HEX_PAIRS).join(':');
  const CVE_YEAR = () => 2020 + ((Math.random()*6)|0);

  // emoji "bubble" content — only renders cleanly when alone with no glow
  const EMOJIS = ['🔒','🛡️','🔑','🔐','⚠️','🚨','🐛','🔍','💻','🖥️','⚡','🧬','📡','🛰️','🪪','💾'];

  // short text terms — punchy security/dev vocabulary
  const TERMS = [
    'SYN','ACK','FIN','RST',
    'SSH','TLS','SSL','SQL',
    'XSS','RCE','SSRF','CSRF',
    'IDS','IPS','SIEM','SOC',
    'WAF','VPN','DNS','MITM',
    'JWT','OAuth','AES','RSA',
    'sudo','curl','grep','nmap',
    'CVE','CVSS','OSINT','YARA',
  ];

  // longer code-ish strings
  const CODE_STRS = [
    () => '0x' + HEX_PAIRS() + HEX_PAIRS(),
    () => '0x' + HEX_PAIRS() + HEX_PAIRS() + HEX_PAIRS(),
    () => 'CVE-' + CVE_YEAR() + '-' + (1000 + ((Math.random()*9000)|0)),
    () => IP(),
    () => MAC(),
    () => ':' + (1024 + ((Math.random()*64000)|0)) + '/tcp',
    () => Array.from({length: 8}, () => Math.random() < 0.5 ? '0' : '1').join(''),
  ];

  // weighted picker: terms 40%, code 30%, emoji 20%, binary 10%
  function makeContent() {
    const r = Math.random();
    if (r < 0.40) return { kind: 'term', text: TERMS[(Math.random()*TERMS.length)|0] };
    if (r < 0.70) return { kind: 'code', text: CODE_STRS[(Math.random()*CODE_STRS.length)|0]() };
    if (r < 0.90) return { kind: 'emoji', text: EMOJIS[(Math.random()*EMOJIS.length)|0] };
    return { kind: 'bin', text: Array.from({length: 4 + ((Math.random()*4)|0)}, () => Math.random() < 0.5 ? '0' : '1').join('') };
  }

  function spawn(x, y) {
    const content = makeContent();
    // emoji bubbles are slightly larger so the glyph reads cleanly
    const baseR = content.kind === 'emoji' ? 22 : 14;
    const r = baseR + Math.random() * (content.kind === 'emoji' ? 18 : 32);
    return {
      x: x != null ? x : Math.random() * W,
      y: y != null ? y : H + r + Math.random() * 200,
      r,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.12 + Math.random() * 0.45),
      content,
      hue: content.kind === 'emoji' ? 0 : (Math.random() < 0.88 ? 0 : 1),
      alpha: 0.35 + Math.random() * 0.45,
      wobble: Math.random() * Math.PI * 2,
      wspeed: 0.005 + Math.random() * 0.01,
      rot: (Math.random() - 0.5) * 0.3,
      dead: false,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const b = spawn();
    b.y = Math.random() * H;
    bubbles.push(b);
  }

  function burst(b) {
    const count = 14 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const sp = 2 + Math.random() * 3;
      bursts.push({
        x: b.x, y: b.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, decay: 0.018 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 2.2,
        hue: b.hue,
      });
    }
    b.dead = true;
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    for (const b of bubbles) {
      if (b.dead) continue;
      const dx = b.x - mouseX, dy = b.y - mouseY;
      if (dx*dx + dy*dy < b.r * b.r) {
        burst(b);
      }
    }
  });

  window.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    const t = e.touches[0];
    for (const b of bubbles) {
      if (b.dead) continue;
      const dx = b.x - t.clientX, dy = b.y - t.clientY;
      if (dx*dx + dy*dy < (b.r * 1.6) ** 2) burst(b);
    }
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (b.dead) {
        bubbles.splice(i, 1);
        bubbles.push(spawn());
        continue;
      }
      b.wobble += b.wspeed;
      b.x += b.vx + Math.sin(b.wobble) * 0.15;
      b.y += b.vy;

      if (b.y < -b.r - 40) {
        Object.assign(b, spawn());
        continue;
      }

      const isEmoji = b.content.kind === 'emoji';
      const r = b.r;
      const cx = b.x, cy = b.y;
      const alpha = b.alpha;
      const warn = b.hue === 1;

      // ---- VIRTUAL SUN ----
      // off-screen top-right, slightly outside the viewport
      const sunX = W * 1.02, sunY = -H * 0.12;
      const dx = sunX - cx, dy = sunY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const lx = dx / dist, ly = dy / dist;   // unit vector toward sun
      const maxD = Math.hypot(W, H) * 1.25;
      const intensity = Math.max(0.45, Math.min(1, 1 - dist / maxD));

      // 1) Faint inner fill — warmer on sun-side, cool elsewhere
      const innerCx = cx + lx * r * 0.35;
      const innerCy = cy + ly * r * 0.35;
      const innerGrad = ctx.createRadialGradient(innerCx, innerCy, r * 0.05, cx, cy, r);
      innerGrad.addColorStop(0,    `rgba(255,240,210, ${0.12 * intensity * alpha})`);
      innerGrad.addColorStop(0.55, `rgba(120,200,220, ${0.04 * alpha})`);
      innerGrad.addColorStop(1,    `rgba(0,255,204,   ${0.015 * alpha})`);
      ctx.fillStyle = innerGrad;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();

      // 2) Iridescent rim — strongest opposite to sun (where light wraps around)
      const sunAngle = Math.atan2(ly, lx);           // angle from bubble to sun
      const oppAngle = sunAngle + Math.PI;           // angle of "back rim"
      const rimAlpha = (warn ? 0.55 : 0.5) * alpha;
      const palette = warn ? [
        `rgba(255,80,120, ${rimAlpha})`,
        `rgba(255,160,80, ${rimAlpha*0.9})`,
        `rgba(220,80,255, ${rimAlpha*0.85})`,
        `rgba(0,255,204,  ${rimAlpha*0.7})`,
      ] : [
        `rgba(0,255,204,   ${rimAlpha})`,
        `rgba(120,220,255, ${rimAlpha*0.95})`,
        `rgba(180,140,255, ${rimAlpha*0.85})`,
        `rgba(255,140,200, ${rimAlpha*0.75})`,
        `rgba(255,200,120, ${rimAlpha*0.85})`,
        `rgba(140,255,180, ${rimAlpha*0.9})`,
      ];
      const rot = b.wobble * 0.3 + sunAngle;
      const seg = (Math.PI * 2) / palette.length;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      for (let i = 0; i < palette.length; i++) {
        const start = rot + seg * i;
        const end   = start + seg * 1.15;
        ctx.strokeStyle = palette[i];
        ctx.beginPath();
        ctx.arc(cx, cy, r - 0.6, start, end);
        ctx.stroke();
      }

      // 3) Big specular highlight — placed along the sun direction
      const specCx = cx + lx * r * 0.42;
      const specCy = cy + ly * r * 0.42;
      const specR = r * 0.62;
      const specGrad = ctx.createRadialGradient(specCx, specCy, 0, specCx, specCy, specR);
      specGrad.addColorStop(0,    `rgba(255,250,235, ${0.68 * intensity * alpha})`);
      specGrad.addColorStop(0.35, `rgba(255,235,200, ${0.28 * intensity * alpha})`);
      specGrad.addColorStop(0.75, `rgba(255,220,170, ${0.06 * intensity * alpha})`);
      specGrad.addColorStop(1,    `rgba(255,210,150, 0)`);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();
      ctx.fillStyle = specGrad;
      ctx.fillRect(cx - r, cy - r, r*2, r*2);
      ctx.restore();

      // 4) Tiny bright pin-point — closer to the sun than the soft highlight
      const pinCx = cx + lx * r * 0.55;
      const pinCy = cy + ly * r * 0.55;
      ctx.fillStyle = `rgba(255,255,250, ${0.95 * intensity * alpha})`;
      ctx.beginPath();
      ctx.arc(pinCx, pinCy, Math.max(1.2, r * 0.075), 0, Math.PI*2);
      ctx.fill();

      // 5) Thin shine arc on the sun-facing side
      ctx.strokeStyle = `rgba(255,250,235, ${0.38 * intensity * alpha})`;
      ctx.lineWidth = 1;
      const arcLen = Math.PI * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, sunAngle - arcLen, sunAngle + arcLen * 0.2);
      ctx.stroke();

      // 6) BACKLIT RIM (Fresnel) — bright on the side opposite the sun
      const backLen = Math.PI * 0.55;
      const backCol = warn ? `rgba(255,210,180, ${0.55 * intensity * alpha})`
                            : `rgba(255,240,210, ${0.5 * intensity * alpha})`;
      ctx.strokeStyle = backCol;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.4, oppAngle - backLen/2, oppAngle + backLen/2);
      ctx.stroke();
      // very thin inner sheen just inside the back rim
      ctx.strokeStyle = `rgba(255,255,250, ${0.22 * intensity * alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, oppAngle - backLen/2.5, oppAngle + backLen/2.5);
      ctx.stroke();

      // 7) Darker shadow on the side facing AWAY from light, midway around
      // (creates volume — the underside opposite the highlight goes a touch darker)
      const shadowAngle = sunAngle + Math.PI;
      ctx.strokeStyle = `rgba(0,10,20, ${0.30 * alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // arc between rim and back-rim positions
      ctx.arc(cx, cy, r - 0.4, shadowAngle - Math.PI*0.85, shadowAngle - backLen/2 - 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.4, shadowAngle + backLen/2 + 0.1, shadowAngle + Math.PI*0.85);
      ctx.stroke();

      // 8) Content
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (isEmoji) {
        const fs = Math.min(r * 0.95, 28);
        ctx.font = `${fs}px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.fillText(b.content.text, cx, cy + r*0.02);
      } else {
        const text = b.content.text;
        const maxW = r * 1.55;
        let fs = b.content.kind === 'term' ? Math.min(r * 0.5, 15) : Math.min(r * 0.38, 11);
        const weight = b.content.kind === 'term' ? 700 : 500;
        ctx.font = `${weight} ${fs}px JetBrains Mono, monospace`;
        while (ctx.measureText(text).width > maxW && fs > 7) {
          fs -= 0.5;
          ctx.font = `${weight} ${fs}px JetBrains Mono, monospace`;
        }
        // text picks up a hint of the warm light on the sun side
        const tcol = warn ? `255,140,150` : `140,255,225`;
        ctx.fillStyle = `rgba(${tcol}, ${0.92 * alpha})`;
        ctx.fillText(text, cx, cy);
      }
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const p = bursts[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.96; p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) { bursts.splice(i, 1); continue; }
      const col = p.hue === 0 ? `0,255,204` : `255,0,60`;
      ctx.fillStyle = `rgba(${col}, ${p.life})`;
      ctx.shadowColor = `rgba(${col}, ${p.life})`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
  }
  draw();
})();
*/

/* ══════════════════════════════════════════════════════════════════
   § 14 · GLOBO DE RED — Three.js
   Wireframe esférico con 36 nodos (12% en alerta roja), conexiones
   entre nodos próximos (<1.4u), dos anillos orbitales, satélites
   con trail, scan beam vertical y arcos de datos tipo great-circle.
   Los arcos y flares se descartan con .dispose() al expirar para
   evitar fugas de memoria en la GPU. Envuelto en try/catch para que
   un error de WebGL no rompa el resto del portfolio.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  try {
  if (!window.THREE) { console.warn('[GLOBE] no THREE'); return; }
  const canvas = document.getElementById('globe');
  if (!canvas) { console.warn('[GLOBE] no canvas'); return; }
  console.log('[GLOBE] init starting, canvas size', canvas.clientWidth, 'x', canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);  // pulled back so satellites (r=3.1) and
                                    // halo/rings (r=2.5) all fit with margin
                                    // even in the smaller hero-globe canvas

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const sphereGeo = new THREE.SphereGeometry(2, 24, 16);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.18 });
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(sphereGeo), wireMat);
  globeGroup.add(wire);

  const innerMat = new THREE.MeshBasicMaterial({ color: 0x001a18, transparent: true, opacity: 0.35 });
  const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.98, 32, 24), innerMat);
  globeGroup.add(innerSphere);

  const NODES = 36;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
  const nodeMatHot = new THREE.MeshBasicMaterial({ color: 0xff003c });

  for (let i = 0; i < NODES; i++) {
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 2;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    const hot = Math.random() < 0.12;
    const m = new THREE.Mesh(nodeGeo, hot ? nodeMatHot : nodeMat);
    m.position.set(x, y, z);
    globeGroup.add(m);
    nodes.push({ mesh: m, pos: new THREE.Vector3(x, y, z), hot });
  }

  const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.25 });
  const lineMatHot = new THREE.LineBasicMaterial({ color: 0xff003c, transparent: true, opacity: 0.4 });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = nodes[i].pos.distanceTo(nodes[j].pos);
      if (d < 1.4) {
        const geom = new THREE.BufferGeometry().setFromPoints([nodes[i].pos, nodes[j].pos]);
        const hot = nodes[i].hot && nodes[j].hot;
        const line = new THREE.Line(geom, hot ? lineMatHot : lineMat);
        globeGroup.add(line);
      }
    }
  }

  const ringGeo = new THREE.RingGeometry(2.5, 2.52, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.3;
  globeGroup.add(ring);

  const ring2 = ring.clone();
  ring2.rotation.x = Math.PI / 4;
  ring2.rotation.y = Math.PI / 5;
  globeGroup.add(ring2);

  const pingMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.5 });
  const pings = [];
  function spawnPing() {
    const n = nodes[Math.floor(Math.random() * nodes.length)];
    const geom = new THREE.RingGeometry(0.05, 0.06, 24);
    const m = new THREE.Mesh(geom, pingMat.clone());
    m.position.copy(n.pos);
    m.lookAt(0, 0, 0);
    globeGroup.add(m);
    pings.push({ mesh: m, life: 1, scale: 1 });
  }

  // ===== HALO ATMOSPHERE (faint outer pulsing wireframe) =====
  const haloGeo = new THREE.SphereGeometry(2.35, 36, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00ffcc, transparent: true, opacity: 0.05,
    wireframe: true
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  globeGroup.add(halo);

  // outer glow shell (solid, very faint, no wireframe)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00ffcc, transparent: true, opacity: 0.04, side: THREE.BackSide
  });
  const glowShell = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 24), glowMat);
  globeGroup.add(glowShell);

  // ===== ORBITING SATELLITES =====
  // Each one is a small box on its own inclined orbit. The orbit ring itself
  // is drawn as a thin line so the path reads visually.
  const sats = [];
  function makeSatellite(radius, incl, tilt, speed, color) {
    const grp = new THREE.Group();
    grp.rotation.x = incl;
    grp.rotation.z = tilt;
    // orbit trail
    const trailGeo = new THREE.RingGeometry(radius - 0.005, radius + 0.005, 96);
    const trailMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    grp.add(trail);
    // satellite body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.04, 0.04),
      new THREE.MeshBasicMaterial({ color })
    );
    body.position.set(radius, 0, 0);
    grp.add(body);
    // emitter pulse on the satellite
    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 8),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
    );
    body.add(pulse);
    globeGroup.add(grp);
    sats.push({ group: grp, body, pulse, speed, t: Math.random() * Math.PI * 2, radius });
  }
  makeSatellite(2.7, Math.PI / 3,   0.2, 0.50, 0x00ffcc);
  makeSatellite(2.9, Math.PI / 1.8, 0.6, -0.32, 0x4ab8ff);
  makeSatellite(3.1, Math.PI / 6,   -0.4, 0.22, 0x00ffcc);

  // ===== DATA ARCS (packets traveling between nodes along great-circle paths) =====
  const arcs = [];
  function spawnArc() {
    if (nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)].pos;
    let b = nodes[Math.floor(Math.random() * nodes.length)].pos;
    let tries = 0;
    while (b === a || a.distanceTo(b) < 1.2 || a.distanceTo(b) > 3.4) {
      b = nodes[Math.floor(Math.random() * nodes.length)].pos;
      if (++tries > 8) return;
    }
    // build a great-circle-ish curve by lifting the midpoint outward
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(2 + Math.min(0.9, a.distanceTo(b) * 0.35));
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const points = curve.getPoints(48);
    const isAlert = Math.random() < 0.15;
    const color = isAlert ? 0xff003c : 0x00ffcc;
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(geom, mat);
    // start with 0 visible points using drawRange
    geom.setDrawRange(0, 0);
    globeGroup.add(line);
    // packet bead that runs along the curve
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 8),
      new THREE.MeshBasicMaterial({ color })
    );
    globeGroup.add(bead);
    arcs.push({
      line, geom, mat, bead, points,
      t: 0,
      speed: 0.5 + Math.random() * 0.5,
      isAlert
    });
  }

  // ===== HOTSPOT FLARE (occasional alert ring on red nodes) =====
  const flares = [];
  function spawnFlare() {
    const hots = nodes.filter(n => n.hot);
    if (!hots.length) return;
    const n = hots[Math.floor(Math.random() * hots.length)];
    const g = new THREE.RingGeometry(0.06, 0.08, 32);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      color: 0xff003c, transparent: true, opacity: 0.9, side: THREE.DoubleSide
    }));
    m.position.copy(n.pos);
    m.lookAt(0, 0, 0);
    globeGroup.add(m);
    flares.push({ mesh: m, life: 1, scale: 1 });
  }

  // ===== SCAN BEAM (horizontal latitude band sweeping up & down) =====
  const scanGeo = new THREE.CylinderGeometry(2.04, 2.04, 0.12, 48, 1, true);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0x00ffcc, transparent: true, opacity: 0.35, side: THREE.DoubleSide
  });
  const scanBeam = new THREE.Mesh(scanGeo, scanMat);
  globeGroup.add(scanBeam);

  let lastPing = 0;
  let lastArc = 0;
  let lastFlare = 0;
  fit();
  window.addEventListener('resize', fit);

  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  let t0 = performance.now();
  function loop(t) {
    try {
    const dt = (t - t0) / 1000; t0 = t;
    globeGroup.rotation.y += dt * 0.18;
    globeGroup.rotation.x = Math.sin(t * 0.0003) * 0.15;
    ring.rotation.z += dt * 0.4;
    ring2.rotation.z -= dt * 0.3;

    // halo breathing
    const breathe = 0.04 + Math.sin(t * 0.001) * 0.025;
    haloMat.opacity = breathe + 0.03;
    halo.scale.setScalar(1 + Math.sin(t * 0.0008) * 0.015);
    glowMat.opacity = 0.035 + Math.sin(t * 0.0011) * 0.02;

    // satellites orbit
    for (const s of sats) {
      s.t += dt * s.speed;
      s.body.position.set(Math.cos(s.t) * s.radius, 0, Math.sin(s.t) * s.radius);
      s.body.lookAt(0, 0, 0);
      // pulse on satellite
      const sc = 1 + Math.sin(t * 0.006 + s.t * 4) * 0.4;
      s.pulse.scale.setScalar(sc);
      s.pulse.material.opacity = 0.5 - sc * 0.15;
    }

    // scan beam sweep
    scanBeam.position.y = Math.sin(t * 0.0008) * 1.85;
    scanMat.opacity = 0.18 + Math.abs(Math.sin(t * 0.0008)) * 0.25;

    // pings (existing)
    if (t - lastPing > 700) { spawnPing(); lastPing = t; }
    for (let i = pings.length - 1; i >= 0; i--) {
      const p = pings[i];
      p.life -= dt * 0.6;
      p.scale += dt * 3;
      p.mesh.scale.setScalar(p.scale);
      p.mesh.material.opacity = Math.max(0, p.life * 0.5);
      if (p.life <= 0) { globeGroup.remove(p.mesh); pings.splice(i, 1); }
    }

    // data arcs
    if (t - lastArc > 520) { spawnArc(); lastArc = t; }
    for (let i = arcs.length - 1; i >= 0; i--) {
      const a = arcs[i];
      if (!a.points || a.points.length === 0) { arcs.splice(i, 1); continue; }
      a.t += dt * a.speed;
      // 0..1 draw phase, 1..1.6 fade phase
      const drawPct = Math.min(1, a.t);
      a.geom.setDrawRange(0, Math.floor(drawPct * a.points.length));
      // bead position along the curve while drawing
      const idx = Math.max(0, Math.min(a.points.length - 1, Math.floor(drawPct * (a.points.length - 1))));
      const pt = a.points[idx];
      if (pt) a.bead.position.copy(pt);
      // fade after draw complete
      if (a.t > 1) {
        const fade = Math.max(0, 1 - (a.t - 1) * 1.6);
        a.mat.opacity = (a.isAlert ? 0.85 : 0.7) * fade;
        a.bead.material.opacity = fade;
        a.bead.scale.setScalar(1 + (a.t - 1) * 0.8);
      }
      if (a.t > 1.7) {
        globeGroup.remove(a.line);
        globeGroup.remove(a.bead);
        a.geom.dispose();
        a.mat.dispose();
        a.bead.geometry.dispose();
        a.bead.material.dispose();
        arcs.splice(i, 1);
      }
    }

    // hotspot flares
    if (t - lastFlare > 2400) { spawnFlare(); lastFlare = t; }
    for (let i = flares.length - 1; i >= 0; i--) {
      const f = flares[i];
      f.life -= dt * 0.7;
      f.scale += dt * 4;
      f.mesh.scale.setScalar(f.scale);
      f.mesh.material.opacity = Math.max(0, f.life * 0.9);
      if (f.life <= 0) {
        globeGroup.remove(f.mesh);
        f.mesh.geometry.dispose();
        f.mesh.material.dispose();
        flares.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
    } catch(e) { console.error('[GLOBE] loop error:', e.message, e.stack); }
  }
  requestAnimationFrame(loop);
  console.log('[GLOBE] loop kicked off');
  } catch(e) { console.error('[GLOBE] init failed:', e.message, e.stack); }
})();

/* ══════════════════════════════════════════════════════════════════
   § 15 · STATUS CYCLER — indicador de disponibilidad
   Rota mensajes de estado en el footer cada 3.2 s.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  const el = document.getElementById('statusText');
  if (!el) return;
  const msgs = [
    'DISPONIBILIDAD INMEDIATA',
    'BUSCANDO SOC L1',
    'SIEM ACTIVO · WAZUH',
    'TLS HANDSHAKE OK',
    'LISTO PARA INPUT',
  ];
  let i = 0;
  setInterval(() => { i = (i + 1) % msgs.length; el.textContent = msgs[i]; }, 3200);
})();
