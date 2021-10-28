import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Soundcloud from "soundcloud.ts"
import {Button, CustomCard} from '@tsamantanis/react-glassmorphism'
import '@tsamantanis/react-glassmorphism/dist/index.css'
import vinyl from './vinyl.svg'
import pepe from './3nRK.gif'

import soundcloudsvg from './soundcloud.svg'
import soundcloudgif1 from './soundcloudgif1.gif'
import soundcloudgif2 from './soundcloudgif2.gif'
import soundcloudgif3 from './soundcloudgif3.gif'

import snoop from './6os.gif'
import axios from "axios";
import cheerio from "cheerio";


function App() {

    const soundcloud = new Soundcloud('3jXdkVwgGnCwmB9q5e7qkzpaVm4qjQSn')
    const getTitle = async (url: string) => {
        const streamDetails = await soundcloud.util.getTitle(url)
        setContent(streamDetails);
    }

    const getArtwork = async (url: string) => {
        const track = await soundcloud.tracks.getV2(url)
        console.log(track.full_duration);// a  mins
        serUrlArt(track.artwork_url);
    }

    const getURL2 = () => {
        const tag = document.querySelector('a.playbackSoundBadge__titleLink.sc-truncate') as HTMLAnchorElement;
        console.log(tag)
        return tag?.href ?? "No data";
    }


    const [content, setContent] = useState('');
    const [urlcontent, seturlContent] = useState('und');
    const [urlart, serUrlArt] = useState('und');


    useEffect(() => {
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
            const currentTabID = tabs[0].id!;
            console.warn(tabs)
            //const currentTabURL = getURL(currentTabID)
            const actualTabURL = tabs[0].url;
            // @ts-ignore
            seturlContent(actualTabURL)

            // @ts-ignore


        });

    }, []);

    if (urlcontent !== 'und') {
        getTitle(urlcontent);
        getArtwork(urlcontent)
        /** axios.get(urlcontent)
         .then((response) => {
                let $ = cheerio.load(response.data);
                console.log(response.data)
                //console.log($('body'))
                let x = $('div');
                let y = $('div.playControls__elements');

                console.log('OK')
                console.log(x)
                console.log(y)

            }).catch(function (e) {
            console.log(e);
        })*/
    }

    const download = async () => {


        console.log('OK')
        let url = urlcontent;
        //url = content.url;
        const streamTrack = await soundcloud.util.streamLink(url)
        const streamDetails = await soundcloud.util.getTitle(url)
        setContent(streamDetails);
        chrome.downloads.download({url: streamTrack, filename: `${streamDetails}.mp3`})
    }/*
    return (
        <div className="App">
            <header className="App-header">
                <img src={urlart} alt="Artwork Cover" style={{width: '100px'}}/>

                <p>
                    <span className="spin"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" version="1.1" >
            <g transform="translate(0 -1028.4)">
                <path d="m12 1029.4c-6.0751 0-11 4.9-11 11 0 6 4.9249 11 11 11 6.075 0 11-5 11-11 0-6.1-4.925-11-11-11zm0 4c3.866 0 7 3.1 7 7 0 3.8-3.134 7-7 7s-7-3.2-7-7c0-3.9 3.134-7 7-7z" fill="#2c3e50"/>
                <path d="m17 1031.7c-4.783-2.8-10.899-1.1-13.66 3.7-2.7617 4.7-1.1229 10.9 3.66 13.6 4.783 2.8 10.899 1.1 13.66-3.6 2.762-4.8 1.123-10.9-3.66-13.7zm-4 6.9c0.957 0.6 1.284 1.8 0.732 2.8-0.552 0.9-1.775 1.2-2.732 0.7-0.957-0.6-1.2843-1.8-0.732-2.7 0.552-1 1.775-1.3 2.732-0.8z" fill="#2c3e50"/>
                <path d="m6.0098 1032.3c-2.2488 1.7-3.6216 4.2-3.9375 6.8l7.9647 1c0.065-0.6 0.33-1 0.782-1.4l-4.8092-6.4zm15.913 9.2-7.938-1c-0.065 0.6-0.357 1-0.808 1.4l4.809 6.4c2.248-1.7 3.621-4.2 3.937-6.8z" fill="#34495e"/>
                <path d="m12 1036.4c-2.2091 0-4 1.8-4 4s1.7909 4 4 4c2.209 0 4-1.8 4-4s-1.791-4-4-4zm0 3c0.552 0 1 0.4 1 1 0 0.5-0.448 1-1 1s-1-0.5-1-1c0-0.6 0.448-1 1-1z" fill="#f1c40f"/>
            </g>
        </svg></span> Current track: <span style={{color: "aquamarine"}}>{content}</span>
                </p>
                <Button text={'Download 🎶'} onClick={() => {
                    download()
                }}/>
            </header>
        </div>
    );*/

    return (

        (urlcontent.startsWith("https://soundcloud.com/")) ? <div className="App">
            <div id="cardWrap">
                <div className="card"></div>
                <div className="cardContent">
                    <img src={vinyl} alt="" style={{width:'25px'}} className="spin"/>
                    <img src={soundcloudgif3} alt="" style={{width:'100px'}} className="soundcloud"/>

                    <img src={urlart} alt="Artwork Cover" style={{width: '120px', borderRadius : '10%', marginLeft: '140px', marginRight:'140px', marginTop:'5px'}}/>

                    <div className="content" >
                        <h2 className="content">Current track: <h4 style={{color: "orangered", marginBlock: 'initial'}}>{content}</h4>
                        </h2>
                    </div>

                    <div style={{marginLeft: "32%"}}>
                        <Button text={'Download 🎶'} onClick={() => {
                            download()
                        }}/>
                    </div>

                </div>
            </div>


            <div className="ball ball1"></div>
            <div className="ball ball2"></div>
            <div className="ball ball3"></div>
        </div> : <div className="notInSoundcloud"><img src={snoop} alt="nope" style={{width:'25%', marginLeft: '50px'}}/><img src={pepe} alt="nope" style={{width:'40%', marginLeft: '50px'}}/><br/> <h2 style={{color:'white'}}>Parece que no estás en
            <a target="_blank" rel="noreferrer" href="https://soundcloud.com/g59/audubon" style={{color: 'orangered'}}><img src={soundcloudgif2}  style={{width:'50px'}} alt="x"/></a>... 😕</h2></div>
    );
}

export default App;
