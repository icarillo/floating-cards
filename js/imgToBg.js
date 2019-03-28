// I will make this function global to easily call it in other functions
const imgToBg = () => {
    var arrBoxToCover = document.querySelectorAll('[class$=Bg]');
    arrBoxToCover.forEach( el =>{
        el.style.postion = relative; // optional to make it easy to position and size the image inside the box
        el.style.overFlow = 'hidden'; // to be sure that if the image is not overflowing the box, else it can affect the layout
        el.image = el.querySelector('img'); // select the image inside
        el.image.style.opacity = 0; // make the image opacity 0 to not cover your background
        el.style.backgroundImage = `url('${el.image.src}')`;// set the image as background
        el.style.backgroundPosition = 'center center'; // set the background to be in center
        el.style.backgroundRepeat = 'no-repeat'; // no repeat background
        // set the background size as specified in th class name
        el.style.backgroundSize = (
            // if the element contains this name of class return the following
            (el.classList.contains('coverBg') && 'cover') ||
            (el.classList.contains('containBg') && 'contain')
        );
    });
};