<script type="text/javascript" src="example/run_markdown.js" charset="utf-8"></script>


Draw a square:

```scratch
when greenflag clicked
set [teller] to {4}
go to x: {0} y: {0}
pen down
repeat (teller)
move {100} steps
turn cw {({360}/{(teller)})} degrees
end
pen up
```
