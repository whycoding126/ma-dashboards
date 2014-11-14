// sets the default page for Mango

package com.infiniteautomation.dashboards;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.serotonin.m2m2.module.DefaultPagesDefinition;
import com.serotonin.m2m2.vo.User;

public class DefaultPagesDef extends DefaultPagesDefinition {
    @Override
    public String getLoginPageUri(HttpServletRequest request, HttpServletResponse response) {
    	
    	//Edit by T.P. to grab the property for the login mapping, instead of hard code.
    	//Options: dglux sends user to /dglux/login.htm, mango sends user to /login.htm
    	if(Lifecycle.props != null){
	    	String loginMapping = Lifecycle.props.getString("loginPage", "dglux");
	    	if(loginMapping.equalsIgnoreCase("mango")){
	    		return "/login.htm";
	    	}else{
	    		return "/dglux/login.htm"; //Default URL
	    	}
    	}else{
    		return "/login.htm";
    	}
    	
        //return "/dglux/login.htm";
    }
    @Override
    public String getLoggedInPageUri(HttpServletRequest request, HttpServletResponse response, User user) {
     String loginMapping = Lifecycle.props.getString("loginPage", "dglux");
     if(loginMapping.equalsIgnoreCase("mango")){
      return "/data_point_details.shtm";
     }else{
      return "/dglux/view"; 
    }
    }
}
