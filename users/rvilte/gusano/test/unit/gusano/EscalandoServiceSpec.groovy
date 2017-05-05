package gusano

import grails.test.mixin.TestFor
import spock.lang.Specification
import spock.lang.Unroll

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(EscalandoService)
class EscalandoServiceSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    @Unroll
    void "gusano escalando espera tardar #tiempodemora"() {
        when:
            int demora = service.tiempoDeSubida(profundidad, pulgadaXmin, pulgadaDesliza)
        then:
            tiempodemora == demora
        where:
            profundidad | pulgadaXmin | pulgadaDesliza | tiempodemora
            10 | 2 | 1 | 17
            20 | 3 | 1 | 19
    }
}
