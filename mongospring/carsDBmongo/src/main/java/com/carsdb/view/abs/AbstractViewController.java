package com.carsdb.view.abs;

import javax.servlet.http.HttpServletResponse;

public class AbstractViewController {
	
	protected void setResponseCacheHeaders(final HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
    }

}
