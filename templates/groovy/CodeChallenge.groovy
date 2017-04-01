@Grab('org.spockframework:spock-core')
@Grab('org.slf4j:slf4j-api')
@Grab('ch.qos.logback:logback-classic')

import org.slf4j.Logger
import org.slf4j.LoggerFactory

class CodeChallenge extends spock.lang.Specification {
    Logger log = LoggerFactory.getLogger(CodeChallenge)

    def "your awesome test"() {
        log.info "your awesome test"
        expect:
        1 == 1
    }
}
