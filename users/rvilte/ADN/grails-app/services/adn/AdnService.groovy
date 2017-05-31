package adn

import grails.transaction.Transactional

@Transactional
class AdnService {

    def adn(){
        String secuenciaUno = 'AAAAABCDEAAAAAA'
        String secuenciaDos = 'TGCTTCCTBCDEAC'

        println("CADENA 1: " + secuenciaUno)
        println("CADENA 2: " + secuenciaDos)
        String palabraMenor = secuenciaUno
        String palabraMayor = secuenciaDos

        int sizeUno = secuenciaUno.size()
        int sizeDos = secuenciaDos.size()
        int sizeMenor = sizeUno

        if (sizeUno > sizeDos){
            sizeMenor = sizeDos
            palabraMenor = secuenciaDos
            palabraMayor = secuenciaUno
        }

        def yaTaYa = true
        def conjuntoOrdenadoBaseAdyacente
        int cantLetras = sizeMenor
        int desde = 0

        while (yaTaYa){
            conjuntoOrdenadoBaseAdyacente = recoveryWord(palabraMenor, desde, cantLetras)

            if (palabraMayor.contains(conjuntoOrdenadoBaseAdyacente)){
                yaTaYa = false
                println("CONJUNTO ORDENADO BASE ADYACENTE: " + conjuntoOrdenadoBaseAdyacente)
            }

            desde = desde + 1
            if (desde + cantLetras >= sizeMenor){
                cantLetras = cantLetras - 1
                desde = 0
            }
        }
    }

    private String recoveryWord(String palabraMenor, int desde, int cantLetras){
        return palabraMenor.substring(desde, desde + cantLetras)
    }
}
