# Guion Maestro de Sustentación (15 Minutos) y Arquitectura de Diapositivas — VecinOS

> **Documento Oficial para el Equipo de Sustentación**  
> **Evento:** 8.ª Hackathon UTP – El Comercio 2026  
> **Formato de Presentación:** 15 Minutos de Exposición + 5 Minutos de Preguntas del Jurado (Total: 20 min)  
> **Piloto de Aplicación:** Urb. Los Perales, Yanahuara (Arequipa)  
> **Equipo:** Rafael Ramirez, Bryan Mango, Anthony Luque, Gustavo Mendoza, Elisvan Choque

---

## Hallazgos Críticos de las Bases Oficiales y el Zoom en Vivo

1. **Regla de Material Congelado (Cierre de 48 Horas en OneDrive):**  
   Todo recurso o presentación debe quedar subido en la carpeta de OneDrive designada al culminar las 48 horas. Las bases estipulan: *"No se permitirá el uso de otros materiales o recursos"*. Por ello, las 14 diapositivas deben contener **videos cortos o GIFs a 60 fps incrustados** mostrando cada interacción (`Ventana A` $\rightarrow$ `Acción` $\rightarrow$ `Ventana B`), además de la demostración en vivo.
2. **Alineación con Ejemplos Reales del Jurado (Mario Cortijo - El Comercio):**  
   Durante la sesión de apertura en Zoom, el representante de El Comercio citó ejemplos concretos:  
   - El vecino que se accidenta jugando fútbol y necesita muletas temporales.  
   - La vecina que cocina y ofrece lasañas y postres caseros en su cuadra.  
   - El padre de familia que comparte ruta escolar (*pool escolar*).  
   - Las clases particulares de matemáticas en el barrio.  
   - La desconfianza de contratar un cerrajero callejero desconocido.  
   - La respuesta ante lluvias torrenciales (El Niño) y sismos.  
   **VecinOS incluye exactamente estos casos en su información demostrativa.**
3. **Criterios Clave de la Rúbrica Oficial:**  
   - **Propósito y Conclusiones:** Obligatorio declarar el propósito al iniciar y cerrar con conclusiones formales.  
   - **Riesgos y Beneficios Institucionales:** La rúbrica evalúa expresamente cómo la propuesta mitiga riesgos y qué beneficios otorga a instituciones (municipalidades y organizadores).  
   - **Diversificación Audiovisual:** Combinar imágenes, texto, esquemas gráficos y video.  
   - **Código y Programa:** Demostrar una solución 100% funcional y operativa, tanto en web como en APK móvil nativo.

---

## Cronograma de Tiempos (15 Minutos Exactos)

| Bloque | Intervalo | Duración | Objetivo según Rúbrica | Diapositivas |
| :--- | :---: | :---: | :--- | :---: |
| **I. Apertura, Problema y Propósito** | `00:00 – 02:30` | 2.5 min | Captura de atención, contexto barrial y declaración del **Propósito**. | Slides 1 y 2 |
| **II. Propuesta, Innovación y Seguridad** | `02:30 – 05:00` | 2.5 min | **Innovación y Creatividad** (Validación DNI, Escudo al Menor, Accesibilidad T, Regla 3 Clics). | Slides 3 y 4 |
| **III. Recorrido Funcional (Módulos 1, 2 y S.O.S.)** | `05:00 – 11:30` | 6.5 min | **Código y Programa**, **Usabilidad** y **Confiabilidad** (Trueque, Favores, Modo S.O.S., Hold-to-Call, Offline). | Slides 5 a 10 |
| **IV. Riesgos, Beneficios y Escalabilidad** | `11:30 – 13:45` | 2.25 min | **Propuesta** (Matriz de Riesgos/Beneficios) y **Escalabilidad** (Multi-Barrio, Multiplataforma). | Slides 11 y 12 |
| **V. Conclusiones y Cierre** | `13:45 – 15:00` | 1.25 min | **Conclusiones formales** y cierre de impacto. | Slides 13 y 14 |
| **VI. Rueda de Preguntas del Jurado** | `15:00 – 20:00` | 5.0 min | **Capacidad de respuesta** técnica y formal. | Anexo Q&A |

---
---

# PARTE 1: Guion Escénico para el Expositor

### BLOQUE I: Apertura, Problema y Propósito (`00:00 – 02:30`)

