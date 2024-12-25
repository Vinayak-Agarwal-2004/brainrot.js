
# Brainrot.js Local Setup Guide

## Prerequisites
1. Install [Docker](https://www.docker.com/get-started).
2. Obtain API keys for:
   - GROQ
   - OpenAI
   - NEETS

## Setup Instructions

### Step 1: Create the `.env` File
In the `generate/` directory, create a file named `.env` with the following content, replacing placeholders with your API keys:

```bash
WhatsApp pe mango chakke
```

### Step 2: Build the Docker Image
Navigate to the `generate` directory and run the following command:

```bash
docker build -t brainrot .
```

*Note:* This process might take 10-15 minutes due to dependencies.

### Step 3: Run the Docker Container
Start the container with:

```bash
docker run -d --name brainrot brainrot \
  -w 1 \
  -b 0.0.0.0:5000 \
  --access-logfile access.log \
  --error-logfile error.log \
  --chdir /app/brainrot \
  transcribe:app \
  --timeout 120
```

### Step 4: Generate the Video
1. Access the running container:

   ```bash
   docker exec -it brainrot /bin/bash
   ```

2. Inside the container, run:

   ```bash
   node localBuild.mjs
   ```

3. Once completed, exit the container:

   ```bash
   exit
   ```

4. Copy the generated video to your host machine:

   ```bash
   docker cp brainrot:/app/brainrot/out/video.mp4 ./video.mp4
   ```

   The video file will be located in the current directory.

### Step 5: Modify Variables
To change the output video, edit the variables at the top of `localBuild.mjs`. Be aware that video generation takes 10-20 minutes.

---

## Common Issues

- **API Rate Limits:** 
  - If you encounter the DALL-E 3 API rate limit, reduce the number of dialogue transitions in `generate/transcript.mjs`.

- **Insufficient Storage:** 
  - Ensure at least 12.6GB of storage is available for the process.