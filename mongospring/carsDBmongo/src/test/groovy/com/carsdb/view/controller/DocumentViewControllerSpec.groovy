package com.carsdb.view.controller

import javax.servlet.http.HttpServletRequest

import com.carsdb.view.controller.site.DocumentViewController
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class DocumentViewControllerSpec extends Specification
{
    DocumentViewController controller = new DocumentViewController()

    def "should return 404 page"()
    {
        when:
        def actual = controller.defaultModelPage()

        then:
        actual == "P404"
    }
}
