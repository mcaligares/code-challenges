package sr_raya

import grails.test.mixin.TestFor
import spock.lang.Specification
import spock.lang.Unroll

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(KaprekarService)
class KaprekarServiceSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    @Unroll
    void "es un nro Kaprekar"() {
        when:
            String isKaprekar = service.numberIsKaprekar(number)
        then:
            isKaprekar == valorEsperado
        where:
            number | valorEsperado
            22222   |   'SI'
            75  | 'NO'
            99  | 'SI'
            100 | 'NO'
            504 | 'NO'
            1   | 'SI'
    }
}
