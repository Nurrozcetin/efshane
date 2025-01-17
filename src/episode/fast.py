from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
import pyttsx3
from pydub import AudioSegment
import uuid
import time

app = FastAPI()

UPLOADS_DIR = os.path.abspath(os.path.join("..", "..", "uploads", "audio"))
print(f"Uploads Directory: {UPLOADS_DIR}")
os.makedirs(UPLOADS_DIR, exist_ok=True)

class TextToSpeechRequest(BaseModel):
    content: str

@app.post("/text_to_speech")
async def text_to_speech(request: TextToSpeechRequest):
    try:
        content = request.content
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')

        for voice in voices:
            if "Tolga" in voice.name:
                engine.setProperty('voice', voice.id)
                break
        engine.setProperty('rate', 130)  

        timestamp = int(time.time() * 1000)
        random_suffix = uuid.uuid4().hex[:8]
        output_mp3_file = os.path.join(UPLOADS_DIR, f"audioFile-{timestamp}-{random_suffix}.mp3")

        temp_wav_file = os.path.join(UPLOADS_DIR, f"temp_audio_{uuid.uuid4().hex}.wav")

        engine.save_to_file(content, temp_wav_file)
        engine.runAndWait()

        sound = AudioSegment.from_wav(temp_wav_file)
        sound.export(output_mp3_file, format="mp3")

        os.remove(temp_wav_file)

        relative_path = f"/uploads/audio/{os.path.basename(output_mp3_file)}"
        absolute_url = f"http://localhost:3000{relative_path}" 
        return {"filePath": absolute_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
