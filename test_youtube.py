import httpx
import asyncio

async def test_youtube_mp3():
    async with httpx.AsyncClient() as client:
        url = 'http://localhost:8000/api/developer/youtube/youtube-to-mp3'
        data = {'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'quality': '128'}

        try:
            response = await client.post(url, json=data, timeout=30)
            print(f'Status Code: {response.status_code}')
            print(f'Response: {response.json()}')
        except Exception as e:
            print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(test_youtube_mp3())