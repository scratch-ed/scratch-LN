# scratch LN
Provide an textual representation of the blocks from scratch 3.0. This text can be used within an html document and using some javascript magic this wil be converted to scratch blocks. Also some function to indicate certain blocks are provided.

<img src="https://scratch4d.github.io/scratch-LN/img/simple_html_and_rendering_en.PNG">

## Usage
If you are not a developer, you can use the instructions below to use this in your projects. 
An example can be found: [example scratch exercises](https://github.com/Ellen102/ScratchExercises).
 
Three files can be found in the `dist` folder. 

### Basic `scratchify.js`
This the typical file where you have to call yourself when scratchify will run. 
You can give options to the function. Atm  this is only the 'class' of which elements need to be scratchified.
The default class is `scratch`.
```
  <script type="text/javascript" src="scratchify.js" charset="utf-8"></script>
  
  <script>
  window.onload = function() {
    scratchLN.scratchify();
  };
  </script>
```
In html the following code will be rendered to scratch. 
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

### Auto `auto_scratchify_scratch.js`
This will run without additional code and uses the the class `scratch` (same html as above).
```
<script type="text/javascript" src="auto_scratchify_scratch.js" charset="utf-8"></script>
```

### Auto (Kramdown) `auto_scratchify_scratch.js`
This will run without additional code and uses the the class `language-scratch`. As in the output from Kramdown.
```
<script type="text/javascript" src="auto_scratchify_language_scratch.js" charset="utf-8"></script>
```
In Kramdown the code below will be inside`<pre class="language-scratch"><code></code></pre>`. 
This script will automatically call scratchify for this. 
```
    ```scratch
    when greenflag clicked
    go to x: {0} y: {0}
    pen down
    repeat 5
    move {100} steps
    turn cw {({360}/{5})} degrees
    end
    pen up
    ```
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
