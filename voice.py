import speech_recognition as sr

r = sr.Recognizer()

with sr.Microphone(device_index=3) as source:
    print("Speak now...", flush=True)

    audio = r.listen(source)

try:
    text = r.recognize_google(audio)
    print(text, flush=True)

except:
    print("", flush=True)