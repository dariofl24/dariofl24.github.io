package com.carsdb.view.controller

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import com.carsdb.carsDBmongo.entity.CarModelInfo
import com.carsdb.carsDBmongo.entity.DocumentState
import com.carsdb.carsDBmongo.service.CarModelInfoService
import com.carsdb.view.controller.site.DocumentViewController
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class DocumentViewControllerSpec extends Specification
{

    CarModelInfoService carModelInfoService = Mock()

    DocumentViewController controller = new DocumentViewController(carModelInfoService: carModelInfoService)

    def model = Mock(java.util.Map)
    def id = "id"
    def request = Mock(HttpServletRequest)

    def "should return 404 page"()
    {

        expect:
        controller.defaultModelPage(model) == "P404"

        where:
        model = Mock(java.util.Map)
    }

    // ***

    def "published endpoint should return found page if it has published state"()
    {

        given:
        def info = Mock(CarModelInfo)

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        info.getDocumentState() >> DocumentState.Publish

        carModelInfoService.getById("id") >> Optional.of(info)

        when:
        def pageTemplate = controller.modelPagePublish(model, id, request, response)

        then:
        pageTemplate == "carmodelinfotemplate"
        1 * model.put("modelData", info);
    }

    def "published endpoint should return 404 page if found page has draft state"()
    {
        given:
        def info = Mock(CarModelInfo)

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        info.getDocumentState() >> DocumentState.Draft

        carModelInfoService.getById("id") >> Optional.of(info)

        when:
        def pageTemplate = controller.modelPagePublish(model, id, request, response)

        then:
        pageTemplate == "P404"
        0 * model.put("modelData", info);
    }

    def "published endpoint should return not found page if requested page is not found"()
    {

        given:

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        carModelInfoService.getById("id") >> Optional.empty()

        when:
        def pageTemplate = controller.modelPagePublish(model, id, request, response)

        then:
        pageTemplate == "P404"
        0 * model.put("modelData", _)
        0 * model.put("isDraft", _)
    }

    // ***

    def "admin endpoint should return found page if it has draft state"()
    {

        given:
        def info = Mock(CarModelInfo)

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        info.getDocumentState() >> DocumentState.Draft

        carModelInfoService.getById("id") >> Optional.of(info)

        when:
        def pageTemplate = controller.modelPageAdmin(model, id, request, response)

        then:
        pageTemplate == "carmodelinfotemplate"
        1 * model.put("modelData", info)
        1 * model.put("isDraft", true)
    }

    def "admin endpoint should return found page if it has publish state"()
    {

        given:
        def info = Mock(CarModelInfo)

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        info.getDocumentState() >> DocumentState.Publish

        carModelInfoService.getById("id") >> Optional.of(info)

        when:
        def pageTemplate = controller.modelPageAdmin(model, id, request, response)

        then:
        pageTemplate == "carmodelinfotemplate"
        1 * model.put("modelData", info)
        1 * model.put("isDraft", false)
    }

    def "admin endpoint should return not found page if requested page is not found"()
    {

        given:

        HttpServletResponse response = Mock() {
            1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            1 * setHeader("Pragma", "no-cache")
            1 * setDateHeader("Expires", 0)
        }

        carModelInfoService.getById("id") >> Optional.empty()

        when:
        def pageTemplate = controller.modelPagePublish(model, id, request, response)

        then:
        pageTemplate == "P404"
        0 * model.put("modelData", _)
        0 * model.put("isDraft", _)
    }
}
