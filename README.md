# scratch LN
Provide an textual representation of the blocks from scratch 3.0. This text can be used within an html document and using some javascript magic this wil be converted to scratch blocks. Also some function to indicate certain blocks are provided.

<img src="https://scratch4d.github.io/scratch-LN/img/simple_html_and_rendering_en.PNG">

## Usage
If you are not a developer, you can use the instructions below to use this in your projects. 
An example can be found: [scripts](https://github.com/scratch4d/scripts).
 
The javascript file `ScratchLN.js` can be found in the `dist` folder.
It is explained below how to use it.

Scratch 3.0 needs the files inside `static/blocks-media` to render the greenflag,arrows, etc correctly. 
Therefore, the media property must be set correctly, see below.  
 

### Basic `scratchify`
This the typical file where you have to call yourself when scratchify will run. 
You can give options to the function. Atm  this is only the 'class' of which elements need to be scratchified.
The default class is `scratch`.
In the header of the html file add the following.
```
  <script type="text/javascript" src="ScratchLN.js" charset="utf-8"></script>
  
  <script>
  window.onload = function() {
    scratchLN.scratchify();
  };
  </script>
```
In html use the code like this: 
```
<pre class="scratch">
<code>
when greenflag clicked
set [teller] to {4}
go to x: {0} y: {0}
pen down
repeat (counter)
move {100} steps
turn cw {({360}/{(counter)})} degrees
end
pen up
</code>
</pre>
```
When you open the page with a browser it will be rendered as Scratchblocks.

### Modifications `scratchify` with arguments
The `scratchify`-function takes 2 arguments. First, the selector see: https://www.w3schools.com/jquery/jquery_ref_selectors.asp for all possible options.
Second a properties object, which can overwrite the default properties of the workspace. 
The default properties are given below.
```
{
    //this is exactly the same as blockly/scratchblocks properties
    readOnly: true,
    toolbox: '<xml></xml>',
    scrollbars: false,
    trashcan: false,
    comments: true,
    media: '/static/blocks-media/', //location of the images, sounds, etc.
    colours: {
        fieldShadow: 'rgba(255, 255, 255, 1)' //workspace color
    },
    zoom: {
        startScale: 0.5    //zoomlevel
    },
    
    //extra locale
    locale: "en",  //natural language of the blocks
}
```
This are the properties for the workspace as defined in Scratchblocks. 
An extra property `locale` is added, to define the language of the blocks.

In html some of these properties can be overwritten, 
namely the locale i.e. the natural language of the blocks, and  
the scale this is the size of the blocks.
An example:
```
<code class='scratch' blocks-locale="nl" blocks-scale="1">
    say "hello"
    say {1222};
    say {(varie)};
</code>
```



## Getting Started - development
0. open a terminal and clone this project.
1. run `npm install`
2. run `npm start` 
3. in the webbrowser go to:
	
	- `localhost:8008` : live preview: debug
	- `localhost:8008\view.html` : live preview: clean
	- `localhost:8008\test.html` : list of text and the result
	- `localhost:8008\example.html`  : example exercise (teken het cdj logo)
	- `localhost:8008\simple.html` : simple html

###  Running tests
0. go to the root folder
1. run `npm install`
2. run `npm test` 

### Generating dist
0. go to the root folder
1. run `npm install`
2. open `webpack.config.js`
3. comment the first part of the export and uncomment the second part. 

## Authors

* **Ellen Vanhove**

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE) file for details
