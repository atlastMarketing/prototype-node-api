# gpt3.js
Connections to GPT, including:
- prompt engineering
- customization of other options that can be plugged into GPT-3

## Available Endpoints

### Generate Caption (`POST /ml/caption`)
Generates a caption for a specific platform, and according to a specific prompt

**JSON request body is required**.

#### Sample JSON Request Body (Required Attributes):
```
{
    "prompt": "Create a caption for an instagram post for valentines day promoting acne medicine"
}
```

#### Sample JSON Request Body (Complete Attributes):
```
{
    "prompt": "Valentines day acne medicine promotion",
    "prompt_info": {
        "voice": "professional",
        "platform": "Instagram"
    },
    "meta_user": {
        "user_id": 1234567890
    },
    "meta_business": {
        "business_name": "JAMPACK"
        "business_type": "Physical Products"
        "business_industry": "Professional, Scientific and Technical Services"
        "business_description": "Local skincare shop that imports specialty skincare from Japan and Korea, for both men and women.",
        "business_location": "Vancouver, BC, Canada",
        "business_voice": "professional"
    },
    "meta_prompt": {
        "generation_num": 1,
        "full_catalyst": "original and unedited prompt entered by user"
    }
}
```