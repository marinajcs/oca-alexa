
function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

function getUrlDado(n) {
    let url;
    switch(n) {
        case 1:
            url = "https://www.dropbox.com/scl/fi/rpz96bbwx3e9jt2toaih4/1-video.mp4?rlkey=oto3mwhrm3px1shjvvk5v8epq&raw=1";
            break;
        case 2:
            url = "https://www.dropbox.com/scl/fi/8lgzjqkk7lb9ngxqzl1kp/2-video.mp4?rlkey=tuyvfpoqh6y7etynh4jn659rj&raw=1";
            break;
        case 3:
            url = "https://www.dropbox.com/scl/fi/59aov32bc4bul5d52a2zo/3-video.mp4?rlkey=kphvx55r8zbfqul6brr9zmfpt&raw=1";
            break;
        case 4:
            url = "https://www.dropbox.com/scl/fi/efq1j1epjovv9dqznhevj/4-video.mp4?rlkey=b7857z2ouyihdhv2t1tt9obbh&raw=1";
            break;
        case 5:
            url = "https://www.dropbox.com/scl/fi/hjfttpb0d28kflcfueyvw/5-video.mp4?rlkey=braq8jtjmtpg7ijzz6lsev5et&raw=1";
            break;
        case 6:
            url = "https://www.dropbox.com/scl/fi/94dwkq1yh6bj7xu5x73vq/6-video.mp4?rlkey=rvkrybsc0gnq12y9aji09pt4p&raw=1";
            break;
    }
    return url;
}

module.exports = {
    tirarDado,
    getUrlDado
};