#### [00:00 – 01:15] Apertura: La Paradoja de Nuestros Barrios *(Diapositiva 1)*
*(Postura erguida, contacto visual con los miembros del jurado, ritmo pausado y seguro).*

> «Buenas noches, distinguidos miembros del jurado.
>
> Quiero iniciar invitándolos a recordar una situación que todos los que vivimos en un barrio, urbanización o edificio en el Perú conocemos bien: el grupo de WhatsApp de la cuadra.
>
> A primera hora de la mañana circulan saludos y cadenas; al mediodía, vecinos discuten por un vehículo mal estacionado; y al final de la tarde hay cientos de mensajes acumulados que nos llevan inevitablemente a silenciar la conversación.
>
> Pero ¿qué sucede cuando surge una necesidad genuina en la comunidad?
>
> ¿Qué pasa cuando un vecino sufre una lesión jugando fútbol y se ve obligado a gastar 180 soles en unas muletas que solo usará diez días, sin enterarse de que a tres casas de distancia otro residente guarda unas muletas idénticas en su depósito?
>
> ¿Qué pasa si extraviamos las llaves fuera de casa a las diez de la noche y nos da temor llamar a un cerrajero de un volante callejero por no saber a quién le estamos abriendo la puerta de nuestro hogar?
>
> ¿O qué ocurre cuando lluvias intensas inundan la vivienda de una vecina adulta mayor y su pedido de ayuda queda sepultado en un chat desorganizado?
>
> Hoy habitamos a pocos metros de distancia, pared con pared, pero funcionamos como completos desconocidos.»

#### [01:15 – 02:30] El Propósito de VecinOS *(Diapositiva 2)*
> «Ante esta realidad creamos **VecinOS**, implementada y validada en su primer piloto sobre la **Urbanización Los Perales, en el distrito de Yanahuara, Arequipa**.
>
> Nuestro **propósito** es transformar la cercanía física de nuestras calles en una red digital de confianza verificada, permitiendo que cualquier ciudadano —en un radio caminable de 500 metros, a menos de 10 minutos a pie— acceda a servicios y oficios locales recomendados a costo mínimo, resuelva necesidades cotidianas a través del trueque y la solidaridad sin dinero, y active de inmediato mecanismos de soporte en situaciones de emergencia para proteger a los vecinos más vulnerables.
>
> Lejos de ser un diseño estático, VecinOS es un producto 100% operativo con una arquitectura de **Doble Layout**: optimizado como plataforma Web de escritorio y como **Aplicación Móvil Nativa (.apk) para Android y PWA para iOS**, lista para continuar operando incluso cuando las redes de internet sufren caídas.»

---

### BLOQUE II: Confianza, Accesibilidad y Regla de los 3 Clics (`02:30 – 05:00`)

#### [02:30 – 03:45] Identidad Verificada y Protección al Menor *(Diapositiva 3)*
> «Para que un ciudadano confíe en otro dentro de su vecindario, el primer factor indispensable es la **seguridad**.
>
> En VecinOS no existe el anonimato. Todo registro se valida con los 8 dígitos del DNI bajo la **Ley N.° 29733 de Protección de Datos Personales**, presentando nombres ciudadanos formales y vinculándolos al cuadrante vecinal correspondiente.
>
> Pero fuimos un paso más allá e incorporamos una medida de protección pionera: **¿qué ocurre si el aplicativo es utilizado por un menor de edad?**
>
> Si un menor intenta crear una cuenta pública o comercial —como observamos en pantalla mediante nuestro DNI de prueba de menor de edad—, el sistema identifica su condición y **bloquea por completo el acceso a transacciones o acuerdos con adultos desconocidos**. Sin embargo, ante una emergencia médica, sismo o incendio, el sistema no desprotege al menor: le habilita automáticamente el **Modo Protegido S.O.S.**, permitiéndole solicitar asistencia o contactar a las brigadas vecinales sin divulgar su información privada.»

