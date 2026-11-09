# UMBRAL Fragmentos del cielo

Videojuego de plataformas 2D adaptado a la guía «Proyecto Final de Primer Bimestre — Desarrollo de Videojuegos con Phaser.js». Esta versión 3 utiliza directamente Phaser 3.90.0 para escenas, sprites, animaciones, cuerpos Arcade, plataformas, cámara, HUD, botones, controles táctiles, tweens, partículas y reproducción de audio. Mantiene el arte, los mapas y los motivos musicales del ZIP proporcionado.

## Abrir el juego en Windows

1. Instala Node.js 20 o superior si tu computadora todavía no lo tiene.
2. Extrae el ZIP completo. Abre la carpeta que contiene este README.
3. Abre `INICIAR_JUEGO.bat`. Si Windows muestra el aviso de editor desconocido, el archivo no está firmado: puedes revisar su contenido antes de ejecutarlo.
4. Se abrirá una consola con el servidor y el navegador en http://localhost:4174.
5. Mantén abierta la consola mientras juegas. Cierra esa ventana cuando termines.

No abras index.html directamente con doble clic. Phaser.Loader necesita un servidor HTTP para cargar PNG, JSON y WAV. No hace falta `npm install`: Phaser y los recursos ya están incluidos. El puerto 4174 distingue esta versión de la adaptación anterior, que utilizaba 4173.

Alternativa desde Visual Studio Code: abre esta carpeta, elige Terminal → Nueva terminal, ejecuta `npm start` y abre http://localhost:4174. Si tienes Python, también puedes ejecutar `python -m http.server 4174`. Para probar en otro dispositivo de la misma red, `python -m http.server 4174 --bind 0.0.0.0` y abre la IP local del equipo seguida de :4174.

## Objetivo

Recorre seis salas de tres biomas. Recoge Alas del eco en la sala 2 para hacer doble salto y desbloquear el siguiente umbral. Recoge Dash resonante en la sala 4 para atravesar barreras de cristal y abrir el camino al último bioma. Derrota al Último Vigía en la sala 6 para ganar.

Dispones de cinco corazones y seis cargas de proyectil. La espada no consume munición. Los enemigos derrotados dejan cargas. Acércate al santuario y usa W/↑ para recuperar vida y munición. El primer contacto con el santuario también restaura al personaje. Perder todos los corazones muestra Game Over; caer al vacío quita un corazón y devuelve al santuario. Un reintento conserva descubrimientos, mejoras y enemigos derrotados. «Nuevo viaje» en el menú comienza una aventura nueva, previa confirmación, y conserva el récord.

## Controles

| Acción | Teclado | Botón táctil nativo |
| --- | --- | --- |
| Mover izquierda y derecha | A/D o ←/→ | ← y → |
| Dirección vertical del dash | W/S o ↑/↓ | ↑ y ↓ |
| Salto y doble salto | Espacio | Salto |
| Dash en ocho direcciones | Shift + dirección | Dash + dirección |
| Espada | J o Z | Espada |
| Proyectil | K o X | Disparo |
| Portal o santuario | W o ↑ | ↑ Usar |
| Pausa | Escape | Ⅱ, arriba en el HUD |
| Silenciar | Botón Sonido | Sonido, arriba en el HUD |
| Menús | ↑/↓ y Enter | Tocar un botón |

Mantén Salto para llegar más alto y suéltalo para un salto corto. Los botones permiten mantener movimiento y salto con dedos diferentes. La pausa detiene física, lógica, IA y temporizadores del nivel. Los botones HTML bajo el canvas ofrecen un acceso adicional mediante teclado y etiquetas visibles; los menús, HUD y controles dentro del juego son objetos Phaser. Los ajustes incluyen volumen, mute y reducción de sacudidas.

## Puntaje y persistencia

| Acción | Puntos |
| --- | ---: |
| Descubrir una sala | 100, una vez por aventura |
| Recoger una mejora | 500, una vez |
| Derrotar un enemigo normal | 200, una vez |
| Derrotar al jefe final | 2000, una vez |

localStorage conserva la aventura en `umbral-save-v3`, el récord y sala máxima en `umbral-records`, y el volumen, mute y reducción de movimiento en `umbral-settings-v3`. Los niveles internos se numeran de 0 a 5 y el HUD los presenta de 1 a 6. Se valida el guardado antes de cargarlo. Si existe un guardado v1 válido en el mismo origen, se puede migrar a v3; el puerto forma parte del origen del navegador. Cambiar de navegador, puerto o borrar sus datos crea un almacenamiento separado. Si el almacenamiento está bloqueado, el juego sigue funcionando en la sesión y avisa que no puede guardar.

## Arquitectura

