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
        control.inputs = el.querySelectorAll('.controls')

        control.setSliderValues = inputEl => {
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
                    console.log(inputEl.value);
                    oSlider.cardsShadow = parseInt(inputEl.value);
                    console.log(oSlider.cardsShadow);
                    break;
                default:
                    break;

            }
        };

        control.inputs.forEach( input => {
            input.addEventListener('input', e => { control.setSliderValues(e.currentTarget) });
        });

        return control;
    }
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

    const keyhole = document.getElementById('cardOnFocus');
    const oSlider = new Slider(keyhole);
    new Control;

    oSlider.setCards();
    oSlider.update();
    oSlider.start();
})();