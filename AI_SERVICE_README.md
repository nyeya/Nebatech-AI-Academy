# AI Service Setup Guide

## Overview
The Nebatech AI Academy includes an AI-powered lesson generator that uses OpenAI's GPT models to automatically create course content, lesson materials, project briefs, and provide code feedback.

## Features
- **Course Outline Generation**: Automatically generate complete course structures with modules and objectives
- **Lesson Content Creation**: Generate comprehensive lesson content including explanations, examples, and exercises
- **Project Brief Generation**: Create detailed project assignments with requirements and grading rubrics
- **Code Review**: AI-powered code feedback and assessment
- **Quiz Generation**: Automatically create quiz questions

## Setup Instructions

### 1. Install OpenAI PHP Client

The OpenAI PHP package should already be installed via Composer. If not, run:

```bash
composer require openai-php/client
```

### 2. Configure API Key

You need an OpenAI API key to use the AI features.

#### Option A: Using Environment Variables (Recommended)
1. Create a `.env` file in the project root if it doesn't exist
2. Add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

#### Option B: Direct Configuration
Edit `config/ai.php` and add your API key directly:
```php
return [
    'api_key' => 'sk-your-api-key-here',
    'model' => 'gpt-4-turbo-preview',
    // ...
];
```

**⚠️ Security Warning**: Never commit API keys to version control. Always use environment variables in production.

### 3. Get an OpenAI API Key

1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

### 4. Set Usage Limits (Optional but Recommended)

To prevent unexpected charges:
1. Go to OpenAI dashboard > Settings > Billing
2. Set up usage limits and budgets
3. Add payment method if required

## Model Options

The system supports various OpenAI models. Configure in `config/ai.php`:

- `gpt-4-turbo-preview` (Default) - Most capable, best quality
- `gpt-4` - Highly capable, better reasoning
- `gpt-3.5-turbo` - Faster and cheaper, good quality

## Usage Costs

Approximate costs (as of 2025):
- GPT-4 Turbo: ~$0.01 per request (depending on length)
- GPT-3.5 Turbo: ~$0.002 per request

**Tip**: Start with GPT-3.5 Turbo for testing, then upgrade to GPT-4 for production.

## Using the AI Features

### For Facilitators

#### 1. Generate Course Outline
1. Go to Facilitator Dashboard
2. Click "Generate Course Outline" in AI Tools section
3. Enter topic, level, category, and duration
4. AI generates 6-10 modules with objectives
5. Review and create course

#### 2. Generate Lesson Content
1. Click "Create Lesson Content"
2. Enter lesson topic and objectives
3. AI generates complete lesson with:
   - Main content in Markdown
   - Resources and links
   - Practice exercises
   - Key points

#### 3. Generate Project Brief
1. Click "Generate Project Ideas"
2. Enter project topic and requirements
3. AI creates:
   - Project description
   - Requirements list
   - Grading rubric
   - Starter code (if applicable)

### API Endpoints

All AI endpoints require facilitator authentication:

- `POST /ai/generate-course-outline`
- `POST /ai/generate-lesson-content`
- `POST /ai/generate-project-brief`
- `POST /ai/generate-complete-course`
- `POST /ai/generate-quiz`

## Configuration Options

Edit `config/ai.php` to customize:

```php
return [
    'api_key' => $_ENV['OPENAI_API_KEY'] ?? '',
    'model' => $_ENV['OPENAI_MODEL'] ?? 'gpt-4-turbo-preview',
    'max_tokens' => 2000,        // Maximum response length
    'temperature' => 0.7,        // Creativity (0-1, higher = more creative)
];
```

### Temperature Guide:
- `0.3-0.5`: Focused, consistent (code review, quizzes)
- `0.7-0.8`: Balanced creativity (lessons, content)
- `0.9-1.0`: Very creative (project ideas, brainstorming)

## Error Handling

The system handles common errors:

- **No API Key**: Shows error message asking to configure
- **Rate Limit**: Automatically logs error, user sees "try again"
- **Invalid Response**: Falls back gracefully with error message

Error logs are saved to `storage/logs/` for debugging.

## Testing Without API Key

For development without an API key, you can:
1. Mock the AIService class
2. Use sample data instead of real API calls
3. Comment out API calls temporarily

## Best Practices

1. **Cache Generated Content**: Store AI-generated content in database to avoid redundant API calls
2. **Review AI Output**: Always review and edit AI-generated content before publishing
3. **Set Budgets**: Configure spending limits in OpenAI dashboard
4. **Monitor Usage**: Check OpenAI dashboard regularly for usage stats
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Troubleshooting

### "OpenAI API key is not configured"
- Check `.env` file exists and contains `OPENAI_API_KEY`
- Verify API key is valid (starts with `sk-`)
- Ensure file permissions allow reading `.env`

### "Failed to generate content"
- Check internet connection
- Verify API key is valid and has credits
- Check `storage/logs/` for detailed error messages
- Confirm OpenAI service is operational

### Rate Limit Errors
- Wait a few minutes before retrying
- Upgrade to higher tier plan in OpenAI dashboard
- Implement request queuing

## Future Enhancements

Planned features:
- [ ] Batch generation for multiple lessons
- [ ] Custom prompt templates
- [ ] Fine-tuned models for educational content
- [ ] Multi-language support
- [ ] Image generation for lesson materials
- [ ] Voice-over generation for video lessons

## Support

For issues or questions:
- Check error logs in `storage/logs/`
- Review OpenAI documentation: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- Contact system administrator

## Security Notes

🔒 **Important Security Measures**:
- Never expose API keys in client-side JavaScript
- All AI calls go through server-side PHP
- Facilitator authentication required for all AI endpoints
- API keys stored in environment variables, not code
- Add `.env` to `.gitignore`

## License & Attribution

This implementation uses:
- OpenAI GPT models (OpenAI License)
- openai-php/client (MIT License)

Generated content should be reviewed and edited by qualified facilitators before use in courses.
