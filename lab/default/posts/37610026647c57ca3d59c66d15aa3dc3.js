{
    "id": "37610026647c57ca3d59c66d15aa3dc3",
    "created": 1346493240000,
    "title": "Node.js can replace WordPress !",
    "desc": "How to build a multiblog platform with Node.VaSH ?",
    "raw": "### Hey !\n\nWelcome to my new blog talking about **[node.js](/node-js/ \"View all Node.js articles\")**, **[jQuery](/jquery/ \"View all jQuery articles\")** and **new web technologies** around this community.\n\nFor the occasion, I wanted to test if it was possible easily to replace wordpress by a self made blog engine, or as others say *CMS*, with a node.js engine : **[Node.VaSH](https://github.com/G33kLabs/Node.VaSH \"Fork Node.VaSH on GitHub\")**.\n\n### What is Node.VaSH\n\n*You have a dedicated server and want to try one of the most faster blog in the world ? Try it :)*\n\nVaSh is a content manager aka a blog engine powered by **[node.js](http://nodejs.org/ \"View Node.js Website\")** and **[Redis](http://redis.io/ \"View Redis Website\")**.\nAll is driven by memory cache (static content + database) so it's really really... really fast !\n\nIncluding a **cluster architecture**, VaSh is also **highly scalable** and can host **multi blogs**.\nAs well as others blogs, it includes templates, widgets, internationalization, and auto translate features.\n\nFinally, it offers **Single Sign On** login system to help users to log them with auth providers (facebook, google, yahoo, openid, twitter, linkedin...)\nOnce connected, users can publish comments, talk...\n\n### Features\n\n- Scalable\n- Load balancing\n- Very very fast\n- Multi platform\n- Widgets (twitter, analytics...)\n- SSO (Login with facebook, twitter, google...)\n- Comments\n- <del>Templates</del> *(in beta)*\n- <del>Live chat</del>  *(in beta)*\n- <del>Internationalization</del> *(in beta)*\n- <del>Auto translate</del> *(in beta)*\n\n### Requirements\n\n``` bash\nInstall Redis...\nVisit url ==> http://redis.io/download\n\nInstall Node.js...\nVisit url ==> http://node.js\n```\n\n### Installation\nAs you're a G33K and have no GUI :\n``` bash\n$ git clone --recursive git@github.com:G33kLabs/Node.VaSH.git\n$ cd Node.VaSH\n$ npm update\n```\n\n### Configure it\n\nAn automated installer is planified in beta version, but for moment, you've to customize your blog with editing a config file with a text editor : `sites/default/config.js`\n\n#### Site informations\n\n```\n// -> Site name, Brand & copyright in footer\nsite_name: 'JS> Node',\nbrand: \"JS> Node\",\ncopyright: \"© G33K Labs | 2012\",\n```\n\n#### Main website url\n```\n// -> Production env base url (used for rss feed and permanent links)\nwebsite: 'http://www.js2node.com',\n```\n\n#### Dev website url\n```\n// -> Development env base url (used when dev flag is enabled in app config)\nlocal: 'http://local.js2node.com:10000',\n```\n\n#### Alias hostnames\n```\n// -> Alias responding to this config, will answer to \n// - http://local.js2node.com/ \n// - http://www.js2node.com/ \n// - http://localhost/\naliases: ['local.js2node.com', 'www.js2node.com', 'localhost'],\n```\n\n#### Default SEO tags\n```\n// -> Default SEO\ntitle: \"JS> Node\",\ntitle_sufix: \" | G33K\",\ndesc: \"A developer blog about js, node.js and other modern tools\",\ndesc_category: \"Discover all articles about {{cat}}{{#page_count}} - Page{{page_count}}{{/page_count}}\",\n```\n\n#### Menus in navbar (should be dynamic in beta version)\n```\n// -> Navbar menus\nmenus: ['Home', 'Nodejs', 'jQuery', 'Redis.io', 'Snippets', 'Contact'],\n```\n\n#### Activate widgets\n```\n// -> Widget loaded\nwidgets: ['aboutme', 'mostviewed', 'github', 'disqus', 'blogroll', 'archives', 'lazyload', {\n\tid: 'analytics',\n\tcode: 'Enter here your google analytics code'\n}],\n```\n\n#### Assets to package in one file and load\n```\n// -> Assets loaded and packed\nassets: {\n    css: [\n        '/common/vendors/bootstrap/bootstrap.css', \n        '/common/vendors/markdown/highlight.monokai.css',\n        '/assets/css/app.css'\n    ],\n    js: [\n        '/common/vendors/jquery.min.js', \n        '/common/vendors/async.min.js', \n        '/common/vendors/date.min.js', \n        '/common/vendors/mustache.min.js', \n        '/common/vendors/underscore.min.js', \n        '/common/vendors/backbone.min.js', \n        '/common/vendors/bootstrap/bootstrap.js', \n        '/common/vendors/jquery.lazyload.min.js', \n        '/common/vendors/humanized_time_span.js', \n        '/common/vendors/jquery.oembed.min.js',\n        '/common/vendors/jquery.social/jquery.fb.js',\n        '/common/vendors/jquery.social/jquery.gplus.js',\n        '/common/vendors/jquery.social/jquery.twitter.js',\n        '/common/vendors/VaSH.toolkit.js/vash.toolkit.js', \n        '/assets/js/app.js'\n    ]\n},\n```\n\n#### SSO providers for login\n```\n// -> Single Sign On allowed providers\nproviders: {\n    facebook: {\n        infos: {\n            clientID: 'type yours',\n            clientSecret: 'type yours'\n        },\n        opts: {\n            perms: {scope: 'email'}\n        }\n    },\n    twitter: {\n        infos: {\n            consumerKey: 'type yours',\n            consumerSecret: 'type yours'\n        } \n    },\n    github: {\n        infos: {\n            clientID: 'type yours',\n            clientSecret: 'type yours'\n        }\n    }\n},\n```\n\n#### Define admins\n```\n// -> Define admins => \"provider\"_\"userid\"\nadmins: ['twitter_244561106', 'facebook_582526084'],\n```\n\n#### Define users\n```\nauthor: 'email@domain.com',\nauthors: {\n    'email@domain.com': {\n        pseudo: 'G33K',\n        name: 'Guillaume DE LA RUE',\n        avatar: 'https://profiles.google.com/s2/photos/profile/115555146160120072472',\n        profile: 'https://plus.google.com/115555146160120072472/posts',\n\n\t\t// -> Used in 'About Me' widget\n        city: 'Paris',\n        country: 'France',\n        job: 'Consultant / Développeur',\n        employer: 'G33kLabs',\n        social: {\n            twitter: {\n                provider: 'Twitter',\n                id: '244561106',\n                pseudo: '@G33kLabs',\n                profile: 'https://twitter.com/G33kLabs',\n                classname: 'color_fluoblue'\n            },\n            github: {\n                provider: 'Github',\n                pseudo: '@G33kLabs',\n                profile: 'https://github.com/G33kLabs',\n                classname: 'color_greenlight'\n            },\n            google: {\n                provider: 'Google+',\n                id: '115555146160120072472',\n                pseudo: '@G33k',\n                profile: 'https://plus.google.com/115555146160120072472/',\n                classname: 'color_yellow'\n            }\n        }\n    }\n}\n```\n\n### Run it\n\n```\n$ node app.js\n```\n\n### Test it\n\nOpen your browser and enter the url configured (you can see that in logs) :\n\n```\n20:45:18 [*] 1 | WebServer STARTED : http://localhost:10000/\n```\n\n### Credits",
    "tags": [
        "Nodejs",
        "WordPress"
    ],
    "author": "delarueguillaume@gmail.com",
    "disabled": "no",
    "updated": 1347747159248
}