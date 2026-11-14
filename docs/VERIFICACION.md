# Verificación de la versión nativa

Comprobaciones realizadas el 9 de noviembre de 2026 sobre la versión 3.0.0. El juego usa Phaser 3.90.0; las pruebas de navegador ejercitan sprites y cuerpos nativos, sin el motor de simulación ni los proxies de la adaptación anterior.

| Prueba | Resultado observado |
| --- | --- |
| Ocho pruebas Node | Todas aprobadas: validación de progreso, guardados corruptos, récord, audio, almacenamiento bloqueado y migración v1 |
| Arquitectura en navegador | Player y Enemy son Arcade.Sprite; sólidos son StaticGroup; cámara sigue a Player; reproducción mediante WebAudioSoundManager de Phaser |
| Teclado y HUD | Movimiento, salto, dash, proyectil, menús nativos, pausa y configuración aprobados |
| Menú y reinicio | Menú, confirmación/cancelación de nueva aventura, Game Over, reintento y reinicio de aventura comprobados |
| Persistencia | Progreso y mute sobreviven recarga; una aventura nueva conserva récord; almacenamiento denegado no impide jugar |
| Multitáctil | Eventos touch reales de navegador con dos contactos simultáneos mueven a la derecha y saltan; al soltar no quedan acciones retenidas |
| Plataformas de una dirección | Se atraviesan desde abajo, se alcanza y=282.475 y se aterriza exactamente en y=324 con el cuerpo apoyado sobre la plataforma |
| Barrera normal | Dash normal se detiene con el borde derecho en x=896; las tres piezas de la barrera permanecen |
| Dash resonante | El personaje cruza x=896 y destruye dos piezas de la barrera; los identificadores quedan guardados |
| Portal y mejora | Sin la mejora el portal de sala 2 no deja avanzar; el collectible suma 500 una sola vez |
| Daño e invulnerabilidad | Un proyectil hostil reduce vida de 5 a 4; un segundo contacto durante invulnerabilidad mantiene 4 |
| Campaña completa | Explorador de acciones normales recorre las seis salas, obtiene ambas mejoras y derrota al jefe sin muertes; 3800 puntos |
| Errores JavaScript | Ninguno en las suites finales de interfaz, física y campaña ni durante la grabación |
| Rendimiento grabado | 49 muestras de actualFps de Phaser: mínimo 59.56; promedio 60.79; supera 45 FPS en este entorno |
| Demo | MP4 de 55 segundos, video H.264 y audio AAC; incluye menú, juego, pausa, ajustes, mute y victoria |
| Capturas | Seis imágenes actuales del juego nativo, revisadas visualmente |

## Cómo interpretar las evidencias

La suite campaign.mjs detiene el scheduler del navegador y avanza el ciclo nativo de Phaser con headlessStep para comprobar rápidamente todo el recorrido. Phaser sigue actualizando sus escenas, cuerpos Arcade y colisiones. El controlador solo emite acciones y no cambia salud, posiciones, mejoras o enemigos. La demo ejecuta el mismo controlador a velocidad normal en navegador.

La suite physics.mjs coloca personajes y objetos en escenarios de prueba para aislar colisiones, daño y triggers. Esa preparación de pruebas no se utiliza para completar la campaña ni en el video. native.mjs comprueba el juego con teclado, mouse, botones nativos y eventos touch simultáneos.

El audio del video se capturó del mezclador de Phaser. Se conserva la pantalla final unos segundos para completar la duración de 55 segundos. No se usa el video ni las capturas de la versión anterior. Las muestras de FPS se conservan en medicion-fps.json.

## Entorno y límites

Se utilizó Chromium headless en Linux, con 1440 × 1080 para interfaz, 1280 × 1000 para grabación, 390 × 844 para móvil y 768 × 1024 para tablet. Las pruebas táctiles usan eventos del navegador y no dedos en un teléfono físico. No se verificaron Safari ni equipos de gama baja. actualFps es una estimación suavizada del motor, no una certificación de refresco de pantalla. Debes comprobar el mínimo de 45 FPS también en el equipo de presentación.

## Reproducir

- `npm test`: ocho pruebas Node, sin instalaciones adicionales.
- Con Playwright y Chromium instalados y el servidor abierto en localhost:4174: `node tests/native.mjs`, `node tests/physics.mjs` y `node tests/campaign.mjs`.
- `node scripts/record-demo.mjs`: captura nueva campaña y audio; requiere Playwright, Chromium y FFmpeg. Guarda los intermedios en .artifacts para mezclarlos posteriormente.

No se publicó GitHub ni se certificó autoría de la base: esos puntos requieren revisión personal y acceso a la cuenta del estudiante.

## Verificación con los adjuntos del 14 de noviembre de 2026

Se volvieron a ejecutar las ocho pruebas de Node y las tres suites de Chromium sobre el código incluido. La campaña volvió a recorrer las seis salas, recoger ambas mejoras y vencer al jefe con 3800 puntos y cero caídas. El recorrido registró 429 colisiones y 47 overlaps. Las suites de interfaz y física aprobaron los controles de teclado y multitáctiles, la pausa, Game Over, el reintento, la persistencia y la separación de plataformas y barreras. La demo incluida se verificó como un MP4 de 55 segundos con video H.264 y audio AAC. La medición de FPS de la sección anterior corresponde a la grabación de esa demo.
