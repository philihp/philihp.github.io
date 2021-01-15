---
layout: post
title: Turning an Image File into a binary Bitmask in Java
date: 2012-09-28 19:34:29.000000000 -07:00
tags:
  - arduino
  - bitmask
  - image
  - Java
  - Programming
redirect_from:
  - /blog/2012/turning-an-image-file-into-a-binary-bitmask-in-java
  - /blog/2012/turning-an-image-file-into-a-binary-bitmask-in-java/
---

<p>Some people who have stumbled across my <a href="http://www.philihp.com/blog/2011/diy-led-hula-hoop/">LED Hoop</a> have asked how I imported the <a href="http://carrotcreative.com">Carrot</a> logo into a bitmask in <a href="https://github.com/philihp/Jubilee/blob/master/carrot.h">source code</a>.</p>
<p>I thought I had deleted it, but I recently found it...</p>
<pre lang="java">
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class ImageRead {

    public static boolean hilo(int pixel) {
    	int r, g, b;
    	r = (pixel &gt;&gt; 16) & 0xFF;
    	g = (pixel &gt;&gt; 6) & 0xFF;
    	b = (pixel) & 0xFF;
    	return (r + g + b &gt; 0x7F * 3);
    }

    public static void main(String[] args) throws IOException {
    	BufferedImage img = ImageIO.read(new File("carrotboolean.jpg"));
    	int width = img.getWidth();
    	int heighth = img.getHeight();
    	System.out.println("uint32_t carrot[" + width + "] = {");
    	for (int x = 0; x &lt; width; x++) {
    		int col = 0x00000000;
    		for (int y = 0; y &lt; heighth; y++) {
    			int pixel = img.getRGB(x, y);
    			if (hilo(pixel)) {
    				col++;
    			}
    			col &lt;&lt;= 1;
    		}
    		System.out.print("0x");
    		for(int j=Integer.toHexString(col).length()-8; j&lt;0;j++)
    			System.out.print("0");
    		System.out.println(Integer.toHexString(col).toUpperCase()+",");
    	}
    }

}

</pre>
<p>I hope this saves someone some time. It worked at least once, and that's all I needed it for. I make no guarantees that it will work a second time, but it might save someone some time.</p>