#### [03:45 – 05:00] Usabilidad Universal: Guía Interactiva, Modo Letra Grande y 3 Clics *(Diapositiva 4)*
> «En una urbanización interactúan desde jóvenes universitarios hasta personas de la tercera edad. Por ello, la usabilidad se fundamenta en tres premisas:
>
> 1. **Curva de aprendizaje cero:** Con un toque en el botón **`?`**, cualquier usuario accede a una **Guía Rápida Interactiva en 3 pasos** que describe las funciones esenciales con claridad.
> 2. **Inclusión visual con el Botón `T`:** Un toque en el conmutador de la cabecera activa el **Modo de Letra Grande**, incrementando fuentes, espaciados y zonas táctiles por encima del estándar de accesibilidad.
> 3. **Publicación en un máximo de 3 clics:** En la versión móvil, publicar un oficio, solicitar un favor o emitir una alerta requiere solo tres toques: **Toque 1** en el botón central `+`; **Toque 2** seleccionando una sugerencia rápida que autocompleta los campos requeridos; y **Toque 3** en *"Publicar en mi cuadra"*.»

---

### BLOQUE III: Recorrido Funcional Completo (`05:00 – 11:30`)

#### [05:00 – 06:30] El Visto Bueno Vecinal y el Semáforo de Caritas *(Diapositiva 5)*
> «Al ingresar a VecinOS, el usuario encuentra el estado de su entorno: oficios activos, solicitudes solidarias y seis bloques de navegación rápida (*Bento Discovery*).
>
> Para resolver el **Visto Bueno Vecinal**, reemplazamos las calificaciones abstractas por un **Semáforo de Conducta Cívica basado en caritas**:
> * 😊 **Verde (Conducta Ejemplar):** Aprobación superior al 80%.
> * 😐 **Ámbar (Conducta Aceptable):** Historial en consolidación.
> * 😟 **Rojo (Conducta a Mejorar):** Advertencia preventiva sobre incumplimientos.
>
> Detrás de esta interfaz sencilla opera un **algoritmo de ponderación comunitaria anti-fraude**: la opinión de un vecino residente con más de un año en la zona posee un peso de `1.5x`, frente a `1.0x` de un vecino activo y `0.5x` de un usuario nuevo. Esto previene que perfiles recién registrados inflen reputaciones. Asimismo, si un usuario revisa sus propias publicaciones, el sistema le permite administrarlas o eliminarlas, pero bloquea cualquier opción de autovoto.»

#### [06:30 – 08:00] Módulo 1: Servicios de Proximidad y Trueque Solidario *(Diapositiva 6)*
> «En el **Módulo 1: Servicios de Proximidad y Economía Local**, encontramos desde las lasañas artesanales de Doña Carmen Rosa Valdivia a escasos 155 metros —2 minutos a pie—, hasta servicios de cerrajería rápida de Don Jorge Luis Huanca o clases de ciencias dictadas por Mario Cortéz.
>
> Cada ficha expone la distancia exacta en metros, tiempos peatonales y las modalidades admitidas: efectivo, Yape/Plin o **Trueque**.
>
> Si un vecino no cuenta con efectivo en ese momento, activa el filtro **`Acepta trueque`**. En la tarjeta visualiza qué intercambios acepta el proveedor —por ejemplo, insumos alimenticios o soporte técnico—, pulsa **"Proponer trueque"**, remite su propuesta y el prestador puede confirmarla de inmediato, generando un acuerdo directo sin comisiones que fortalece la economía del vecindario.»

#### [07:30 – 09:15] Módulo 2: Cadena de Favores, Movilidad y Puntos Seguros *(Diapositiva 7)*
> «El **Módulo 2: Cadena de Favores y Solidaridad** es el espacio donde el dinero no interviene.
>
> Los vecinos publican tanto en la vertiente **"Ofrezco"** como **"Solicito"**, abarcando préstamo de implementos de salud (muletas, sillas de ruedas), herramientas domésticas y **Pool Escolar**.
>
> En el caso del *Pool Escolar*, padres de familia que se dirigen a los centros educativos publican sus asientos disponibles para trasladar a escolares de la misma calle, optimizando tiempos y aminorando congestión vehicular.
>
> Además, establecemos un protocolo de seguridad física mediante **Puntos Seguros de Encuentro**: para realizar la entrega de un implemento o herramienta sin exponer el domicilio particular a un primer contacto, el sistema sugiere zonas públicas concurridas e iluminadas, tales como el *Parque Central Los Perales* o la *Caseta de Serenazgo*.»

