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

Again, when the URLs get hit, Bitbucket appends `repo=username/slug` to the
query string.

Registering these optional hooks allow remote apps to perform initial
housekeeping such as cloning a repo for indexing, or deleting any leftover
state after deactivation.

#### Commit Events

A repository app can register a URL on which to receive repository events such
as commits/pushes, issue tracker activity. This functionality aims to
supersede the existing Broker or Services mechanism that relies on code
running inside Bitbucket.

Events can be delivered in either json or xml.

### Profile Apps

These are much like repository apps with the distinction that they apply to a
user's profile page. A user can enable these apps on his own profile.

As with repository apps, apps that add custom tabs to the user's profile page
will be visible to every user visiting that profile.

Examples of profile functionality that could be implemented through remote
apps include:

* Github or LinkedIn profile page
* Aggregated statistics of all repos you have contributed to on Bitbucket and
  other sites, coderwall-style
* Resume page

Profile apps declare tabs in the same way as repository apps:

	<tab key="statstab" label="Karma" url="http://empty-ocean-7664.herokuapp.com/stats.html"/>

The URL gets the name of the repository added to the query string:
`?repo=username/slug`

Activation and deactivation hooks are equal to those of the repository apps.

### User Apps

The final category of apps is those that bind to the user's own session and
are a bit like Atlassian Speakeasy plugins.

A user app declares one or more static resources such as js and css files that
are included in each page that is rendered. These resources CAN be served from
the Bitbucket domain (for instance by having them in a repository and linking
straight to the raw files).

Since javascript can be served from Bitbucket and are loaded into the pages
directly, this gives it full access to the user's account and the DOM. They
can therefore be used to completely change the look and feel of the site.

Activation of user apps is controlled by a user on his own account page and
only affects the user in question. In contrast to profile apps, user apps have
no impact at all on other users that browse the profile page. Their static
resources are included only in the pages of the user who enabled the app.

Below is an example of a user app declaration, which uses the `<user>`
element:

	<user>
        <script url="https://bitbucket.org/evzijst/bb-themes/raw/c57ba59ada03/static/bb.js"/>
        <css url="https://bitbucket.org/evzijst/bb-themes/raw/c57ba59ada03/static/bb.css"/>
    </user>

As with the tab URLs in both repo and profile apps, whenever Bitbucket
includes these resource links in the page, it appends the name of the current
user to the query string. This allows the remote app to personalize the
scripts if necessary: `username=username`

Authentication
--------------

Authentication between remote apps and Bitbucket relies heavily on OAuth
(3LO).

For iframe tabs, when Bitbucket embeds the URLs for the remote page, it does
not add anything to the request other than appending the name of the resource
viewed (e.g. `repo=username/slug`). The request carries nothing that could
tell the remote app which Bitbucket user is viewing the page.

If the remote app requires knowledge of the current user, it should
authenticate the user by sending it through the "OAuth dance" during which the
user is redirected back to Bitbucket and asked to authorize the remote app to
access his account.

When the OAuth dance is completed and the user authorized the remote app, the
app should retrieve the user's account name by hitting the REST endpoint:
`https://bitbucket.org/!api/1.0/user`

It is recommended that remote apps do not implement their own login system and
user accounts. Instead, they should automatically create user records for the
users that authorize the app through OAuth. In the user record they create
after the first successful authorization, they should store the user's access
token and optionally the Bitbucket username.

It is also recommended they create a session cookie and store that with the
account record. Now the user will be properly authenticated on subsequent
requests.

Should the user return from another computer that does not have a cookie set,
the remote app should send the user through the OAuth dance as normal, lookup
the username and when an account record for that Bitbucket user already
exists, it should issue a new cookie (optionally replacing the existing one in
its database). It should also replace the old access token with the newly
obtained one.

A remote app should in general always authorize the user against Bitbucket.
This is because it will often have to protect its data from unauthorized
access by users who do not have permission to see the Bitbucket resource that
the app is bound to.

For instance, a remote app that implements full text search for repositories
will have to make sure it returns a 401 response to users that do not have
at least read access on the repositories it has indexed. To verify this, it
should hit the privileges REST endpoint.

