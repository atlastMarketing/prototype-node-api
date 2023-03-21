# campaign.js
Creation of campaigns

## Available Endpoints

### Generate Caption (`POST /campaign/regular`)
Generates a regular repetitive campaign for a specific platform and according to specific prompts and settings

**JSON request body is required**.

#### Sample JSON Request Body (Required Attributes):
```
{
    "prompt": "Create a caption for an instagram post for valentines day promoting acne medicine",
    "start_date": "1680307200380",
    "timezone": "America/Vancouver"
}
```

#### Sample JSON Request Body (Complete Attributes):
```
{
    "prompt": "Create a weekly caption promoting happy hour Wednesdays for internally moisturizing drinks",
    "prompt_info": {
        "voice": "professional",
        "platform": "Instagram"
    },
    "campaign_type": "REGULAR_REPEATED_WEEKLY",
    "start_date": 1680307200380,
    "end_date": 1685577600380,
    "timezone": "America/Vancouver",
    "meta_user": {
        "user_id": 1234567890
    },
    "meta_business": {
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


### Generate Caption (`POST /campaign/irregular`)
Generates an irregular campaign for a specific platform and according to specific prompts and settings

**JSON request body is required**.

#### Sample JSON Request Body (Required Attributes):
```
{
    "prompt": "Create a caption for an instagram post for valentines day promoting acne medicine",
    "end_date": "1680307200380",
}
```

#### Sample JSON Request Body (Complete Attributes):
```
{
    "prompt": "Create a caption for an instagram post for valentines day promoting acne medicine",
    "prompt_info": {
        "voice": "professional",
        "platform": "Instagram"
    },
    "campaign_type": "EVENT",
    "start_date": 1680307200380,
    "end_date": 1685577600380,
    "timezone": "America/Vancouver",
    "meta_user": {
        "user_id": 1234567890
    },
    "meta_business": {
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
