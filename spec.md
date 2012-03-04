Specification
=============


Goal, Aim, or Target
--------------------

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

The deployment descriptor file is the only piece of of information that is
provided to Bitbucket. Below is an example of a descriptor:

	<app xmlns="http://bitbucket.org/bitbucket-app-1.0.xsd">
    	<slug>helloworld</slug>
    	<name>Hello World</name>
    	<description>Add an tab that says Hello World.</description>
    	<developer>Atlassian</developer>
    	<website>https://bitbucket.org/evzijst/bb-hello-world</website>
    	<repo>
        	<tab key="hwtab1" label="Hello" url="http://empty-ocean-7664.herokuapp.com/hw.html"/>
    	</repo>
	</app>

It declares a new tab on the repo page which is populated through an iframe
running at Heroku.

### Deploying

To deploy this app, create a normal Git or Hg repo that has
`bitbucket-app.xml` in the root and push it up to Bitbucket. Bitucket will
detect this file, validate it and then make the app available to users.

If the deployment descriptor is invalid, Bitbucket will reject the push and
send a notification to the owner of the repo to explain the validation error.
This is to ensure that there can be no partial or invalid remote apps
deployed.

The repo hosting the descriptor file must be public, or the app will not be
deployed. This is to ensure users can have a better understanding of what the
app will add in terms of plugin points and who its author is.

### Enabling 

A remote app is not automatically activated on deployment. It merely becomes
available to users. A remote app is "installed" or "activated" on a per-repo
basis (or per profile or user, as described further on) and is then visible to
everyone visiting the repo page.

To enable a remote app on a repo, the repo admin clicks "Remote apps" on the
repo admin tab and then types the name of the app to enable. This page also
lists all apps that are enabled on the repo and offers the ability to disable
each one.

### Updating

To update a descriptor, simply push the change to the repo. Redeployment takes
effect immediately.

### BRA Removal

To completely remove a remote app from Bitbucket (as opposed to disabling an
app on a per-repo basis), simply delete the `bitbucket-app.xml` file from the
repo, make the repo private, or remove the repo entirely. Removal of an app
takes effect immediately .


BRA Types or Scopes
-------------------

There are three different resources which each have their own remote apps,
each corresponding to a type of Bitbucket resource:

1 Repositories
2 Profiles
3 Users

### Repository Apps

These are apps that bind to a repository and can use all the plugin points
available to repos. This currently includes the ability to add new iframed
tabs and webhooks through which events can be received asynchronously.

Currently defined events include:

* Commits/pushes to the repo
* Activation of the app on a new repo
* Deactivation of the app on a repo

The repo app type is represented by the `<repo>` element in the app descriptor.
An app descriptor can only contain a single `<repo>` element.

#### UI Tabs

To declare a tab, use the following nested element:

	<tab key="hwtab1" label="Hello" url="http://empty-ocean-7664.herokuapp.com/hw.html"/>

The `key` attribute needs to be a unique identifier within the descriptor. It
is used by Bitbucket to uniquely identify which tab is active in cases where
an app declares more than one.

The `label` is the string that is used on the newly created tab. Although
recommended, it is not enforced to be unique. Note that Bitbucket also does
not enforce uniqueness of tab labels between apps. This is to not restrict
apps different apps that each choose to declare their own "search" tab for
instance.

The `url` points to the page that will be loaded in the iframe on the page of
the tab. This URL MUST NOT be hosted on Bitbucket itself, but on a foreign
domain. URLs pointing to bitbucket.org will cause the deployment to be
rejected. The reason for this is javascript's same origin policy. It must not
be possible for these remote tabs to load custom javascript that has access to
the user's cookie to make uncontrolled, authenticated calls to Bitbucket on
behalf of the user.

When bitbucket loads the iframe, it takes the URL and adds the name of the
repository to the query string. In this example that means that when the app
is enabled on repository `evzijst/foo`, the URL that Bitbucket hits when the
tab is opened is:
`http://empty-ocean-7664.herokuapp.com/hw.html?repo=evzijst/foo`

The localization of the URL tells the remote app which repository is being
accessed.

#### Activation/Deactivation Events

A `<repo>` element can include the following elements that are used by
Bitbucket to signal the activation or deactivation of an app by a repo admin:

	<activate url="http://empty-ocean-7664.herokuapp.com/activate"/>
	<deactivate url="http://empty-ocean-7664.herokuapp.com/deactivate"/>


### Profile Apps

These are much like repository apps with the distinction that they apply to a
user's profile page. A user can enable these apps on his own profile.

As with repository apps, apps that add custom tabs to the user's profile page
will be visible to every user visiting that profile.

Examples of profile functionality that could be implemented through remote apps
include:

* Github or LinkedIn profile page
* Aggregated statistics of all repos you have contributed to on Bitbucket and
  other sites
* Resume page

Profile apps declare tabs in the same way as repository apps:

	<tab key="statstab" label="Karma" url="http://empty-ocean-7664.herokuapp.com/stats.html"/>

The URL gets the name of the repository added to the query string:
`?repo=username/slug`


