### Overview
This is where the Chat API prompts are kept

## Recommendations
##### ForeFlight Guide to Prompts: [Start Here](https://github.com/foreflight/labs-experiments/blob/main/Experiments/prompt-engineering/README.md)
### Specific to Chat API:
 - Use Markdown format
 - Add an Output spec on the bottom of the file

## Built in Tooling
 - **Assistant Creation**: Run `./create-assistants.sh $API_KEY` to create assistants in your account. Then add the ids to the yml.
 - **Tags**: Add a tag with the prompt and these will be replaced dynammically in the Chat API
   ```
   {exampleOfATagName}
   ```
   This will be replace in the Java code:
   ```java
   /* In AI Client */
   String prompt = buildPrompt(Map.of("exampleOfATagName", "This is the text that will go to the Model"));

   
   /* In PromptService.java */
   public String buildPrompt(Map<String, String> tags) {
        var fileName ="prompt-file-name.md";
        var replacements = tags;
        return loadFileAndReplace(fileName, replacements);
    }
   ```

