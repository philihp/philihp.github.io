---
title: "Facebook OAuth with Scribe and Gson in Struts 1"
date: 2012-04-05
tags:
  - "Facebook"
  - "Gson"
  - "OAuth"
  - "Programming"
  - "Scribe"
  - "Struts 1.3"
author: "Philihp Busby"
---

<p>This is how I used <a href="https://github.com/fernandezpablo85/scribe-java">Scribe</a> to authenticate with the Facebook Graph API in <a href="http://struts.apache.org/">Struts 1</a>.</p>
<p>The first half of the action redirects the client to Facebook, and basically says, "no code? come back when you have one buddy". Then it goes to Facebook, who redirects the client back here (back to Facebook.redirect_uri), and with the code the server contacts Facebook directly and gets an auth token.</p>
<p>Using that, it tries to go to graph.facebook.com/me and get a JSON object of the user's data. It only wants/keeps the facebook ID.</p>
<pre lang="java">
import org.apache.struts.action.*;
import com.google.gson.*;
import org.scribe.builder.*;
import org.scribe.builder.api.*;
import org.scribe.model.*;
import org.scribe.oauth.*;

public class Authenticate extends Action {

  public ActionForward execute(ActionMapping mapping, ActionForm form,
      HttpServletRequest request, HttpServletResponse response)
      throws Exception {

    OAuthService service = new ServiceBuilder()
                               .provider(FacebookApi.class)
                               .apiKey(Facebook.client_id)
                               .apiSecret(Facebook.client_secret)
                               .callback(Facebook.redirect_uri)   //should be the full URL to this action
                               .build();

    String verifierCode = request.getParameter("code");
    if(verifierCode == null) {
      String authURL = service.getAuthorizationUrl(null);
      return new ActionForward(authURL, true);
    }
    else {
      Token accessToken = service.getAccessToken((Token)null, new Verifier(verifierCode));

      OAuthRequest authRequest = new OAuthRequest(Verb.GET, "https://graph.facebook.com/me");
      service.signRequest(accessToken, authRequest);
      Response authResponse = authRequest.send();

      JsonParser parser = new JsonParser();
      JsonObject authData = parser.parse(authResponse.getBody()).getAsJsonObject();
      request.getSession().setAttribute("facebookId",authData.getAsJsonPrimitive("id").getAsString());

      return mapping.findForward(...);
    }
  }
}
</pre>
