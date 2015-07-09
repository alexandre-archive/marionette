# marionette

Marionette game using Leap Motion Controller

[![img1](http://img.youtube.com/vi/s4VwsRK7D2c/1.jpg)](https://www.youtube.com/watch?v=s4VwsRK7D2c) [![img2](http://img.youtube.com/vi/s4VwsRK7D2c/2.jpg)](https://www.youtube.com/watch?v=s4VwsRK7D2c) [![img3](http://img.youtube.com/vi/s4VwsRK7D2c/3.jpg)](https://www.youtube.com/watch?v=s4VwsRK7D2c)

## Requirements

### Hardware

- LeapMotion

### Backend

- Node.JS
- Bower
- Gulp

Required only for development, if you want to host, you can use Apache, PHP, Nginx + FastCGI or any other.

### Frontend

- jQuery
- LeapJS
- LeapJS Plugins
- three.js
- three.js Stats

## Dev Setup

Before all, you need to install [NodeJS](https://nodejs.org/).

To install all dependencies run:

`npm install`

To download all third part libs run:

`bower install`

And that's it.

## Build

Run `gulp` to build everything.

## Running

To start NodeJS server run:

`node index.js`

And access [localhost:8000](http://localhost:8000).

After build you can access [localhost:8000/dist/index.html](http://localhost:8000/dist/index.html).

## License

MIT
