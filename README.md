# Custom HTML5 Video Player
Ingo Andelhofs  
Student at UHasselt  
2018-2020 &copy;

## Concept
```html
<VideoPlayer>
    <VideoPopup timestamp="10">
        <h1>This popup will show up after 10 seconds.</h1>
        <p>This is an example popup.</p>
        
        <VideoButton action="close">Close</VideoButton>
    </VideoPopup>

    <VideoPopup timestamp="100">
        <h1>This popup will show up after 100 seconds.</h1>
        <p>This is another example popup with a jump button.</p>
        
        <VideoButton action="jump" to-timestamp="120">Jump</VideoButton>
    </VideoPopup>
</VideoPlayer>
```