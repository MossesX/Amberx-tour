# Recorder image for the narrated walkthrough: Playwright's Chromium, ffmpeg, and the Piper voice.
FROM mcr.microsoft.com/playwright:v1.49.1-noble
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/piper /opt/voice \
 && curl -fsSL https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz | tar -xz -C /opt \
 && curl -fsSL -o /opt/voice/voice.onnx https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/high/en_US-ryan-high.onnx \
 && curl -fsSL -o /opt/voice/voice.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/high/en_US-ryan-high.onnx.json
WORKDIR /rec-app
RUN npm init -y >/dev/null && npm i -s --no-audit --no-fund playwright@1.49.1
