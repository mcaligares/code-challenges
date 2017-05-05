
function escalar(pulgadasDeProfundidad, pulgadasPorMinuto, pulgadasDeBajada) {
    var minutos = 0

    if (validateParams(pulgadasDeProfundidad, pulgadasPorMinuto, pulgadasDeBajada)) {
        var temp = pulgadasDeProfundidad;
        while (temp > 0) {
            temp -= pulgadasPorMinuto;
            minutos ++;
            if (temp > 0) {
                temp += pulgadasDeBajada;
                minutos ++;
            }
        }
    }

    return minutos;
};

function validateParams(profundidad, subida, caida) {
    return caida < subida && profundidad < 100;
}
