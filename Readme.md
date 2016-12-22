# Description
It is a token-based authentication component for AngularJS with built-in support for Google and Facebook OAuth providers, as well as Email and Password sign-in.

Obviously, you can add others OAuth providers such as Twitter, Github, etc or add any OAuth 1.0 or OAuth 2.0 provider like Sahat Yalkabov  mentioned in the Satellizer's README.

# Installation
To install this component, you need to follow the following steps:
- Clone or download the project
- Run ```npm install && bower install``` to install bower/npm dependencies
- Run ```npm default``` to build and run the project

There are 3 ways to build and run the project:
- ```gulp default```: build the project without minifying. Use it for development version.
- ```gulp default --production```: build the project with minifying. Use it for production version.
- ```gulp default --debug```: build the project with debugging. Use it when you want to check which files are used during each step of the build process.

# Installation inside AngularMicroServicesBoilerplate
After running the gulp task add (see the README of AngularMicroServicesBoilerplate), you need to add the resolve part in the home.js file of the boilerplate.
```
$stateProvider
  .state('home', {
    ...
    resolve: {
      skipIfLoggedIn: routeProvider.loginRequired
    }
  });
```


# Credits
[Sahat Yalkabov](https://github.com/sahat/) for [Satellizer](https://github.com/sahat/satellizer)

# Comments
Don't hesitate to send me any recommendations, suggestions about this component. I really want to have some returns about does it work well, does it match user expectation, etc.

You can send me any issues you want or contact me to my github email and put the repository name in the subject.