#### [09:15 – 10:30] Soporte en Emergencias: Tablero EDAN y Gesto Hold-to-Call *(Diapositivas 8 y 9)*
> «El desafío exigía que la plataforma **evolucionara durante una emergencia**.
>
> Al pulsar la pestaña **S.O.S.**, la interfaz adopta instantáneamente un **Modo Oscuro de Emergencia de Alto Contraste**, idóneo para situaciones de corte eléctrico o visibilidad nocturna.
>
> La clasificación sigue las pautas de **Evaluación de Daños y Análisis de Necesidades (EDAN de INDECI)**: *Salud y Vida*, *Agua y Alimento*, *Inundación y Lluvia* (esencial en Arequipa ante el desborde de torrenteras) e *Infraestructura y Energía*.
>
> Ante reportes sobre **vecinos en condición de vulnerabilidad**, se activa un **Radio Protector de 150 metros** que reserva la dirección exacta para resguardar su seguridad, mientras los vecinos de la brigada pueden pulsar **"En camino a apoyar"**, coordinando quiénes brindan asistencia y qué implementos aportan.
>
> Complementariamente, en la versión móvil y APK, los **Teléfonos de Auxilio Rápido** (Serenazgo, Bomberos 116, SAMU 106, Policía 105) operan con el gesto **Hold-to-Call de 1 segundo**: el vecino debe mantener presionado el botón un segundo completo mientras se completa un anillo visual con retroalimentación háptica, evitando llamadas no intencionadas originadas en el bolsillo o en momentos de tensión.»

#### [10:30 – 11:30] Geolocalización y Confiabilidad Offline-First *(Diapositiva 10)*
> «Toda la interacción barrial se integra en el **Mapa Comunitario en Vivo**, geolocalizado en Yanahuara con marcadores de oficios, favores y alertas pulsantes.
>
> ¿Y cómo aseguramos la **Confiabilidad** si las redes telefónicas colapsan durante un desastre natural?
>
> VecinOS cuenta con una **arquitectura Offline-First**. Al perderse el enlace a internet, la aplicación no interrumpe su ejecución: activa el banner de *Modo Offline*, permite consultar los datos locales precargados de la manzana y encola los nuevos reportes como `Pendiente de sincronizar`, transmitiéndolos automáticamente tan pronto se recupera la conectividad.»

---

### BLOQUE IV: Riesgos, Beneficios y Escalabilidad (`11:30 – 13:45`)

#### [11:30 – 12:45] Análisis de Riesgos y Beneficios Institucionales *(Diapositiva 11)*
> «Para garantizar la solidez de la propuesta, contrastamos los principales riesgos barriales con sus controles técnicos:
>
> * **Riesgo de infiltración o perfiles ficticios:** Mitigado con validación de DNI y nombres civiles reales sin seudónimos.
> * **Riesgo en intercambio de bienes:** Mitigado mediante la recomendación de *Puntos Seguros de Encuentro*.
> * **Riesgo de vulneración a menores:** Mitigado con bloqueo automático a perfiles de menores y asignación al *Modo Protegido S.O.S.*
> * **Riesgo de exposición de ancianos en crisis:** Mitigado con difuminación de coordenada en radio de 150m.
> * **Riesgo de llamadas falsas:** Mitigado con confirmación táctil sostenida de 1 segundo (*Hold-to-Call*).
>
> En cuanto a los **beneficios institucionales**:
> 1. **Vecinos:** Reducción de costos de traslado y solución de necesidades en menos de diez minutos a pie.
> 2. **Gobiernos Locales (Municipalidades y Serenazgo):** Canal de triaje preventivo por cuadras que descongestiona las líneas de auxilio y geolocaliza prioridades en desastres.
> 3. **Entidades Promotoras (UTP y El Comercio):** Modelo replicable con alto valor social que formaliza y fortalece las redes comunitarias en el Perú.»

#### [12:45 – 13:45] Escalabilidad Técnica y Proyección *(Diapositiva 12)*
> «La **Escalabilidad** del sistema descansa sobre tres ejes:
> 1. **Escalabilidad Territorial:** Basada en geocercas modulares de 500 metros, lo que permite replicar el modelo en cualquier urbanización de Lima o provincias sin alterar el núcleo del sistema.
> 2. **Escalabilidad Multiplataforma:** Un mismo código en TypeScript y React entrega la Web responsiva, la PWA y el ejecutable nativo para Android (.apk) de solo 4 megabytes.
> 3. **Interoperabilidad:** Estructura lista para integrarse vía API con sistemas de alerta sísmica (IGP/INDECI) y padrones oficiales de RENIEC.»

---

### BLOQUE V: Conclusiones y Cierre (`13:45 – 15:00`)

