#
#
# Usage:
#    ./create-assistants.sh sk-proj-sbGHaHaMadeYouLookX
#

export SPRING_AI_OPENAI_API_KEY=$1


####### Create prompt-system-how-to-with-driver.md       ###############################################################
#PROMPT_FILE='system/prompt-system-how-to-with-driver.md'
#SYSTEM_PROMPT=$(cat $PROMPT_FILE)
#JSON_PAYLOAD=$(jq -n --arg instructions "$SYSTEM_PROMPT" --arg name "$PROMPT_FILE" '
#{
#  instructions: $instructions,
#  name: $name,
#  tools: [{"type": "file_search"}],
#  model: "gpt-4o-2024-05-13",
#  tool_resources: {
#    file_search: {
#      vector_store_ids: ["vs_cubsnZQwQS7gs9UeJ5xVuG6f"]
#    }
#  }
#}')
#
#curl "https://api.openai.com/v1/assistants" \
#  -H "Content-Type: application/json" \
#  -H "Authorization: Bearer $SPRING_AI_OPENAI_API_KEY" \
#  -H "OpenAI-Beta: assistants=v2" \
#  -d "$JSON_PAYLOAD"


####### Create prompt-system-how-to-without-driver.md    ###############################################################
PROMPT_FILE='system/prompt-system-how-to-without-driver.md'
SYSTEM_PROMPT=$(cat $PROMPT_FILE)
JSON_PAYLOAD=$(jq -n --arg instructions "$SYSTEM_PROMPT" --arg name "$PROMPT_FILE" '
{
  instructions: $instructions,
  name: $name,
  tools: [{"type": "file_search"}],
  model: "gpt-4o-2024-05-13",
  tool_resources: {
    file_search: {
      vector_store_ids: ["vs_cubsnZQwQS7gs9UeJ5xVuG6f"]
    }
  }
}')

curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SPRING_AI_OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d "$JSON_PAYLOAD"







########  Create prompt-vision-assistant-get-coordinates-tap.md    ####################################################
#PROMPT_FILE='system/prompt-vision-assistant-get-coordinates-tap.md'
#SYSTEM_PROMPT=$(cat $PROMPT_FILE)
#JSON_PAYLOAD=$(jq -n --arg instructions "$SYSTEM_PROMPT" --arg name "$PROMPT_FILE" '
#{
#  instructions: $instructions,
#  name: $name,
#  model: "gpt-4-vision-preview"
#}')
#
#curl "https://api.openai.com/v1/assistants" \
#  -H "Content-Type: application/json" \
#  -H "Authorization: Bearer $SPRING_AI_OPENAI_API_KEY" \
#  -H "OpenAI-Beta: assistants=v2" \
#  -d "$JSON_PAYLOAD"
#
########  Create prompt-vision-assistant-get-coordinates-swipe    #######################################################
#PROMPT_FILE='system/prompt-vision-assistant-get-coordinates-swipe.md'
#SYSTEM_PROMPT=$(cat $PROMPT_FILE)
#JSON_PAYLOAD=$(jq -n --arg instructions "$SYSTEM_PROMPT" --arg name "$PROMPT_FILE" '
#{
#  instructions: $instructions,
#  name: $name,
#  model: "gpt-4-vision-preview"
#}')
#
#curl "https://api.openai.com/v1/assistants" \
#  -H "Content-Type: application/json" \
#  -H "Authorization: Bearer $SPRING_AI_OPENAI_API_KEY" \
#  -H "OpenAI-Beta: assistants=v2" \
#  -d "$JSON_PAYLOAD"
#
