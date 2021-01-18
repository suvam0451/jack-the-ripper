

export function attachIsImage(msgAttach) {
    const url : string = msgAttach.url;
    console.log(url)
    console.log(url.indexOf("png", url.length - "png".length))
    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length) !== -1;
}