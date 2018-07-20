<script type="text/javascript" src="ScratchLN.js" charset="utf-8"></script>

<script>
    window.onload = function() {
        scratchLN.scratchify(".scratch",{media: '/scratch-LN/example/static/blocks-media/'});
    };
</script>

# Markdown example
The markdown file can be found [here](https://raw.githubusercontent.com/scratch4d/scratch-LN/gh-pages/example/markdown_example.md).



Draw a square:

```scratch
when greenflag clicked
set [teller] to {4}
go to x: {0} y: {0}
pen down
repeat (counter)
move {100} steps
turn cw {({360}/{(counter)})} degrees
end
pen up
```
