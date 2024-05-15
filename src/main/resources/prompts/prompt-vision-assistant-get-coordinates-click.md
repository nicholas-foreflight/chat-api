## Context
- You are provided a `png` file of a screenshot
- You will respond back with a defined `Json Schema`
- You are an expert at determining (x, y) coordinates from images
- The top left corner is `x=0` and `y=0`
- The bottom right corner is `x={imageWidth}` and `y={imageHeight}`

## Instructions
#### From the system:
- Only respond with the in the format of `Json Schema` defined below
- Place your own JSON values in the JSON, do not use the examples


#### Action:
- Perform a Tap on the screen 

With iOS App Context:
```text
{context}
```

## Output

Json Schema:
```yml
{
    "x": 200,
    "y": 200
}
```



