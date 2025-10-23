function init() {
    const seesaw = document.getElementById('seesaw');
    const baseSize = 30;
    const weightMultiplier = 2;
    const minWeight = 1;
    const maxWeight = 10;
    const minRGB = 0;
    const maxRGB = 255;
    const maxAngle = 30;
    const torques = { totalLeftTorque: 0, totalRightTorque: 0 };

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
        const { styleObj, weight } = ballInfo;
        const ball = document.createElement('div');

        ball.classList.add('ball');

        for (let prop in styleObj) {
            ball.style[prop] = styleObj[prop];
        }

        const weightLabel = document.createElement('span');

        weightLabel.textContent = weight;

        ball.append(weightLabel);
        seesaw.append(ball);
    };

    const calculateTorques = (ballTorqueInfo) => {
        const { side, weight, distanceFromSeesawCenter } = ballTorqueInfo;

        if (side === 'left') {
            torques.totalLeftTorque += weight * distanceFromSeesawCenter;
        } else {
            torques.totalRightTorque += weight * distanceFromSeesawCenter;
        }

        console.log(`total left torque = ${torques.totalLeftTorque},total right torque = ${torques.totalRightTorque}`);
    };

    const calculateAngle = () => {
        const torqueDiff = torques.totalRightTorque - torques.totalLeftTorque;
        const angle = Math.max(-maxAngle, Math.min(maxAngle, (torqueDiff / 10)));

        console.log('angle new ', angle);

        seesaw.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    };

    seesaw.addEventListener('click', function (event) {
        if (event.target === event.currentTarget) {
            const seesawRect = seesaw.getBoundingClientRect();
            const clickXOnSeesaw = event.clientX - seesawRect.x;
            const seesawCenterX = seesawRect.x + seesawRect.width / 2;
            const distanceFromSeesawCenter = Math.abs(event.clientX - seesawCenterX);

            if (event.clientX === seesawCenterX) {
                console.log('clicked center');

                return;
            }

            let side;
            const weight = getRandomInt(minWeight, maxWeight);
            const size = baseSize + weight * weightMultiplier;
            const ballRadius = size / 2;
            const left = clickXOnSeesaw - ballRadius;

            const styleObj = {
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `${getRandomRGBColor()}`,
                left:`${left}px`,
            };

            if (event.clientX < seesawCenterX) {
                side = 'left';                  
            } else {
                side = 'right';   
            }

            const ballInfoObj = { styleObj, weight};
            const ballTorqueInfo = { side, weight, distanceFromSeesawCenter };

            console.log('ball info = ', ballInfoObj);

            createBall(ballInfoObj);
            calculateTorques(ballTorqueInfo);
            calculateAngle();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
