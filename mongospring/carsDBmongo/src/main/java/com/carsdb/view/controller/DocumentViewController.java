package com.carsdb.view.controller;

import java.util.Map;
import java.util.Optional;

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

@Controller
public class DocumentViewController {

	@Autowired
	private CarModelInfoService carModelInfoService;

	@RequestMapping(value = "/model", method = RequestMethod.GET)
	public String defaultModelPage(final Map<String, Object> model) {

		return "P404";
	}

	@RequestMapping(value = "/model/{id}", method = RequestMethod.GET)
	public String modelPagePublish(final Map<String, Object> model, @PathVariable final String id,
			final HttpServletResponse response) {

		return this.dispatch(model, id, response, false);
	}

	@RequestMapping(value = "/adminmodel/{id}", method = RequestMethod.GET)
	public String modelPageAdmin(final Map<String, Object> model, @PathVariable final String id,
			final HttpServletResponse response) {

		return this.dispatch(model, id, response, true);
	}

	private String dispatch(final Map<String, Object> model, @PathVariable final String id,
			final HttpServletResponse response, final boolean allowDraft) {

		if (StringUtils.isEmpty(id)) {
			response.setStatus(HttpStatus.SC_NOT_FOUND);
			return "P404";
		}

		final Optional<CarModelInfo> modelOpt = carModelInfoService.getById(id);

		if (!modelOpt.isPresent()
				|| (!modelOpt.get().getDocumentState().equals(DocumentState.Publish) && !allowDraft)) {
			response.setStatus(HttpStatus.SC_NOT_FOUND);
			return "P404";
		} else {
			model.put("modelData", modelOpt.get());
		}

		return "carmodelinfotemplate";
	}

}//
