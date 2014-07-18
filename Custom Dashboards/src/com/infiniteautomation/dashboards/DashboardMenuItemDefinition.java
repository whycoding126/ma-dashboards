/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.serotonin.m2m2.module.MenuItemDefinition;

/**
 * @author Terry Packer
 *
 */
public class DashboardMenuItemDefinition extends MenuItemDefinition{

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
        return "/dashboards/defaultDashboard.shtm";
    }
    
    @Override
    public void preInitialize() {
    	Lifecycle.moduleName = getModule().getName(); //Could save ref to entire module here
    }
}
