function init() {
    const seesaw = document.getElementById('seesaw');
    const baseSize = 40;
    const weightMultiplier = 4;
    const minWeight = 1;
    const maxWeight = 10;
    const minRGB = 0;
    const maxRGB = 255;

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomRGBColor = () => {
        const r = getRandomInt(minRGB, maxRGB);
        const g = getRandomInt(minRGB, maxRGB);
        const b = getRandomInt(minRGB, maxRGB);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const createBall = (ballInfo) => {
        const { styleObj, side, weight } = ballInfo;
        const ball = document.createElement('div');

        ball.classList.add('ball');

        for (let prop in styleObj) {
            ball.style[prop] = styleObj[prop];
        }

        ball.dataset.side = side;
        ball.dataset.weight = weight;

        const weightLabel = document.createElement('span');

        weightLabel.textContent = weight;

        ball.append(weightLabel);
        seesaw.append(ball);
    };

    const calculateWeights = () => {
        let totalLeftWeight = 0;
        let totalRightWeight = 0;
        const balls = document.querySelectorAll('.ball');

        balls.forEach(ball => {
            const side = ball.dataset.side;
            const weight = parseInt(ball.dataset.weight);

            if (side === 'left') {
                totalLeftWeight += weight;
            }

            if (side === 'right') {
                totalRightWeight += weight;
            }
        });

        console.log(`total left weight = ${totalLeftWeight},total right weight = ${totalRightWeight}`);
    };

    seesaw.addEventListener('click', function (event) {
        if (event.target === event.currentTarget) {
            const seesawRect = seesaw.getBoundingClientRect();
            const clickXOnSeesaw = event.clientX - seesawRect.x;
            const seesawCenterX = seesawRect.width / 2;

            if (clickXOnSeesaw === seesawCenterX) {
                console.log('clicked center');

                return;
            }

            let side;
            const weight = getRandomInt(minWeight, maxWeight);
            const size = baseSize + weight * weightMultiplier;
            const styleObj = {
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `${getRandomRGBColor()}`,
            };
            const ballRadius = size / 2;

            if (clickXOnSeesaw < seesawCenterX) {
                side = 'left';
                styleObj[side] = `${clickXOnSeesaw - ballRadius}px`;                
            } else {
                side = 'right';
                styleObj[side] = `${seesawRect.width - clickXOnSeesaw - ballRadius}px`;
            }

            const ballInfoObj = { styleObj, side, weight };

            console.log('ball info =', ballInfoObj);

            createBall(ballInfoObj);
            calculateWeights();
        }
    });
}

document.addEventListener('DOMContentLoaded',init);
