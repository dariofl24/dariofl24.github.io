package com.carsdb.view.controller;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.entity.DocumentState;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import com.carsdb.view.abs.AbstractViewController;

@Controller
public class DocumentViewController extends AbstractViewController {

	@Autowired
	private CarModelInfoService carModelInfoService;

	private static String NOT_FOUND = "P404";

	@RequestMapping(value = "/model", method = RequestMethod.GET)
	public String defaultModelPage(final Map<String, Object> model) {

		return NOT_FOUND;
	}

	@RequestMapping(value = "/model/{id}", method = RequestMethod.GET)
	public String modelPagePublish(final Map<String, Object> model, @PathVariable final String id,
			final HttpServletRequest request, final HttpServletResponse response) {

		return this.dispatch(model, id, response, false);
	}

	@RequestMapping(value = "/adminmodel/{id}", method = RequestMethod.GET)
	public String modelPageAdmin(final Map<String, Object> model, @PathVariable final String id,
			final HttpServletRequest request, final HttpServletResponse response) {

		return this.dispatch(model, id, response, true);
	}

	protected String dispatch(final Map<String, Object> model, final String id, final HttpServletResponse response,
			final boolean allowDraft) {

		setResponseCacheHeaders(response);

		if (StringUtils.isEmpty(id)) {
			response.setStatus(HttpStatus.SC_NOT_FOUND);
			return NOT_FOUND;
		}

		final Optional<CarModelInfo> modelOpt = carModelInfoService.getById(id);

		if (!modelOpt.isPresent()
				|| (!modelOpt.get().getDocumentState().equals(DocumentState.Publish) && !allowDraft)) {
			response.setStatus(HttpStatus.SC_NOT_FOUND);
			return NOT_FOUND;
		} else {
			model.put("modelData", modelOpt.get());
			model.put("isDraft", DocumentState.Draft.equals(modelOpt.get().getDocumentState()));
		}

		return "carmodelinfotemplate";
	}

}//
