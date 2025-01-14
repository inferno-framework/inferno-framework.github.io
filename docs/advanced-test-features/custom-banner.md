---
title: Custom Banner
nav_order: 7
parent: Advanced Features
layout: docs
section: docs
---

# Custom Banner
Inferno Core supports displaying a custom banner for your Test Kit when run. To provide a custom banner add 
a file named `banner.html.erb` to the `config` directory of your Test Kit.

This file may include additional style information using embedded `<style>` elements, allowing you to control the look and feel of the banner.
While the contents of the banner is up to you, it is recommended that the banner not be overly large or distracting for users of your Test Kit. 

Here is an example of a custom banner.

```html
<header class="custom-banner">
  <div>
    <a href="https://example.com">Example Company, Inc.</a>
    <p class="tagline">We Build Test Kits!</p>
  </div>
</header>

<style>
.custom-banner {
  background-color:aliceblue;
  border-bottom:1px solid steelblue;
  padding:1em 1em 0 1em;
}
.custom-banner a {
  font-size:1.25em;
  text-transform:uppercase;
  text-decoration:none;
  letter-spacing:0.1em;
  color:steelblue;
  font-weight:bold;
}
</style>
```

This would generate a banner that looks like this:

{% include figure.html 
    file="example-banner.png"
    alt="Example of a custom test kit banner"
    caption="Banners are shown above the Inferno Core web interface."
    description="An screenshot of a custom banner, with example company name and tagline on a light blue background above the Inferno Core web interface"
    maxwidth="100%"
%}
