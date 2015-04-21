/**
 * Copyright (C) 2015 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import com.serotonin.m2m2.module.PermissionDefinition;

/**
 * @author Terry Packer
 *
 */
public class DashboardsPermissionDefinition extends PermissionDefinition{

	public static final String PERMISSION = "dashboards.view";
	
	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.PermissionDefinition#getPermissionKey()
	 */
	@Override
	public String getPermissionKey() {
		return "dashboards.permission.view";
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.PermissionDefinition#getPermissionTypeName()
	 */
	@Override
	public String getPermissionTypeName() {
		return PERMISSION;
	}
}
