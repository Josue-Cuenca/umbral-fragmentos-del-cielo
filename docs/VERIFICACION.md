# Verificación del juego

| Prueba | Resultado |
| --- | --- |
| Campaña | Se recorrieron las seis salas, se recogieron las dos mejoras y se venció al jefe. Resultado de la prueba automatizada: 3800 puntos y cero caídas. |
| Física | Las plataformas permiten pasar desde abajo y aterrizar por arriba. El dash normal se detiene ante la barrera y el resonante rompe sus piezas. |
| Interacciones | Se comprobó el bloqueo de un portal sin la mejora, la recolección de una mejora una sola vez y la invulnerabilidad temporal tras recibir daño. |
| Interfaz | Se comprobaron menú, HUD, pausa, Game Over, reintento y ajustes de audio. |
| Guardado | Ocho pruebas de Node aprobaron. El progreso, el récord y los ajustes sobreviven a la recarga. El juego permite continuar durante la sesión si se bloquea el almacenamiento. |
| Controles | En Chromium se probaron teclado y resoluciones de escritorio, tablet y móvil. La prueba automatizada de movimiento y salto simultáneos pasó al repetirla. Falta verificarla en un teléfono físico. |
| Rendimiento | Las 49 muestras de la grabación dieron un mínimo de 59,56 FPS y un promedio de 60,79 FPS. Se midió en Chromium en Linux. |

Para repetir las pruebas de almacenamiento, ejecuta `npm test`. Con el servidor abierto y Playwright con Chromium disponibles, ejecuta `node tests/native.mjs`, `node tests/physics.mjs` y `node tests/campaign.mjs`. Las muestras de rendimiento están en [medicion-fps.json](medicion-fps.json).
