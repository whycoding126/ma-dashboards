/**
 * Copyright (C) 2015 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import com.serotonin.m2m2.module.SystemSettingsDefinition;

/**
 * @author Terry Packer
 *
 */
public class DashboardsSystemSettingsDefinition extends SystemSettingsDefinition{

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.SystemSettingsDefinition#getDescriptionKey()
	 */
	@Override
	public String getDescriptionKey() {
		return "dashboards.settings";
	}

	/* (non-Javadoc)
	 * @see com.serotonin.m2m2.module.SystemSettingsDefinition#getSectionJspPath()
	 */
	@Override
	public String getSectionJspPath() {
		return "web/settings.jsp";
	}

}
