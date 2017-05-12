package sr_raya

import grails.transaction.Transactional

@Transactional
class KaprekarService {

    def numberIsKaprekar(int number) {

        String numberExpString = String.valueOf(number * number)

        int lenght = numberExpString.length()
        int posicion = 1
        boolean isKaprekar = false
        int parteUno
        int parteDos

        while (posicion <= lenght && !isKaprekar){
            (parteUno, parteDos) = descomponer(numberExpString, posicion)
            isKaprekar = laSumaEsIgual(number, parteUno, parteDos)
            posicion ++
        }
        return isKaprekar ? 'SI' : 'NO'
    }

    def descomponer(String numberString, int posicion){
        int parteUno = 0
        int parteDos = 0

        if (posicion+1 < numberString.length()){
            parteUno = Integer.valueOf(numberString.substring(0, posicion))
            parteDos = Integer.valueOf(numberString.substring(posicion, numberString.length()))
        }

        return [parteUno, parteDos]
    }

    def laSumaEsIgual(int number, int parteUno, int parteDos){
        return  number == parteUno + parteDos
    }

}