#### [13:45 – 15:00] Conclusiones y Mensaje Final *(Diapositivas 13 y 14)*
> «Para concluir nuestra presentación, sintetizamos nuestras **tres conclusiones**:
>
> 1. **Primera conclusión:** La economía de proximidad prospera cuando se basa en la confianza verificada. El *Visto Bueno Vecinal* con caritas y ponderación cívica traslada la recomendación tradicional a una experiencia simple para todas las edades.
> 2. **Segunda conclusión:** La ayuda solidaria cotidiana y la respuesta a emergencias forman un solo continuo. Al vincular el intercambio del día a día con el panel S.O.S., la red vecinal permanece articulada antes de que suceda una eventualidad.
> 3. **Tercera conclusión:** VecinOS cumple integralmente con los lineamientos del certamen: intuitiva, accesible, enfocada en tres toques, resiliente sin internet y disponible hoy tanto en web como en aplicativo móvil instalable.
>
> *(Contacto visual directo con el jurado)*:
> Durante años, la tecnología nos conectó con personas situadas al otro lado del planeta, pero nos volvió indiferentes ante quien habita cruzando el pasillo o la calle. **VecinOS** devuelve la tecnología al barrio para volver a conocernos, apoyarnos y protegernos como verdaderos vecinos.
>
> Muchas gracias. Quedamos a disposición de sus preguntas.»

---
---

# PARTE 3: Banco de Respuestas para los 5 Minutos de Preguntas del Jurado (Q&A)

1. **«¿Cómo previenen que una persona inescrupulosa use un DNI de otra persona para ingresar a las viviendas?»**  
   * **Respuesta:**  
     *«Aplicamos tres barreras concurrentes: en primer lugar, ningún usuario nuevo goza de confianza automática; toda cuenta inicia en factor `0.5x` sin recomendaciones previas, por lo que los vecinos advierten de inmediato la ausencia de avales de residentes antiguos. En segundo término, para préstamos y trueques recomendamos utilizar los **Puntos Seguros de Encuentro** en espacios públicos iluminados como el Parque Central o la Caseta de Serenazgo, evitando visitas al domicilio particular. Y en tercer lugar, la arquitectura contempla en su siguiente fase el enlace con verificación biométrica facial de RENIEC.»*

2. **«¿Qué sucede si un vecino califica negativamente a otro por rencillas personales?»**  
   * **Respuesta:**  
     *«El algoritmo ponderado neutraliza ese sesgo: el voto de un vecino referente con amplio arraigo barrial pesa `1.5x`, mientras que cuentas recientes o aisladas pesan `0.5x`. Además, en VecinOS no existen calificaciones anónimas; cada evaluación lleva firma ciudadana y el proveedor dispone de réplica directa visible en la misma ficha.»*

3. **«El reto exige operatividad en emergencias cuando colapsa internet. ¿Cómo opera la solución sin red?»**  
   * **Respuesta:**  
     *«Frente a sismos o temporales, las redes celulares suelen saturarse de inmediato. VecinOS descarga en el almacenamiento local del teléfono el padrón de oficios, recursos críticos y contactos de emergencia del radio de 500 metros. Sin internet, el vecino puede consultar inmediatamente quién cuenta con un generador o botiquín en la cuadra, y los reportes generados se encolan localmente para transmitirse de forma autónoma en cuanto se detecta señal.»*

4. **«¿Cuál es la sostenibilidad del proyecto si no se aplican comisiones a los vecinos?»**  
   * **Respuesta:**  
     *«Cobrar porcentajes sobre un trueque o sobre un menú económico desvirtuaría la naturaleza del reto. La sostenibilidad descansa en el esquema **B2G (Business to Government)**: las comunas distritales asignan presupuesto a sistemas de empadronamiento EDAN que la ciudadanía no suele utilizar en el día a día. VecinOS ofrece un canal barrial activo permanentemente, monetizable mediante licenciamiento municipal para optimización de Serenazgo y Defensa Civil.»*

5. **«¿Qué justificó construir una versión en APK nativo además de la versión web?»**  
   * **Respuesta:**  
     *«El reto define expresamente un 'enfoque móvil'. En un escenario de alarma a altas horas de la noche, un vecino no recurre a un navegador web; presiona un ícono en su pantalla principal. El APK de 4.3 megabytes permite disponer de respuesta háptica, la confirmación táctil de 1 segundo (*Hold-to-Call*) para llamar a emergencias sin discado accidental y persistencia local sin depender de la caché del navegador.»*
