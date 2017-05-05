
function escalar(profundidad, subida, caida) {
    var pulgadasDeProfundidad = profundidad;
    var pulgadasPorMinuto = subida;
    var pulgadasDeBajada = caida;
    var minutos = 0

    if (validateParams(profundidad, subida, caida)) {
        var temp = pulgadasDeProfundidad;
        while (temp > 0) {
            temp -= pulgadasPorMinuto;
            minutos ++;
            if (temp > 0) {
                temp += caida;
                minutos ++;
            }
        }
    }
    return minutos;
};

function validateParams(profundidad, subida, caida) {
    return caida < subida && profundidad < 100;
}
