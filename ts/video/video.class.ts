

export class VideoPlayer {
    private videoPlayer: HTMLElement;
    private videoElement: HTMLVideoElement;

    private pgbTime: HTMLProgressElement;
    private btnPlayPause: HTMLElement;
    private btnNext: HTMLElement;
    private btnCurrentTime: HTMLElement;
    private btnVolume: HTMLElement;
    private btnBookmark: HTMLElement;
    private btnClosedCaption: HTMLElement;
    private btnSettings: HTMLElement;
    private btnFullScreen: HTMLElement;
    private bookmarksContainer: HTMLElement;
    private overlaysContainer: HTMLElement;
    private overlayCloseList: HTMLCollectionOf<Element>;

    private overlays: any[];
    private bookmarks: any[];

    private canUpdateTimeline: boolean;


    public constructor(videoPlayerId: string) {
        // Video Player
        this.videoPlayer = document.getElementById(videoPlayerId);
        this.videoElement = this.videoPlayer.querySelector("video");

        // DOM Elements
        this.pgbTime = this.videoPlayer.querySelector(".video-progress-bar");

        this.btnPlayPause = this.videoPlayer.querySelector(".play-pause");
        this.btnNext = this.videoPlayer.querySelector(".next");
        this.btnVolume = this.videoPlayer.querySelector(".volume");
        this.btnCurrentTime = this.videoPlayer.querySelector(".current-time");

        this.btnBookmark = this.videoPlayer.querySelector(".bookmark");
        this.btnClosedCaption = this.videoPlayer.querySelector(".cc");
        this.btnSettings = this.videoPlayer.querySelector(".settings");
        this.btnFullScreen = this.videoPlayer.querySelector(".full-screen");

        this.bookmarksContainer = this.videoPlayer.querySelector(".video-bookmarks");
        this.overlaysContainer = this.videoPlayer.querySelector(".video-overlays");
        this.overlayCloseList = this.overlaysContainer.getElementsByClassName("video-close-overlay");

        // Overlays
        this.initOverlays();

        // Bookmarks
        this.bookmarks = [];

        // Timeline updates
        this.canUpdateTimeline = true;

        // Listeners
        this.listen();
    }

    private listen() {
        this.pgbTime.addEventListener("mousedown", e => {
            // Prevent timeline form moving to current playing time.
            this.canUpdateTimeline = false;
        });

        this.pgbTime.addEventListener("click", e => {
            this.setCurrentTime(this.pgbTime.value);
            this.canUpdateTimeline = true;
        });

        this.videoElement.addEventListener("click", e => {
            this.togglePlayPause();
        });

        this.btnPlayPause.addEventListener("click", e => {
            this.togglePlayPause();
        });

        this.videoElement.addEventListener("timeupdate", e => {
            if (!this.pgbTime.hasAttribute("max")) {
                this.pgbTime.max = this.getDuration();
                console.log("updated max")
            }

            // Check popups
            if (this.canUpdateTimeline) {
                this.checkOverlays();
                this.pgbTime.value = this.getCurrentTime();
            }
        });


        // Full Screen
        this.btnFullScreen.addEventListener("click", e => {
            if (this.videoPlayer.classList.contains("full-screen")) {
                // @ts-ignore
                document.webkitCancelFullScreen();
                this.videoPlayer.classList.remove("full-screen")
            }
            else {
                // @ts-ignore
                this.videoPlayer.webkitRequestFullScreen();
                this.videoPlayer.classList.add("full-screen");
            }
        });

        // Overlays
        this.btnClosedCaption.addEventListener("click", e => {
            this.overlaysContainer.classList.add("active");
        });

        for (let i = 0; i < this.overlayCloseList.length; ++i) {
            const btnCloseOverlay = this.overlayCloseList[i];

            btnCloseOverlay.addEventListener("click", e => {
                const currentOverlay = btnCloseOverlay.parentElement;
                currentOverlay.classList.remove("active");

                this.overlaysContainer.classList.remove("active");
                this.play();
            });
        }

        // Bookmarks
        this.btnBookmark.addEventListener("click", e => {
            this.addBookmark();
        });
    }

    private initOverlays(): void {
        this.overlays = [];

        const overlayElements = this.overlaysContainer.getElementsByClassName("video-overlay");
        for (let i = 0; i < overlayElements.length; ++i) {
            let overlay: any = {};
            let element: Element = overlayElements[i];

            overlay.element = element;
            overlay.activated = false;
            // @ts-ignore
            overlay.timestamp = +element.dataset.timestamp;

            console.log(overlay);
            this.overlays.push(overlay);
        }
    }

    private togglePlayPause(): void {
        this.videoElement.paused ? this.play() : this.pause();
    }

    private play(): void {
        this.videoElement.play();
        this.btnPlayPause.classList.add("playing");
    }

    private pause(): void {
        this.videoElement.pause();
        this.btnPlayPause.classList.remove("playing");
    }

    private getDuration(): number {
        return this.videoElement.duration;
    }

    private getCurrentTime(): number {
        return this.videoElement.currentTime;
    }
    
    private setCurrentTime(time: number): void {
        this.videoElement.currentTime = time;
    }

    private checkOverlays(): void {
        for (let i = 0; i < this.overlays.length; i++) {
            let overlay = this.overlays[i];

            if (!overlay.activated && this.getCurrentTime() > overlay.timestamp) {
                this.pause();
                overlay.activated = true;
                overlay.element.classList.add("active");

                this.overlaysContainer.classList.add("active");
            }
        }
    }

    private addBookmark(): void {
        let bookmark: any = {};

        bookmark.title = "Bookmark title";
        bookmark.timestamp = this.getCurrentTime().toFixed(0);

        // Visualize
        const bookmarkElement = document.createElement("div");
        bookmarkElement.classList.add("video-bookmark");
        bookmarkElement.style.left = this.videoPlayer.clientWidth * (this.getCurrentTime() / this.getDuration()) + "px";
        this.bookmarksContainer.appendChild(bookmarkElement);

        this.bookmarks.push(bookmark);
    }
}