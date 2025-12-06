// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    let start = fgPos.y * 4*bgImg.width + fgPos.x * 4;
    start = (start >= 0 ? start: 0);
    
    if(start >= bgImg.data.length)
    {
        return;
    }

    for(let i = start; i < start + (fgImg.height * bgImg.width*4) && i < bgImg.data.length; i+=4)
    {
        const colorBg = [bgImg.data[i], bgImg.data[i+1], bgImg.data[i+2], bgImg.data[i+3]/255];

        const realIndex = i/4;
        let y = Math.trunc(realIndex/bgImg.width);
        let x = realIndex % bgImg.width;
        x-=fgPos.x;
        y-=fgPos.y;
    
        if(x > fgImg.width-1 || y > fgImg.height-1 || y < 0 || x < 0)
        {
            //pula para a proxima linha quando a iteracao sair da imagem foreground
            if(x > fgImg.width-1 && x < bgImg.width-1 && y < bgImg.height-1) 
            {
                //o -1 eh para considerar o proximo i+=4 no for
                i += 4*((bgImg.width-1) - x);
                
            }
            continue;
        }
        let fgIndex = (y*fgImg.width + x)*4;
        const colorFg = [fgImg.data[fgIndex], fgImg.data[fgIndex+1], fgImg.data[fgIndex+2], fgImg.data[fgIndex+3]/255 * fgOpac];
        
        colorBg[3] = (1 - colorFg[3]) * colorBg[3];
        const alpha = colorFg[3] + colorBg[3];
        
        if(alpha === 0)
        {

            bgImg.data[i+3] = 0;
            continue;
        }
        
        const overAlpha = 1/alpha;
        bgImg.data[i] = (colorFg[0] * colorFg[3] + colorBg[0] * colorBg[3] ) * overAlpha;
        bgImg.data[i+1] = (colorFg[1] * colorFg[3] + colorBg[1] * colorBg[3] )* overAlpha;
        bgImg.data[i+2] = (colorFg[2] * colorFg[3] + colorBg[2] * colorBg[3] )* overAlpha;

        bgImg.data[i+3] = alpha*255;

    }
}
