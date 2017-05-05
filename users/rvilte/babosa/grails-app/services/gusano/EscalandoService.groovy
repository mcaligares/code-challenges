package gusano

import grails.transaction.Transactional

@Transactional
class EscalandoService {

    def tiempoDeSubida(int profundidad, int pulgadaXmin, int pulgadaDesliza) {
        int alturaEscalada = 0
        int tiempoDemora = 0

        if (!validaIngresos(profundidad, pulgadaXmin, pulgadaDesliza)){
            return tiempoDemora
        }

        while (alturaEscalada < profundidad){
            alturaEscalada += pulgadaXmin
            tiempoDemora += 1
            if (alturaEscalada < profundidad){
                alturaEscalada -= pulgadaDesliza
                tiempoDemora += 1
            }
        }
        return tiempoDemora
    }

    def validaIngresos(int profundidad, int pulgadaXmin, int pulgadaDesliza){
        return (pulgadaDesliza < pulgadaXmin && profundidad < 100)
    }
}
