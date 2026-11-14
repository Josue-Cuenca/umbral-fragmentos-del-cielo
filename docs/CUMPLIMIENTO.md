# Requisitos del proyecto

Elegimos el arquetipo **Plataforma 2D**. La meta es cruzar seis salas, obtener las dos mejoras y derrotar al Último Vigía.

| Apartado | Implementación |
| --- | --- |
| Arquitectura Phaser | `BootScene` carga imágenes, niveles y audio. Las escenas administran menú, partida, HUD, pausa, Game Over y victoria. Podemos reintentar desde el santuario o comenzar otra partida. |
| Estructura y legibilidad | Separamos escenas, personajes, interfaz, física, entrada, audio, almacenamiento y recursos. Usamos clases con nombres descriptivos y comentarios en la lógica de colisiones y guardado. |
| Mecánicas | Movimiento lateral, salto, doble salto, dash, combate, puntaje y checkpoints. El HUD muestra vida, munición y progreso. La partida termina en victoria al vencer al jefe o en derrota al quedarse sin vida. |
| Arcade Physics | La gravedad cambia por bioma. Usamos colisiones para terreno y plataformas y overlaps para mejoras, daño, santuarios y portales. |
| Audio | Hay música de fondo por bioma, efectos como salto y disparo, volumen ajustable y botón de silencio. |
| Persistencia | `localStorage` conserva partida, récord, sala máxima y configuración de audio. |
| Diseño adaptable y accesibilidad | El lienzo se ajusta a escritorio, tablet y móvil. Hay acciones equivalentes por teclado y tacto, instrucciones visibles, contraste en el HUD y opción de silencio. |
| Rendimiento | Precargamos los recursos y reutilizamos proyectiles. El mínimo registrado durante la demo fue de 59,56 FPS. |
| Funcionalidad adicional | El jefe final alterna ataques y cambia su comportamiento al perder vida. |

Los [archivos de entrega](ENTREGA.md) y los [resultados de verificación](VERIFICACION.md) acompañan el proyecto.
