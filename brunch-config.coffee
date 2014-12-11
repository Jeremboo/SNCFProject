exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
      joinTo: 
        'js/app.js' : /^app|^bower_components/
    stylesheets:
      joinTo:
       'css/app.css': /^app|^bower_components/
    templates:
      joinTo: 'app.js'
  server:
    path: 'server.coffee'
