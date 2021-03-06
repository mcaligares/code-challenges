# Code Challenges
### Retos lógicos para resolver con programación.

## Uso
```bash
npm install
#crear nuevo workspace
gulp --username mcaligares --language java
#crear nuevo workspace con alias
gulp -u mcaligares -l java
#sobreescribir workspace
gulp -u mcaligares -l javascript -o
#crear workspace de forma interactiva
gulp -interactive
```
## Opciones
<table>
    <tr>
        <td>Parámetro</td>
        <td>Alias</td>
        <td>Descripción</td>
    </tr>
    <tr>
        <td>username</td>
        <td>u</td>
        <td>nombre del usuario que resolverá el reto.</td>
    </tr>
    <tr>
        <td>language</td>
        <td>l</td>
        <td>Lenguaje con el cual el usuario resolverá el reto.</td>
    </tr>
    <tr>
        <td>interactive</td>
        <td>i</td>
        <td>Activar el modo interactivo.</td>
    </tr>
    <tr>
        <td>override</td>
        <td>o</td>
        <td>Sobreescribir workspace</td>
    </tr>
    <tr>
        <td>folder</td>
        <td>f</td>
        <td>Nombre de la carpeta contenedora del workspace</td>
    </tr>
</table>

## Crear nuevo reto
Para crear un nuevo reto se debe crear un archivo sin extensión dentro de la carpeta _challenges_ y subirlo a la rama _develop_.

El reto deberá contar con:
- Enunciado bien redactado
- Ejemplo de datos de entrada
- Ejemplo de datos de salida
- Mención u origen del reto.

## Participar en un reto
Para participar en un reto se coordinará la hora de inicio con los demas participantes. Llegado el momento se procederá a resolver el reto. Una vez terminado o finalizado se subirán los cambios para que los demás participantes puedan ver las diferentes soluciones.

## Actualizar repositorio
```bash
#cambiar a rama develop y traer cambios
gulp update
```
## Crear un workspace
```bash
#crear workspace
gulp init -u mcaligares -l java -f mytest
#crear workspace en modo interactivo
gulp init -i
```
