/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards.web;

import java.io.File;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.web.servlet.View;

import com.infiniteautomation.dashboards.Lifecycle;
import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.module.ModuleRegistry;
import com.serotonin.m2m2.module.UriMappingDefinition;
import com.serotonin.m2m2.web.mvc.UrlHandler;
import com.serotonin.m2m2.web.mvc.rest.v1.exception.ResourceNotFoundException;

/**
 * @author Terry Packer
 *
 */
public class MangoJavascriptApiV1UriMappingDefinition extends UriMappingDefinition{
    
	private static final String baseUrl = "/mango-javascript/v1/";
	
	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.UriMappingDefinition#getPermission()
	 */
	@Override
	public Permission getPermission() {
		return Permission.USER;
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.UriMappingDefinition#getPath()
	 */
	@Override
	public String getPath() {
		//Since we have a javascript mapping for /mango-javascript/ to the core's Dispatch Servlet we can simply add /v1/** to this and capture our urls this way
		return "/v1/**";
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.UriMappingDefinition#getHandler()
	 */
	@Override
	public UrlHandler getHandler() {
		return new MangoApiUrlHandler(ModuleRegistry.getModule(Lifecycle.moduleName).getDirectoryPath());
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.UriMappingDefinition#getJspPath()
	 */
	@Override
	public String getJspPath() {
		return null;
	}

	class MangoApiUrlHandler implements UrlHandler{
		
		private String dashboardsBasePath;
		
		public MangoApiUrlHandler(String modulePath){
			this.dashboardsBasePath = modulePath + "/web/js/mango/v1/" ;
		}

		/* (non-Javadoc)
		 * @see com.serotonin.m2m2.web.mvc.UrlHandler#handleRequest(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.util.Map)
		 */
		@Override
		public View handleRequest(HttpServletRequest request,
				HttpServletResponse response, Map<String, Object> model)
				throws Exception {
			
			//Here we would map to the pages by loading the view
			String contextPath = request.getRequestURI();
			//Load in the dashboard
			if(!contextPath.contains(baseUrl))
				throw new ResourceNotFoundException(contextPath);
			
			String[] parts = contextPath.split(baseUrl);
			
			File dashboard = new File(Common.MA_HOME + dashboardsBasePath + parts[1]);
			if(dashboard.exists()){
				return new DashboardJavascriptResourceView(FileUtils.readFileToString(dashboard));
			}else{
				//Return a 404
				throw new ResourceNotFoundException(dashboard.getName());
			}

		}
	}
}
