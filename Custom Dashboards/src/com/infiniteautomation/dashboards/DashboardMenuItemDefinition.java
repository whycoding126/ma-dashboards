/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.module.MenuItemDefinition;

/**
 * @author Terry Packer
 *
 */
public class DashboardMenuItemDefinition extends MenuItemDefinition{
	
	Log LOG = LogFactory.getLog(DashboardMenuItemDefinition.class);
	private final String defaultPage = "/private-dashboards/welcome.shtm";

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getVisibility()
	 */
	@Override
	public Visibility getVisibility() {
		return Visibility.USER;
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getTextKey(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public String getTextKey(HttpServletRequest request,
			HttpServletResponse response) {
		return "dashboards.header.icontext";
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getImage(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public String getImage(HttpServletRequest request,
			HttpServletResponse response) {
		return "web/img/dashboards.png";
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getTarget(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
    public String getTarget(HttpServletRequest request, HttpServletResponse response) {
        return "dashboards";
    }
	
    /**
     * The value of the HTML href attribute to use in the menu item. If null, no attribute will be written.
     * 
     * @param request
     *            the current request
     * @param response
     *            the current response
     * @return the href value to use
     */
    public String getHref(HttpServletRequest request, HttpServletResponse response) {
    	
    	//Load up link to default page
    	String propertiesPath = Common.MA_HOME + getModule().getDirectoryPath() + "/web/web.properties";
    	File file = new File(propertiesPath);
    	try {
			FileInputStream is = new FileInputStream(file);
			Properties webProperties = new Properties();
			webProperties.load(is);
	        return webProperties.getProperty("defaultPage", defaultPage);
		} catch (FileNotFoundException e) {
			LOG.error(e.getMessage(), e);
		} catch (IOException e) {
			LOG.error(e.getMessage(), e);
		}
        return defaultPage;
    }
    
    @Override
    public void preInitialize() {
    	Lifecycle.moduleName = getModule().getName(); //Could save ref to entire module here
    }
}
