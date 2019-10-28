package com.carsdb.view.abs;

import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.entity.DocumentState;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

public class AbstractDocumentController extends AbstractViewController
{
    protected static String NOT_FOUND = "P404";

    @Autowired
    private CarModelInfoService carModelInfoService;

    protected String dispatch(final Map<String, Object> model, final String id, final HttpServletResponse response,
            final boolean allowDraft)
    {

        setResponseCacheHeaders(response);

        if (StringUtils.isEmpty(id))
        {
            response.setStatus(HttpStatus.SC_NOT_FOUND);
            return NOT_FOUND;
        }

        final Optional<CarModelInfo> modelOpt = carModelInfoService.getById(id);

        if (!modelOpt.isPresent()
                || (!modelOpt.get().getDocumentState().equals(DocumentState.Publish) && !allowDraft))
        {
            response.setStatus(HttpStatus.SC_NOT_FOUND);
            return NOT_FOUND;
        }
        else
        {
            model.put("modelData", modelOpt.get());
            model.put("isDraft", DocumentState.Draft.equals(modelOpt.get().getDocumentState()));
        }

        return "carmodelinfotemplate";
    }
}
