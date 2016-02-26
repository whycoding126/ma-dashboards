/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.db.dao.SystemSettingsDao;
import com.serotonin.m2m2.module.MenuItemDefinition;
import com.serotonin.m2m2.vo.permission.Permissions;

/**
 * @author Terry Packer
 *
 */
public class AngularMenuItemDefinition extends MenuItemDefinition{
	
	Log LOG = LogFactory.getLog(AngularMenuItemDefinition.class);

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getVisibility()
	 */
	@Override
	public Visibility getVisibility() {
		return Visibility.USER;
	}

    @Override
    public boolean isVisible(HttpServletRequest request, HttpServletResponse response) {
    	return Permissions.hasPermission(Common.getUser(request), SystemSettingsDao.getValue(DashboardsPermissionDefinition.PERMISSION));
    }
	
	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getTextKey(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public String getTextKey(HttpServletRequest request,
			HttpServletResponse response) {
		return "dashboards.header.v3icontext";
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.MenuItemDefinition#getImage(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public String getImage(HttpServletRequest request,
			HttpServletResponse response) {
		return "/web/img/ng-logo.png";
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
    	return "/modules/dashboards/web/private/sb-admin/";
    }
}
