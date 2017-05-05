package gusano

import grails.transaction.Transactional

@Transactional
class EscalandoService {

    def tiempoDeSubida(int profundidad, int pulgadaXmin, int pulgadaDesliza) {
        int alturaEscalada = 0
        int tiempoDemora = 0
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
}
