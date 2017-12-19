This is just a little demo of how to use electron to dynamically `install` and `require` NPM tarballs.

Instructions:
1. Create an npm tarball:
    1. Create a new directory
    2. `npm init` to create a new `package.json`; make note of your entry script
    3. Create your entry script: `index.js` unless you changed it during `npm init`
    4. When you're done with your code type `npm pack` in your project directory. This will create you a nice little .tgz file named after your project.
2. Run `electron .` in the root of this project. Oh yea, [install electron](https://electronjs.org/docs/tutorial/installation) if you haven't already.
3. Drag and drop your .tgz file on to the electron app. You should see some debug information in the console window where you fired up electron. Your app is now loaded!
