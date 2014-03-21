meteor-custom-accounts-forms
============================

###### MeteorJS &amp; Bootstrap 3: Custom sign in/sign up forms

Go and see live demo at [mmotel.kd.io:3000](http://mmotel.kd.io:3000/). To see demo click on `Click to continue: mmotel.kd.io:3000`.

### Dependencies

You need `meteorite` to use [Atmosphere Smart Packages](https://atmosphere.meteor.com/).

```sh
npm install -g meteorite
```

or

```
sudo -H npm install -g meteorite
```

### Meteor & [Atmosphere](https://atmosphere.meteor.com/) packages management

```sh
meteor add jquery
meteor add account-ui
meteor add accounts-password
mrt add bootstrap-3
meteor remove insecure
meteor remove autopublish
```

###Application structure

```
├── client
│   ├── client.js
│   ├── index.html
│   ├── styles.css
│   └── views
│       ├── accounts-forms.css
│       ├── accounts-forms.html
│       └── accounts-forms.js
├── model.js
├── server
│   └── server.js
├── smart.json
```

###Run application

```sh
meteor
````
