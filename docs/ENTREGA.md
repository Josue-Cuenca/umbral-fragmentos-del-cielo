# Entrega y explicación del proyecto

## Archivos a entregar

El ZIP contiene el código ejecutable, recursos PNG/JSON/WAV, Phaser local y su licencia, README, autoevaluación, seis capturas y demo MP4 de 55 segundos. El repositorio Git local y su historial también están incluidos. La carpeta .git puede verse oculta en algunos exploradores: no la elimines si deseas conservar los commits.

La guía pide además un repositorio GitHub accesible. Esa publicación requiere tu cuenta y el destino que elijas; no se creó ni se inventó un enlace GitHub.

## Publicar el repositorio

1. Extrae todo el ZIP en una carpeta propia y ábrela en Visual Studio Code.
2. Revisa el juego con `npm start` y abre http://localhost:4174.
3. Abre la terminal en la raíz del proyecto y ejecuta `git log --oneline` para ver los commits reales incluidos.
4. Crea en tu cuenta GitHub un repositorio vacío; evita inicializarlo con otro README para no mezclar historiales.
5. Ejecuta `git remote add origin URL_DE_TU_REPOSITORIO`, sustituyendo el marcador por la URL real de tu repositorio.
6. Ejecuta `git push -u origin main` y completa la autenticación de GitHub si la solicita.
7. Verifica en el navegador que se puede acceder al repositorio con los permisos que requiere el profesor. Entrega ese enlace junto con los archivos solicitados.

Los commits incluidos están identificados como adaptación técnica asistida, sin suplantar tu identidad ni inventar fechas o participación. Antes de futuros commits configura tu propio nombre y correo de Git. La autoevaluación debe ser revisada por ti. Si el aula pide archivos separados, entrega docs/demo.mp4, las seis imágenes de docs/capturas, README.md y docs/AUTOEVALUACION.md además del ZIP.

## Puntos para explicar al profesor

| Pregunta | Explicación que debes comprender y poder demostrar |
| --- | --- |
| Dónde está Phaser | vendor/phaser.min.js; index.html lo carga y main.js crea Phaser.Game |
| Dónde se cargan recursos | BootScene.preload carga spritesheets, imágenes, niveles JSON, músicas y efectos WAV |
| Qué mueve a los personajes | Los cuerpos Arcade de Player y Enemy; Arcade integra velocidad y gravedad automáticamente |
| Cómo se evitan atravesamientos en dash | Física fija a 120 Hz; el desplazamiento máximo por paso es 7.5 px y las barreras tienen 32 px de ancho |
| Cómo funcionan las plataformas | Un process callback permite atravesarlas al subir y separa al caer desde arriba |
| Qué hace un overlap | Detecta contacto sin separar físicamente, para recoger mejoras, daño, santuario, cargas y portales |
| Cómo se pausa | Se pausan las escenas Game y HUD; Pause queda activa. El reloj de juego solo avanza en update de Game |
| Cómo sigue la cámara | Phaser Camera.startFollow con límites del mundo y deadzone |
| Dónde están HUD y controles | HUDScene, Button y TouchControls; son objetos Phaser y eventos de punteros |
| Qué guarda localStorage | Progreso, puntos, récord, sala máxima y configuración; se valida antes de cargar |
| Cómo funciona el audio | Phaser.Loader carga WAV; AudioManager usa Phaser.Sound y su volumen y mute global |
| Cómo se comprobó la victoria | Un explorador automatizado emite acciones normales y completa salas, mejoras y jefe sin cambiar vida o posiciones |

## Revisión personal antes de enviar

Comprueba el funcionamiento en tu computadora y en un teléfono, revisa y ajusta la autoevaluación y prepara una explicación propia. Verifica que la procedencia de tu juego base sea aceptada: la guía prohíbe reutilizar proyectos completos de Internet y exige comprensión técnica del trabajo asistido. El documento suministrado indica 26 de mayo de 2026; confirma la fecha vigente.
