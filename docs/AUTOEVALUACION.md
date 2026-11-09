# Autoevaluación técnica propuesta

Esta rúbrica se basa en la versión nativa y en sus pruebas. El estudiante debe revisarla, ajustarla a su trabajo y asumir personalmente sus respuestas antes de entregar. No es una nota otorgada por el docente ni certifica la autoría del juego base.

| Criterio | Peso | Puntos propuestos | Justificación |
| --- | ---: | ---: | --- |
| Funcionalidad principal | 20 | 20 | Se completa la campaña de seis salas hasta victoria usando acciones normales; derrota, reintento y progreso funcionan |
| Mecánicas de juego | 15 | 15 | Saltos, dash, plataformas, mejoras, combate, munición, checkpoints y jefe coherentes con Plataforma 2D |
| Física y colisiones | 10 | 10 | Arcade nativo integra movimiento y gravedad; pruebas específicas de plataformas, barreras, daño, invulnerabilidad y triggers |
| Arquitectura y modularidad | 15 | 15 | Escenas, sprites, managers, física, UI, audio, datos y assets separados; sin motor paralelo ni proxies |
| Rendimiento y optimización | 10 | 9 | Objetivo 60 FPS y medición superior a 45 en la prueba; falta repetir mediciones en hardware físico de presentación |
| UX y UI | 10 | 9 | HUD nativo, ayuda contextual, menús con teclado/tacto, pausa, ajustes, confirmación y resultados; en pantallas muy pequeñas se recomienda horizontal |
| Audio e inmersión | 5 | 5 | Tres músicas y trece efectos con Phaser.Sound, control de volumen y mute persistente |
| Responsividad y controles táctiles | 5 | 4 | Layout verificado en escritorio, tablet y móvil; multitáctil simulado con eventos reales de touch; pendiente ensayo con dedos en dispositivo físico |
| Código limpio y documentación | 5 | 5 | Clases, módulos, comentarios, README, guía de cumplimiento y pruebas reproducibles |
| README, video y presentación | 5 | 4 | README, video de 55 segundos y seis capturas incluidos; faltan publicación GitHub y preparación personal de la defensa |
| Total | 100 | 96 | Propuesta sujeta a revisión del estudiante y calificación docente |

Fortalezas: el funcionamiento se implementa directamente con Phaser; la prueba de campaña alcanza la victoria sin alterar estado para forzarla; se conserva la identidad visual y musical del juego base; el guardado y las entradas se prueban también ante errores y recargas.

Limitaciones: la autoría original del ZIP no está certificada; no se ha publicado en la cuenta GitHub del estudiante; se ha probado Chromium en Linux y resoluciones simuladas, no todos los navegadores ni teléfonos físicos. La asistencia de IA debe declararse y acompañarse de comprensión técnica.

Mejoras futuras: reasignación de teclas, pruebas en Safari y dispositivos de gama baja, adaptación opcional del tamaño del HUD y pruebas con usuarios. Los extras del apartado Bonus quedan a criterio del docente; no se suman puntos adicionales por anticipado.
