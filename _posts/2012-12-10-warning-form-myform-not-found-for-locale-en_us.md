---
layout: post
title: "WARNING: Form 'myForm' not found for locale 'en_US'"
date: 2012-12-10T07:14:30Z
tags:
  - form
  - locale
  - Programming
  - Struts
  - validator
  - warning
---

It looks like [someone](http://www.servlets.com/archive/servlet/BrowseList?listName=struts-user&by=thread&from=96820) had this error in 2006, and it was never resolved. I am posting this, hoping that in 2018 someone will have the same issue again, and the [wisdom of the ancients](http://xkcd.com/979/) will not fail him.

```text
Dec 10, 2012 1:41:05 AM org.apache.commons.validator.ValidatorResources getForm
WARNING: Form 'myFormBean' not found for locale 'en_US'
```

In Struts 1.3, when you see this error in your code, it's because you have a ValidatorForm specified in your struts-config, and Struts is trying to instantiate it, and wondering what validator rules it follows. The validator is looking in your validation.xml file (the thing specified in the plug-in element in your struts-config.xml file), and not seeing any mention of your form. The bit about the locale is a red herring; **every Form bean that extends ValidatorForm listed in struts-config.xml must have a corresponding form element in validation.xml**. It doesn't matter if your ValidatorForm does all of its own validation in [validate()](http://struts.apache.org/1.3.10/apidocs/org/apache/struts/validator/ValidatorForm.html#validate(org.apache.struts.action.ActionMapping, javax.servlet.http.HttpServletRequest)). Everything will work, but if that empty element isn't in validation.xml, you will get this annoying warning, and if you [treat warnings as errors](http://visualstudiotips.wordpress.com/2006/04/16/tip-treat-warnings-as-errors/), then you're probably wondering how to fix it.

To fix it, add an empty form element to validation.xml, like this:

```xml
<form-validation>
	<formset>
		<form name="myFormBean">
	</form></formset>
</form-validation>
```

Please use this knowledge to save us from the Ko-dan armada.
