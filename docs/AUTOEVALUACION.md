# Autoevaluación de Umbral

Puntaje propuesto para revisión del equipo.

| Criterio | Peso | Puntaje | Justificación |
| --- | ---: | ---: | --- |
| Funcionalidad principal | 20 | 20 | Podemos jugar desde el menú hasta la victoria y reintentar desde un santuario tras perder. |
| Mecánicas | 15 | 15 | Combinamos plataformas, saltos, dash, mejoras, enemigos y checkpoints. |
| Física y colisiones | 10 | 10 | Usamos Arcade Physics para la gravedad, las colisiones y la detección de interacciones. |
| Arquitectura y modularidad | 15 | 15 | Organizamos el código por escenas, objetos, interfaz y gestores. |
| Rendimiento y optimización | 10 | 9 | Superamos 45 FPS en la grabación. Falta medir en el equipo de presentación. |
| UX y UI | 10 | 9 | El HUD muestra vida, cargas, puntos y progreso. En pantallas pequeñas queda por evaluar el tamaño de los textos. |
| Audio e inmersión | 5 | 5 | Cada bioma tiene música. Las acciones tienen efectos y se puede silenciar el audio. |
| Responsividad y controles táctiles | 5 | 4 | Probamos teclado y tacto en Chromium. Falta repetir las pruebas en un teléfono físico. |
| Código limpio y documentación | 5 | 5 | Usamos nombres descriptivos y documentamos cómo ejecutar, jugar y recorrer el código. |
| README, video y presentación | 5 | 4 | Incluimos README, demo y seis capturas. Falta publicar y comprobar el acceso a GitHub. |
| Total | 100 | **96** | |

**Fortaleza.** Las mejoras cambian cómo recorremos las salas y los checkpoints permiten reintentar conservando lo descubierto.

**Limitación.** Las pruebas de móvil se realizaron con emulación en Chromium y el rendimiento se midió en un solo entorno.

**Mejora futura.** Probar con distintos teléfonos, ajustar el tamaño de los controles y permitir reasignar las teclas.
