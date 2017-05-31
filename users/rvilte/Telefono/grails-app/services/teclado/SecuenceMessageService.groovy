package teclado

import grails.transaction.Transactional

@Transactional
class SecuenceMessageService {

    def characterTipeo = ['a':'2', 'b':'22', 'c':'222',
                        'd':'3', 'e':'33', 'f':'333',
                         'g':'4', 'h':'44', 'i':'444',
                         'j':'5', 'k':'55', 'l':'555',
                         'm':'6', 'n':'66', 'o':'666',
                         'p':'7', 'q':'77', 'r':'777', 's':'7777',
                         't':'8', 'u':'88', 'v':'888',
                         'w':'9', 'x':'99', 'y':'999', 'z':'9999', ' ':'0']

    def space = " "

    def getSecuenceTipeo(String message) {
        println("*********************************************")
        String secuence = ""
        int tamanioMessage = message.length()-1
        int indice = 0
        
        while (indice <= tamanioMessage){
            println("letterrrrr: " + message[indice])
            if (indice == tamanioMessage) {
                secuence += characterTipeo.get(message[indice])
            }
            else{
                if (message[indice] != message[indice+1]){
                    secuence += characterTipeo.get(message[indice])
                }
                else{
                    secuence += characterTipeo.get(message[indice])
                    secuence += space
                }
            }

            indice++
        }

        println("*********************************************")
        return secuence
    }
}
