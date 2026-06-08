---
title: "Using Eclipse WTP with Maven's eclipse:eclipse Goal"
date: 2011-11-01
tags:
  - "download"
  - "eclipse"
  - "jpa"
  - "maven"
  - "Programming"
  - "wtp"
author: "Philihp Busby"
---

<p>If you use Maven's "eclipse:eclipse" goal to generate a project descriptor for eclipse, by default you're just going to get a plain Java project. You'll have to add in the Dynamic Web facet in order to tell Eclipse that you can deploy this project in a web container. The easy way around this is to configure the maven-eclipse-plugin in the pom.xml file like this:</p>
<pre lang="xml" escaped="true">&lt;plugin&gt;
  &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
  &lt;artifactId&gt;maven-eclipse-plugin&lt;/artifactId&gt;
  &lt;version&gt;2.8&lt;/version&gt;
  &lt;configuration&gt;
    &lt;wtpContextName&gt;some/url/context&lt;/wtpContextName&gt;
    &lt;wtpversion&gt;1.5&lt;/wtpversion&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</pre>
<p>Also, I like to download sources and Javadoc, which makes navigating in Eclipse a lot easier. This can be done like this.</p>
<pre lang="xml" escaped="true">&lt;plugin&gt;
  ...
  &lt;configuration&gt;
    &lt;downloadSources&gt;true&lt;/downloadSources&gt;
    &lt;downloadJavadocs&gt;true&lt;/downloadJavadocs&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</pre>
<p>Supposing you also want your project to have JPA facets, or other additional project facets you could also add them in like this</p>
<pre lang="xml" escaped="true">&lt;plugin&gt;
  ...
  &lt;configuration&gt;
    &lt;additionalProjectFacets&gt;
      &lt;jpt.jpa&gt;2.0&lt;/jpt.jpa&gt;
    &lt;/additionalProjectFacets&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</pre>
<p>And all of these can be combined to do this</p>
<pre lang="xml" escaped="true">&lt;plugin&gt;
  &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
  &lt;artifactId&gt;maven-eclipse-plugin&lt;/artifactId&gt;
  &lt;version&gt;2.8&lt;/version&gt;
  &lt;configuration&gt;
    &lt;wtpContextName&gt;list&lt;/wtpContextName&gt;
    &lt;wtpversion&gt;1.5&lt;/wtpversion&gt;
    &lt;downloadSources&gt;true&lt;/downloadSources&gt;
    &lt;downloadJavadocs&gt;true&lt;/downloadJavadocs&gt;
    &lt;additionalProjectFacets&gt;
      &lt;jpt.jpa&gt;2.0&lt;/jpt.jpa&gt;
    &lt;/additionalProjectFacets&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</pre>
