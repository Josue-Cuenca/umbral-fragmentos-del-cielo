# Umbral Fragmentos del cielo

Umbral es un videojuego de plataformas 2D en JavaScript y Phaser 3.90.0. Recorremos seis salas de tres biomas, recogemos dos mejoras y nos enfrentamos al Último Vigía. La cámara sigue a la exploradora y el HUD muestra la vida, las cargas de disparo, el puntaje y el récord.

## Cómo ejecutar el juego

1. Instala Node.js 20 o superior y extrae la carpeta del proyecto.
2. En Visual Studio Code, abre la carpeta que contiene `package.json` y elige **Terminal → Nueva terminal**.
3. Ejecuta `npm start` y abre [http://localhost:4174](http://localhost:4174).

En Windows también puedes usar `INICIAR_JUEGO.bat`. Phaser y los recursos ya están incluidos en el proyecto.

## Controles

| Acción | Teclado | Pantalla táctil |
| --- | --- | --- |
| Moverse | A/D o ←/→ | ← / → |
| Saltar | Espacio | Salto |
| Dash | Shift + dirección | Dash + dirección |
| Apuntar el dash arriba o abajo | W/S o ↑/↓ | ↑ / ↓ |
| Atacar con la espada | J o Z | Espada |
| Disparar | K o X | Disparo |
| Usar un portal o santuario | W o ↑ | ↑ Usar |
| Pausar | Esc | Botón de pausa en el HUD |
| Silenciar | Botón Sonido | Botón Sonido |

Mantén el salto para ganar altura. Las **Alas del eco** de la sala 2 desbloquean el doble salto y el **Dash resonante** de la sala 4 permite romper barreras de cristal. Los santuarios restauran la vida y la munición y sirven como puntos de reintento.

## Puntaje y guardado

| Acción | Puntos |
| --- | ---: |
| Descubrir una sala | 100 |
| Recoger una mejora | 500 |
| Derrotar un enemigo | 200 |
| Derrotar al Último Vigía | 2000 |

Cada logro suma una vez por partida. Guardamos el progreso, el récord, la sala más alta y los ajustes de audio con `localStorage`. La opción **Nuevo viaje** empieza otra partida y conserva el récord y los ajustes.

## Estructura del código

| Ruta | Responsabilidad |
| --- | --- |
| `src/main.js` | Configuración de Phaser y registro de escenas |
| `src/scenes/` | Carga de recursos, menú, partida, HUD, pausa y resultados |
| `src/objects/` | Movimiento de la exploradora y comportamiento de los enemigos |
| `src/physics/` | Cuerpos sólidos y plataformas de una dirección |
| `src/ui/` | Botones y controles táctiles |
| `src/managers/` | Entrada de teclado y tacto, guardado y configuración |
| `src/audio/` | Música, efectos, volumen y silencio |
| `src/assets/` y `src/data/` | Recursos audiovisuales y datos de las salas |

Usamos `collider` para resolver el contacto con el terreno y `overlap` para detectar contactos como mejoras, proyectiles y portales. La pausa detiene la escena de juego y conserva el estado de la partida.

## Evidencias

La [demo](docs/demo.mp4) dura 55 segundos. Las [capturas](docs/capturas/) muestran el menú, las salas, el jefe, la victoria y la pausa en móvil. Ejecuta `npm test` para verificar el almacenamiento y consulta los [resultados de las pruebas](docs/VERIFICACION.md).

## Créditos

Mapas, arte y motivos musicales de [Umbral Fragmentos del cielo](https://github.com/Josue-Cuenca/umbral-fragmentos-del-cielo.git). Phaser 3.90.0 se distribuye bajo [licencia MIT](vendor/PHASER-LICENSE.md).
