BRA: Bitbucket Remote Apps
==========================

Anatomy of a BRA
----------------

A remote application is a webapp that is hosted entirely independent from
Bitbucket, can be built and run by anyone. It integrates with Bitbucket to add
features and functionality to Bitbucket without requiring the help or
assistance of Bitbucket staff.

It communicates with Bitbucket through the REST API, authenticates using OAuth
and adds visual elements to Bitbucket's UI through the inclusion of iframes.

Aim
---

To allow any user to build any kind of addon functionality, be it open or
closed, to the Bitbucket site. Allow him to host said application on his
platform of choice, written in any programming language.

This application can be registered on Bitbucket for anyone discover and use.


Registration of New BRAs
------------------------

A BRA is represented by a deployment descriptor. This is an XML file that
describes all properties of the remote app, including:

* Publisher name and details
* Human readable description
* Every Bitbucket plugin point that is exploited
* Full external URLs to every resource that is linked to (e.g. iframe tabs or
  static js and css)


