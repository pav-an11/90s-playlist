import os

folder_path = "music"
songs = os.listdir(folder_path)

print("const songs = [")
for song in songs:
    if song.endswith(".mp3"):
        print(f'    {{ url: "music/{song}" }},')
print("];")