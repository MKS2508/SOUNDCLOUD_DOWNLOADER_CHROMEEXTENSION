import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Soundcloud from "soundcloud.ts"
import {Button, CustomCard} from '@tsamantanis/react-glassmorphism'
import '@tsamantanis/react-glassmorphism/dist/index.css'
import vinyl from './vinyl.svg'

// @ts-ignore
import ID3Writer from 'browser-id3-writer'
import snoop from './6os.gif'
import pepe from './3nRK.gif'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner"
import soundcloudsvg from './soundcloud.svg'
import soundcloudgif1 from './soundcloudgif1.gif'
import soundcloudgif2 from './soundcloudgif2.gif'
import soundcloudgif3 from './soundcloudgif3.gif'
import ytdl from 'ytdl-core';
const streamToBlob = require('stream-to-blob')


function App() {

    const soundcloud = new Soundcloud('3jXdkVwgGnCwmB9q5e7qkzpaVm4qjQSn')
    const getTitle = async (url: string) => {
        const streamDetails = await soundcloud.util.getTitle(url)
        setContent(streamDetails);
    }
    const getTYt = async (url: string) => {
        console.log('error aki?')
        debugger;
        const yturl = ytdl('https://www.youtube.com/watch?v=5YZ6lRYXJE4')


        const blob = await streamToBlob(yturl)
        const blob2 = new Blob([blob], {type:'audio/mp3'});
        const blob3 = new File([blob],'audio.mp3');
        const blob4 = new File([blob2],'audio.mp3');

        const urlformblob = URL.createObjectURL(blob3)
        const urlformblob2 = URL.createObjectURL(blob4)

        console.log({blob:blob2})

        console.log({url:urlformblob})
        chrome.downloads.download({url:urlformblob, filename: 'video.mp3'})
        chrome.downloads.download({url:urlformblob2, filename: 'video.mp3'})

       // console.log(blob)
        // @ts-ignore
                console.log("Stream complete");

        //const urlobj = new Blob([yturl]);
       // console.log({yturl: yturl, urlobj:'urlobj'})
        //chrome.downloads.download({url:'urlobj'})

    }

    const getArtwork = async (url: string) => {
        const track = await soundcloud.tracks.getV2(url)
        serUrlArt(track.artwork_url);
    }

    const downloadWithMetadata = async () => {
        console.log('OK')
        let url = urlcontent;
        const streamTrack = await soundcloud.util.streamLink(url) // streamable track - url
        const streamMetadata = await soundcloud.tracks.getV2(url) // all extra title metadata
        const streamDetails = await soundcloud.util.getTitle(url) // track title
        const addMetadataAndDownload = (url: string, url2: string) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            let arrayBuffer = xhr.response;
            xhr.onload = () => {
                if (xhr.status === 200) {

                    arrayBuffer = xhr.response;

                    const xhr2 = new XMLHttpRequest();
                    xhr2.open('GET', url2, true);
                    xhr2.responseType = 'arraybuffer';
                    xhr2.onload = () => {
                        if (xhr2.status === 200) {
                            console.log({response: xhr.response})
                            console.log({response2: xhr2.response})

                            const writer = new ID3Writer(xhr.response);
                            writer.setFrame('TIT2', streamDetails)
                                .setFrame('TPE1', [streamMetadata.user.username])
                                .setFrame('TYER', parseInt(streamMetadata.release_date))
                                .setFrame('TCON', [streamMetadata.genre])
                                .setFrame('WPAY', 'SOUNDCLOUD')
                                .setFrame('APIC', {
                                    type: 3,
                                    data: xhr2.response,
                                    description: 'Cover picture'
                                });
                            writer.addTag();
                            const downurl = writer.getURL();
                            chrome.downloads.download({url: downurl, filename: `${streamDetails}.mp3`})
                            //setUrlDown()
                        }
                    };
                    xhr2.send();
                    // go next
                } else {
                    // handle error
                    console.error(xhr.statusText + ' (' + xhr.status + ')');
                }
            };
            xhr.onerror = () => {
                // handle error
                console.error('Network error');
            };
            xhr.send();
            return arrayBuffer
        }
        const RawMP3InArrayBuffer = addMetadataAndDownload(streamTrack, streamMetadata.artwork_url)
    }

    const [content, setContent] = useState('');
    const [urlcontent, seturlContent] = useState('und');
    const [urlart, serUrlArt] = useState('und');

    const [load, setLoad] = useState({initTime: false, check: false, download: 0});
    useEffect(() => {
        let initialTimer = setTimeout(() => setLoad({initTime: true, check: false, download: 0}), 1200);
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
            const currentTabID = tabs[0].id!;
            const actualTabURL = tabs[0].url;
            getTYt('')

            // @ts-ignore
            seturlContent(actualTabURL)
        });
    }, []);

    if (urlcontent !== 'und') {
        getTitle(urlcontent);
        getArtwork(urlcontent)
    }
if (urlcontent.startsWith("https://soundcloud.com/") == false){
    return (
        <div className="notInSoundcloud">
            <img src={snoop} alt="nope" style={{width: '25%', marginLeft: '50px'}}/>
            <img src={pepe} alt="nope" style={{width: '40%', marginLeft: '50px'}}/>
            <br/>
            <h2 style={{color: 'white'}}>Parece que no est??s en<a target="_blank" rel="noreferrer"
                                                                  href="https://soundcloud.com/g59/audubon"
                                                                  style={{color: 'orangered'}}><img
                src={soundcloudgif2} style={{width: '50px'}} alt="x"/></a>... ????</h2>
        </div>
    );
}
else {
    return (
        (!load.initTime) ?
            <div className="App">
                <div id="cardWrap">
                    <div className="card"></div>
                    <div className="cardContent">
                        <Loader type="Puff" color="#ff6b00" height={'inherit'} width={'inherit'}/>
                    </div>
                </div>
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball3"></div>

                </div>
             :
            <div className="App">
                <div id="cardWrap">
                    <div className="card"></div>
                    <div className="cardContent">

                        <img src={vinyl} alt="" style={{width: '25px'}} className="spin"/>
                        <img src={soundcloudgif3} alt="" style={{width: '100px'}} className="soundcloud"/>

                        <img src={urlart} alt="Artwork Cover" style={{
                            width: '120px',
                            borderRadius: '10%',
                            marginLeft: '140px',
                            marginRight: '140px',
                            marginTop: '5px'
                        }}/>

                        <div className="content">
                            <h2 className="content">Current track: <h4
                                style={{color: "orangered", marginBlock: 'initial'}}>{content}</h4>
                            </h2>
                        </div>

                        <div style={{marginLeft: "32%"}}>
                            <Button text={'Download ????'} onClick={() => {
                                downloadWithMetadata()
                            }}/>
                        </div>

                    </div>
                </div>
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
            </div>
    );
}
//        (true) ? '' :

}

export default App;
