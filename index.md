A remote application is a webapp that is hosted entirely independent from
Bitbucket, can be built and run by anyone. It integrates with Bitbucket to add
features and functionality to Bitbucket without requiring the help or
assistance of Bitbucket staff.

It communicates with Bitbucket through the REST API, authenticates using OAuth
and adds visual elements to Bitbucket's UI through the inclusion of iframes.

Examples of functionality that can be implemented as remote apps include:

* Repository full content search
* Programming language and committer activity statistics

This document describes how remote apps work and what purpose they serve.
