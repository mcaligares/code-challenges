package teclado

import grails.test.mixin.TestFor
import spock.lang.Specification
import spock.lang.Unroll

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(SecuenceMessageService)
class SecuenceMessageServiceSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    @Unroll
    void "secuencia para escribir un mensaje"() {
//        given:
//            String message = "hello world"
//            String esperado = "4433555 555666096667775553"
        when:
            String obtenido = service.getSecuenceTipeo(message)
        then:
            esperado == obtenido
        where:
            message | esperado
            'hi' | '44 444'
            'yes' | '999337777'
            'foo bar' | '333666 6660 022 2777'
            'hello world' | '4433555 555666096667775553'

    }
}
