# Cumplimiento de la guía del primer bimestre

Se revisó el Word ProyectoPrimerBimestre-2026-A(2).docx completo, incluidas sus tablas, rúbrica, restricciones y entregables. Los dos adjuntos actuales coinciden byte por byte con los archivos de origen usados para esta adaptación. Esta versión 3 reemplaza el motor de ejecución previo por componentes nativos de Phaser 3.90.0. Arquetipo seleccionado: Plataforma 2D.

| Apartado de la guía | Implementación y evidencia |
| --- | --- |
| 1 Juego original y 3 Arquetipo | Mundo de seis salas, tres biomas, exploración, plataformas, enemigos y jefe. Se conserva la identidad del juego proporcionado; su procedencia debe ser validada por el estudiante |
| 2 Phaser y orientación a objetos | Player y Enemy extienden Phaser.Physics.Arcade.Sprite; las escenas extienden Phaser.Scene; managers, UI y física separados |
| 4.1 Escenas | Boot, Menu, Confirm, Game, HUD, Pause, GameOver, Victory e Info registradas en Phaser.Game |
| 4.1 Loader | BootScene.preload carga spritesheets PNG, imágenes, niveles JSON, tres músicas WAV y trece efectos WAV locales |
| 4.1 Estados y menú | Scene Manager inicia, pausa, reanuda y detiene escenas; menú y botones son objetos Phaser |
| 4.1 Pausa | La escena Game y HUD se pausan; el reloj de juego y sus cooldowns no avanzan; Pause ofrece continuar, ajustes, reiniciar sala y volver al título |
| 4.1 Game Over y reinicio | Pantalla Game Over con reintento en santuario; confirmación de nueva aventura desde el menú; nuevo juego conserva récord y ajustes |
| 4.2 Estructura profesional | src/scenes, objects, ui, managers, assets, physics, audio, data y main.js |
| 4.3 Movimiento | Movimiento horizontal, salto variable, coyote time, buffer de salto, doble salto y dash en ocho direcciones |
| 4.3 Colisiones | Arcade resuelve cuerpos dinámicos contra StaticGroup de sólidos, plataformas y barreras |
| 4.3 Puntaje | Descubrimiento 100; mejoras 500; enemigos 200; jefe 2000. Sin duplicar puntos por visitar o recoger otra vez |
| 4.3 HUD | Escena Phaser con corazones, munición, dash, puntos, récord, sala actual, sala máxima, mejoras, ayuda contextual y barra del jefe |
| 4.3 Enemigos y retos | Crawler, moth, hopper, sentinel, drone, lancer y jefe; patrulla, salto, persecución, disparos y agresividad al bajar salud |
| 4.3 Victoria | Derrotar al jefe de la sala 6 registra la victoria y abre VictoryScene |
| 4.3 Derrota | Salud cero abre GameOverScene; caída al vacío resta salud y devuelve al santuario |
| 4.3 Persistencia de progreso | Sala, descubrimientos, mejoras, enemigos vencidos, barreras rotas, puntaje, tiempo y caídas en localStorage |
| 4.4 Arcade Physics | Integración automática de velocidad y gravedad; fps físico fijo de 120; colliders y callbacks nativos |
| 4.4 Triggers y overlaps | Mejora, santuario, portales, daño, proyectiles, cargas y hitbox de espada mediante cuerpos y overlap Arcade |
| 4.4 Gravedad o rebotes | Gravedad variable por bioma. Las plataformas unidireccionales permiten ascender desde abajo y aterrizar por arriba |
| 4.5 Música | Tres bucles locales WAV, uno por bioma, reproducidos con Phaser.Sound |
| 4.5 Dos o más efectos | Trece efectos cargados y utilizados: salto, dash, espada, disparo, daño, impacto, muerte de enemigo, santuario, bloqueo, rotura, derrota, mejora y victoria |
| 4.5 Mute | Botón nativo en HUD y ajustes; acceso adicional bajo el canvas; mute y volumen persistentes |
| 4.6 High Score | StorageManager conserva el máximo entre aventuras y lo presenta en HUD y menú |
| 4.6 Nivel alcanzado | Sala máxima persistente; internamente 0–5, visualmente 1–6 |
| 4.6 Configuración de audio | Mute y volumen en umbral-settings-v3; recuperación tras recarga comprobada |
| 4.7 Responsive | Phaser.Scale.FIT, página adaptable, mundo y HUD completos en escritorio, tablet y móvil |
| 4.7 Controles equivalentes | Acciones comunes de InputManager; botones nativos con múltiples punteros. Prueba simultánea derecha + salto aprobada |
| 4.8 Rendimiento | Objetivo de 60 FPS; medición real y límites descritos en VERIFICACION.md; recursos locales precargados, pools y partículas limitadas |
| 4.9 Accesibilidad | Contraste, instrucciones visibles, controles documentados, mute, reducción de sacudidas, menús con teclado y controles HTML auxiliares etiquetados |
| 5.1 Programación | Escenas, objetos, física, UI, audio y persistencia con responsabilidades separadas y clases reutilizables |
| 5.2 Código | Nombres de clases y métodos descriptivos; comentarios en integración, plataformas, persistencia y pruebas; módulos ES |
| 6 Repositorio e historial | Repositorio Git local incluido con commits reales de esta adaptación. Publicación y accesibilidad GitHub pendientes en la cuenta del estudiante |
| 6 Proyecto ZIP | Código y recursos completos, sin necesidad de instalar dependencias para jugar; servidor Node y launcher Windows incluidos |
| 6 Video | docs/demo.mp4, 55 segundos, con gameplay, menú, pausa, ajustes, mute, victoria y audio |
| 6 Capturas | Seis capturas actuales en docs/capturas: menú, ruinas, cristales, jefe, victoria y pausa móvil |
| 6 README | Ejecución, controles, estructura, decisiones, pruebas y créditos |
| 6 Autoevaluación | Rúbrica técnica completa en AUTOEVALUACION.md, a revisar y asumir por el estudiante |
| 7 Tecnologías | Phaser.js y JavaScript. Node solo sirve los archivos. Vite es recomendado, no obligatorio |
| 8 Assets recomendados | No se exige descargarlos; se utilizan recursos derivados del arte y música proporcionados, con procedencia declarada |
| 10 Bonus | Jefe final incluido. Los demás extras son opcionales y no se añaden funcionalidades ajenas al alcance |
| 11 Restricciones | Se declara la asistencia y la base. El estudiante debe verificar autoría y comprender el código; el proyecto no certifica por sí solo estas condiciones académicas |
| 14 Fecha | El Word indica 26 de mayo de 2026; confirmar la fecha vigente con el docente |
| 15 Comprensión | Entrega incluye explicación técnica y puntos para la defensa; el estudiante debe prepararlos personalmente |

## Qué cambió respecto a la primera adaptación

| Componente | Primera adaptación | Esta versión nativa |
| --- | --- | --- |
| Personajes y enemigos | Objetos de la simulación previa representados en canvas | Phaser.Physics.Arcade.Sprite |
| Dibujo durante el juego | Renderer propio sobre CanvasTexture | Display List, sprites e imágenes nativas |
| Movimiento y colisión | Adaptador entre simulación y cuerpos proxy | Integración y colliders automáticos de Arcade |
| Plataformas | Tiles del motor original vinculados a proxies | StaticGroup con imágenes y cuerpos Arcade |
| Cámara | Desplazamiento calculado por el renderer previo | Camera.startFollow, bounds y deadzone |
| HUD y menús | Dibujo propio y paneles HTML | Escenas, Text, Rectangle, Image y Button nativos |
| Audio | Mezclador Web Audio propio | Loader WAV y Phaser.Sound |
| Tacto | Botones HTML externos | Botones Phaser con punteros múltiples |
| Motor anterior | Conservado como parte de la ejecución | Eliminado de src; solo se reutilizan arte y datos como recursos |
