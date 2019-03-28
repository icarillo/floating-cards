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

    const Slider = function (el) {
        // SETTINGS and BASIC PROPERTIES
        const slider = this;
        slider.el = el;
        slider.width = slider.el.offsetWidth;
        slider.cardsDistance = slider.width;
        slider.cardsShadow = -15;
        slider.interval = 2500; // interval when changing slides in milliseconds
        slider.satVar = 100; // how many TIMES the saturation will vary between the slide in the center and the last slides
        slider.scaleVar = 30; // how many TIMES the scale will vary between the slide in the center and last slides
        slider.cards = []; // array to store my cards/slides
        

        // METHODS
        // setting the cards that will be used
        slider.setCards = () => {
            const arrCards = slider.el.querySelectorAll('.card');
            arrCards.forEach( (value, key) => {
                // Hierarchy will tell me were ther should be positioned and how to show it
                const hierarchy = key - Math.floor(arrCards.length / 2);
                // Create the cards as a new object to easily manipulate that and store in an array
                slider.cards.push(new Card(value, hierarchy, slider.width));
            });
        };
        slider.update = () => {
            slider.cards.forEach( card => {
                const importance = Math.abs(card.hierarchy) / Math.floor(slider.cards.length/2);
                const scale = 1 - (importance * slider.scaleVar/100);
                const saturate = 1 - (importance * slider.satVar/100);
                const xPos = card.hierarchy * slider.cardsDistance;
                const zPos = 0 - Math.abs(card.hierarchy);
                card.el.style.transition = `all ${slider.interval/2}ms ease`;
                card.el.style.boxShadow = `0 5px 15px ${slider.cardsShadow}px #333333`;
                card.el.style.transform = `scale(${scale}) translateX(${xPos}px)`;
                card.el.style.filter = `saturate(${saturate})`;
                card.el.style.zIndex = zPos;
            });
        };
        slider.move = (direction = 'next') => {
            const min = 0 - Math.floor(slider.cards.length / 2);
            const max = Math.floor((slider.cards.length - 1) / 2);
            slider.cards.forEach( card => {
                const hierarchy = (
                    (direction == 'next' && card.hierarchy > min && card.hierarchy - 1) ||
                    (direction == 'next' && card.hierarchy === min && max)||
                    (direction == 'previous' && card.hierarchy < max && card.hierarchy + 1) ||
                    (direction == 'previous' && card.hierarchy === max && min)
                );
                card.update(!hierarchy?0:hierarchy);
            });
            slider.update();
        };
        slider.next = () => {
            slider.move('next');
        }
        slider.prev = () => {
            slider.move('previous');
        }
        slider.start = () => {
            startslider = setInterval(slider.move, slider.interval);
        };
        slider.stop = () => {
            clearInterval(startslider);
        };

        return slider;
    };

    const Card = function(el, hierarchy, width) {
        const card = this;
        // here I store the element as a property to manage the style later
        card.el = el;
        card.width = width;
        card.hierarchy = hierarchy;
        card.color = randomColor();

        card.el.style.width = `${card.width}px`;
        card.el.style.backgroundColor = card.color;
        card.update = hierarchy => {
            card.hierarchy = hierarchy;
        };

        return card;
    };

    const Control = function (el = document.querySelector('#control')) {
        const control = this;
        control.el = el;

        control.rangeHolders = el.querySelectorAll('.range-holders');
        control.rangeHolders.forEach( el => {
            el.input = el.querySelector('input');
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