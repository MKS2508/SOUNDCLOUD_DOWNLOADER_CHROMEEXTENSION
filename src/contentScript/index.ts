// If your extension doesn't need a background script, just leave this file empty

messageInBackground();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function messageInBackground() {
  console.log("EJECUTANDO")
  const getURL = () => {
    const tag = document.querySelector('a.playbackSoundBadge__titleLink.sc-truncate') as HTMLAnchorElement;
    return tag?.href ?? "No data";
  }

  const getTitle = () => {
    const tag = document.querySelector('div.playbackSoundBadge__title > a.playbackSoundBadge__titleLink.sc-truncate > span') as HTMLSpanElement;
    return tag?.innerText ?? "No data";
  }
  chrome.runtime.onMessage.addListener((msg, sender, callback) => {
    console.log(msg)
    callback({title: getTitle(), url: getURL(), url2: '', streamTrack: ''});
  });
}