```text
src/
  main.js                     Configuración y coordinación del Scene Manager
  scenes/
    BootScene.js              Loader PNG, spritesheets, JSON y WAV
    MenuScene.js              Menú y confirmación de nueva aventura
    GameScene.js              Mundo, colliders, overlaps y progresión
    HUDScene.js               Corazones, munición, puntos, récord y botones
    PauseScene.js             Pausa y reinicio
    ResultScenes.js           Game Over y victoria
    InfoScene.js              Controles, ajustes y créditos
  objects/
    Player.js                 Phaser.Physics.Arcade.Sprite y movimiento
    Enemy.js                  Sprites físicos, IA y jefe final
  physics/platforms.js        StaticGroup y plataformas unidireccionales
  ui/
    Button.js                 Botones Phaser y navegación por teclado
    TouchControls.js          Controles Phaser multitáctiles
  managers/
    InputManager.js           Acciones compartidas por teclado y tacto
    StorageManager.js         Guardado, validación, récord y configuración
  audio/AudioManager.js       Música y efectos con Phaser.Sound
  data/world.js               Definición de salas y paletas
  assets/                     PNG, spritesheets, JSON y WAV precalculados
vendor/                       Phaser 3.90.0 y licencia MIT
scripts/                      Servidor, generación offline y captura demo
 tests/                       Pruebas de almacenamiento y navegador
 docs/                        Cumplimiento, autoevaluación, capturas y demo
```

El Game Scene usa `physics.add.collider` para sólidos y plataformas, y `physics.add.overlap` para enemigos, proyectiles, mejoras y santuarios. Los portales consultan un overlap al pulsar Usar. La gravedad cambia con el bioma y Arcade integra automáticamente velocidades a 120 Hz; el juego renderiza con objetivo de 60 FPS. El dash recorre como máximo 7.5 píxeles por paso físico, menor que el ancho de los obstáculos; su versión resonante destruye las barreras mediante un process callback. Las plataformas unidireccionales solo separan cuerpos al caer desde arriba.

Player y Enemy son sprites nativos, las plataformas pertenecen a StaticGroup, la cámara usa startFollow y límites, y el HUD usa escenas, Text, Image y Rectangle nativos. Los proyectiles y cargas se reutilizan en pools. Las partículas están limitadas y los spritesheets y WAV se cargan una vez. La música se reproduce con Phaser.Sound y usa su mixer y mute global. El motor anterior, el renderer de cada frame y el adaptador de proxies no forman parte de esta versión.

El arte se precalcula offline en PNG; los scripts art-source.js y background-source.js conservan las rutinas artísticas de la base solo para regenerar archivos. No dibujan el juego durante su ejecución. Las melodías se exportaron a WAV con build-audio.py. No se necesita Internet para jugar.

## Pruebas y evidencias

`npm test` ejecuta ocho pruebas Node de almacenamiento y validación. Para las suites de navegador instala opcionalmente Playwright y Chromium en tu entorno de desarrollo; con `npm start` abierto ejecuta `node tests/native.mjs`, `node tests/physics.mjs` y `node tests/campaign.mjs`. Estas suites prueban el motor nativo; no usan el simulador del ZIP anterior. Ver docs/VERIFICACION.md para resultados, condiciones y límites.

La demo está en docs/demo.mp4 y dura 55 segundos con música y efectos. Las seis capturas están en docs/capturas. El explorador de pruebas y de la demo emite acciones normales: no modifica vida, posiciones, mejoras ni enemigos para completar la campaña. Los escenarios aislados de la suite physics.mjs sí colocan los objetos para probar una colisión concreta; son pruebas, no la demo.

## Entrega e historial

Revisa docs/CUMPLIMIENTO.md, docs/AUTOEVALUACION.md y docs/ENTREGA.md. Se incluye un repositorio Git local con commits reales de esta adaptación. Falta publicarlo en tu cuenta de GitHub y entregar su enlace. La autoevaluación es una propuesta técnica que debes revisar y asumir personalmente.

El Word suministrado indica 26 de mayo de 2026: confirma la fecha vigente con tu profesor. La guía exige autoría y comprensión. Debes verificar que la procedencia del juego base sea aceptable y poder explicar los módulos, porque prohíbe reutilizar proyectos completos de Internet y usar IA sin comprensión técnica.

## Créditos

Base: umbral-fragmentos-del-cielo-main.zip proporcionado por el estudiante. De ella se conservaron paletas, diseños, sprites procedurales y motivos musicales. Inspiraciones que declara esa base: Celeste, Cave Story y Hyper Light Drifter. Migración de funcionamiento a Phaser nativo realizada con asistencia de IA; no se certifica la autoría original de la base ni se atribuye al estudiante trabajo no verificado.

Phaser 3.90.0, licencia MIT: https://phaser.io; texto completo en vendor/PHASER-LICENSE.md. Documentación primaria: https://docs.phaser.io/api-documentation/3.90.0/class/physics-arcade-sprite, https://docs.phaser.io/phaser/concepts/scenes y https://docs.phaser.io/phaser/concepts/audio. No se añadieron recursos artísticos descargados ni servicios externos.
