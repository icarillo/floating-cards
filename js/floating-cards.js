(() => {
    //this function will be used to generate random colors
    const randomColor = () => {
        const arrChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        let hexColor ="#";
        for(let i = 0; i < 6; i++){
            hexColor += arrChar[Math.floor(Math.random()*15)];
        }
        return hexColor;
    };

    // SLIDER OBJECT
    const Slider = function (el) {
        // SETTINGS and BASIC PROPERTIES
        const slider = this;
        slider.el = el;
        slider.width = slider.el.offsetWidth;
        // how much the cards will translate from the center based on their importance
        slider.cardsDistance = slider.width;
        // value for spread of shadow for each card
        slider.cardsShadow = -15;
        // default interval between slides in milliseconds
        slider.interval = 2500;
        // How much the last card will DESATURATE (thinking in %)
        slider.satVar = 100;
        // How much the last card will SCALE DOWN (thinking in %)
        slider.scaleVar = 30;
        // array to store my cards/slides
        slider.cards = [];
        
        // METHODS
        // setting the cards that will be used
        slider.setCards = () => {
            // selecting all elements with the class "card" inside the slider element
            const arrCards = slider.el.querySelectorAll('.card');
            // set cards and their hierarchy 
            arrCards.forEach( (value, key) => {
                // Hierarchy will tell me were they should be positioned and how to show it
                // the hierarchy will vary from negative to positive value like: -2, -1, 0 , 1 , 2
                // 0 will be considered the main card. as far as the other cards are from the main card, less important they are
                const hierarchy = key - Math.floor(arrCards.length / 2);
                // Create the cards as a new object to easily manipulate that and store in an array
                slider.cards.push(new Card(value, hierarchy, slider.width));
            });
        };
        // to move my cards I need to change their hierarchy
        slider.move = (direction = 'next') => {
            // before I change the hierarchy I need to know what is the minimum and the maximum values that I can use based on the number of cards stored in my slider
            const min = 0 - Math.floor(slider.cards.length / 2);
            const max = Math.floor((slider.cards.length - 1) / 2);
            // now I will change the hierarchy of each card considering the direction that I am moving
            slider.cards.forEach( card => {
                const newHierarchy = (  
                    // If I change to next (slide to left) I need to subtract 1
                    (direction == 'next' && card.hierarchy > min && card.hierarchy - 1) ||
                    // If the card is already the minimum value on hierarchy (extreme left) I will send it to the maximum value (extreme right)
                    (direction == 'next' && card.hierarchy === min && max)||
                    // If I change to previous (slide to right) I need to add 1
                    (direction == 'previous' && card.hierarchy < max && card.hierarchy + 1) ||
                    // If the card is already the maximum value on hierarchy (extreme right) I will send it to the minimum value (extreme left)
                    (direction == 'previous' && card.hierarchy === max && min)
                );
                // now I will update the card hierarchy properly, using it update methods
                // I used a ternary to return 0, because as I am using logical operators, when newHierarchy is 0 this value is read as "false" and not number 0
                card.update(!newHierarchy?0:newHierarchy);
            });
            // now that I updated all cards hierarchy, I will update my slider to style them using the slider sets
            slider.update();
        };
        // update my slider information when the cards hierarchy change
        slider.update = () => {
            // for each card I want to apply the correspondent style using the slider sets
            slider.cards.forEach( card => {
                // the importance will be used to apply some styles, it will vary from 0 (more important) to 1 (less important)
                const importance = Math.abs(card.hierarchy) / Math.floor(slider.cards.length/2);
                // scale will depend of the importance and the "scale variation" of the slider the most important will always have scale 1
                const scale = 1 - (importance * slider.scaleVar/100);
                // will work as the scale, depending of the importance and "saturation variation"
                const saturate = 1 - (importance * slider.satVar/100);
                // the x position will change base on the hierarchy it self from negative to positive numbers as explained
                const xPos = card.hierarchy * slider.cardsDistance;
                // the z position will use the opposite of the hierarchy absolute value been 0 or negative, using this as z-index the less important cards will be always behind the most important
                const zPos = 0 - Math.abs(card.hierarchy);
                // the transition need to be related to the interval between slides so we are sure that the slider will not change the slide before the transition ends
                card.el.style.transition = `all ${slider.interval/2}ms ease`;
                // applying the shadow spread
                card.el.style.boxShadow = `0 5px 15px ${slider.cardsShadow}px #333333`;
                // applying scales
                card.el.style.transform = `scale(${scale}) translateX(${xPos}px)`;
                // applying saturations
                card.el.style.filter = `saturate(${saturate})`;
                // applying Z position
                card.el.style.zIndex = zPos;
            });
        };
        // call this method to slide to left
        slider.next = () => {
            slider.move('next');
        }
        // call this method to slide to right
        slider.prev = () => {
            slider.move('previous');
        }
        // call this method to start sliding automatically according to slider.interval
        slider.start = () => {
            startslider = setInterval(slider.move, slider.interval);
        };
        // call this method to stop sliding automatically
        slider.stop = () => {
            clearInterval(startslider);
        };

        return slider;
    };

    // CARD OBJECT
    const Card = function(el, hierarchy, width) {
        const card = this;
        // here I store the element as a property to manage the style later
        card.el = el;
        // the card width will be set according to slider specifications
        card.width = width;
        // the hierarchy is important fot the slider to how to position and style the cards
        card.hierarchy = hierarchy;
        // in case my image is not loading I will fill the card with a random color
        card.color = randomColor();

        // setting the card element styles
        card.el.style.width = `${card.width}px`;
        card.el.style.backgroundColor = card.color;

        // call this method to update the card hierarchy
        card.update = hierarchy => {
            card.hierarchy = hierarchy;
        };

        return card;
    };

    // CONTROL OBJECT
    const Control = function (el = document.querySelector('#control')) {
        const control = this;
        control.el = el;
        control.rangeHolders = el.querySelectorAll('.range-holders');
        control.rangeHolders.forEach( el => {
            el.input = el.querySelector('input[type=range]');
            el.style.height = '20px';
            el.style.position = 'relative';
            el.trackComponents = {
                slideThumb: document.createElement('span'),
                before: document.createElement('span'),
                after: document.createElement('span')
            };
            for( const property in el.trackComponents){
                el.prepend(el.trackComponents[property]);
                const style = el.trackComponents[property].style;
                const thisComponent = el.trackComponents[property];
                el.input.style.opacity = '0';
                style.position = 'absolute';                  
                style.bottom = '0';

                switch(property){
                    case 'before':
                        thisComponent.width = 100 * (el.input.value - el.input.min) / (el.input.max - el.input.min) ;
                        style.height = '4px';
                        style.borderRadius = '2px 0 0 2px';
                        style.width = `${thisComponent.width}%`;
                        style.left = '0';
                        style.background = '#343333';
                        break;
                    case 'after':
                        thisComponent.width = 100 * (el.input.max - el.input.value) / (el.input.max - el.input.min);
                        style.height = '4px';
                        style.borderRadius = '0 2px 2px 0';
                        style.width = `${thisComponent.width}%`;
                        style.right = '0';
                        style.background = '#cccccc';
                        break;
                    case 'slideThumb':
                        thisComponent.position = 100 * (el.input.value - el.input.min) / (el.input.max - el.input.min) ;
                        style.height = '12px';
                        style.width = '12px';
                        style.left = `${thisComponent.position}%`;
                        style.bottom = '-4px';
                        style.transform = 'translate(-50%)';
                        style.borderRadius = '6px';
                        style.background = '#db4f16';
                        break;
                    default:
                        break;
                };
            };
            
            // METHODS
            el.updateValues = newValue => {
                el.trackComponents.before.style.width = `${100 * (newValue - el.input.min) / (el.input.max - el.input.min)}%`;
                el.trackComponents.after.style.width = `${100 * (el.input.max - newValue) / (el.input.max - el.input.min)}%`;
                el.trackComponents.slideThumb.style.left = `${100 * (newValue - el.input.min) / (el.input.max - el.input.min)}%`;
            };
        });

        control.changeSliderValues = inputEl => {
            switch (inputEl.id){
                case 'distance':
                    oSlider.cardsDistance = 200 + (parseInt(inputEl.value)/100) * 100;
                    break;
                case 'scale':
                    oSlider.scaleVar = 100 - parseInt(inputEl.value);
                    break;
                case 'speed':
                    oSlider.stop();
                    oSlider.interval = 3000 - (parseInt(inputEl.value) * 20);
                    oSlider.start();
                    break;
                case 'saturation':
                    oSlider.satVar = 100 - parseInt(inputEl.value);
                    break;
                case 'shadow':
                    oSlider.cardsShadow = parseInt(inputEl.value);
                    break;
                default:
                    break;
            }
        };
        

        //EVENTS
        control.rangeHolders.forEach( el => {
            el.input.addEventListener('input', e => { 
                control.changeSliderValues(e.currentTarget);
                el.updateValues(e.currentTarget.value);
            });
        });

        return control;
    }

    const keyhole = document.getElementById('cardOnFocus');
    const oSlider = new Slider(keyhole);
    new Control;

    oSlider.setCards();
    oSlider.update();
    oSlider.start();
})();